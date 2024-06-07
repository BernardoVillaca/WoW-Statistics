import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { versionRegionBracketMapping, VersionMapping, RegionMapping, BracketMapping } from '~/utils/helper/versionRegionBracketMapping';
import { asc, count, eq, and, SQL, gte, lte, or } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const version = (searchParams.get('version') ?? 'retail') as keyof VersionMapping;
  const region = (searchParams.get('region') ?? 'us') as keyof RegionMapping;
  const bracket = (searchParams.get('bracket') ?? '3v3') as keyof BracketMapping;

  // Other parameters
  const search = searchParams.get('search') || '';
  const faction = searchParams.get('faction') || ''; // faction_name on the db
  const realm = searchParams.get('realm') || ''; // realm_slug on the db
  const minRating = parseInt(searchParams.get('minRating') ?? '0'); // rating on the db
  const maxRating = parseInt(searchParams.get('maxRating') ?? '4000'); // rating on the db
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = 50;
  const offset = (page - 1) * limit;

  try {
    // Fetch mapping
    const versionMapping = versionRegionBracketMapping[version];
    if (!versionMapping) {
      throw new Error(`Invalid version: ${version}`);
    }

    const regionMapping = versionMapping[region];
    if (!regionMapping) {
      throw new Error(`Invalid region: ${region}`);
    }

    const bracketMapping = regionMapping[bracket];
    if (!bracketMapping) {
      throw new Error(`Invalid bracket: ${bracket}`);
    }

    const { table } = bracketMapping;

  
    let andConditions: SQL[] = [];
    let orConditions: SQL[] = [];

    if (search) {
      const decodedSearch = decodeURIComponent(search).trim();
      const searchTerms = decodedSearch.split(',').map(term => term.trim());

      searchTerms.forEach(term => {
        let [specName, ...classNames] = term.split(' ');
        let className = classNames.join(' ');

        if (specName && className) {
          orConditions.push(
            and(
              eq(table.character_spec, specName),
              eq(table.character_class, className)
            ) as unknown as SQL
          );
        }
      });
    }

    if (faction) {
      andConditions.push(eq(table.faction_name, faction.toUpperCase()));
    }
    if (realm) {
      andConditions.push(eq(table.realm_slug, realm.toLowerCase()));
    }
    if (minRating) {
      andConditions.push(gte(table.rating, minRating));
    }
    if (maxRating) {
      andConditions.push(lte(table.rating, maxRating));
    }

    let combinedConditions;
    if (orConditions.length > 0) {
      combinedConditions = and(...andConditions, or(...orConditions));
    } else {
      combinedConditions = and(...andConditions);
    }

    
    const [results, totalResult] = await Promise.all([
      db.select().from(table).where(combinedConditions).limit(limit).offset(offset).orderBy(asc(table.rank)),
      db.select({ count: count() }).from(table).where(combinedConditions)
    ]);

    const total = totalResult[0]?.count ?? 0;

    return NextResponse.json({ results, total });
  } catch (error: any) {
    console.error('Error executing query:', error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}