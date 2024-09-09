import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import type { VersionMapping, RegionMapping, BracketMapping } from '~/utils/helper/versionRegionBracketMapping';
import { versionRegionBracketMapping } from '~/utils/helper/versionRegionBracketMapping';
import { count, eq, and, gte, lte, or, desc, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { retailLegacyLeaderboard } from '~/server/db/schema';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const version = (searchParams.get('version') ?? 'retail') as keyof VersionMapping;
  const region = (searchParams.get('region') ?? 'us') as keyof RegionMapping;
  const bracket = (searchParams.get('bracket') ?? '3v3') as keyof BracketMapping;

  // Other parameters
  const resultsperPage = searchParams.has('resultsPerPage') ? Number(searchParams.get('resultsPerPage')) : 50;
  const pvpSeasonIndex = searchParams.has('pvpSeasonIndex') ? Number(searchParams.get('pvpSeasonIndex')) : 37;
 
  const orderBy=  searchParams.get('orderBy') ?? '';
  const path = searchParams.get('path') ?? '';
  const search = searchParams.get('search') ?? '';
  const faction = searchParams.get('faction') ?? '';
  const realm = searchParams.get('realm') ?? '';
  const minRating = parseInt(searchParams.get('minRating') ?? '0', 10);
  const maxRating = parseInt(searchParams.get('maxRating') ?? '4000', 10);
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const limit = resultsperPage;
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

    const andConditions: SQL[] = [];
    const orConditions: SQL[] = [];

    if (search) {
      const decodedSearch = decodeURIComponent(search).trim();
      const searchTerms = decodedSearch.split(',').map(term => term.trim());

      searchTerms.forEach(term => {
        const [specName, ...classNames] = term.includes('Beast')
          ? ['Beast Mastery', 'Hunter']
          : term.split(' ');
        const className = classNames.join(' ');
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
    const queryTable = path === '/legacy' ? retailLegacyLeaderboard : table;
   
    if (path === '/legacy') {
      if (pvpSeasonIndex) andConditions.push(eq(retailLegacyLeaderboard.pvp_season_index, pvpSeasonIndex));
      andConditions.push(eq(retailLegacyLeaderboard.bracket, bracket));
      andConditions.push(eq(retailLegacyLeaderboard.region, region));
    }

    if (path === '/activity' && 'updated_at' in queryTable) {
      const twoHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000); // 5 hours ago
      const twoHoursAgoISOString = twoHoursAgo.toISOString();
      andConditions.push(sql`${queryTable.updated_at} >= ${sql.raw(`'${twoHoursAgoISOString}'`)}`);
    }

    if (faction) andConditions.push(eq(queryTable.faction_name, faction.toUpperCase()));

    if (realm) andConditions.push(eq(queryTable.realm_slug, realm.toLowerCase()));

    if (minRating) andConditions.push(gte(queryTable.rating, minRating));

    if (maxRating) andConditions.push(lte(queryTable.rating, maxRating));

    if (path !== '/legacy') andConditions.push(sql`${queryTable.character_spec} <> ''`);

    const combinedConditions = orConditions.length > 0
      ? and(...andConditions, or(...orConditions))
      : and(...andConditions);


    const order = orderBy === 'played' ? desc(queryTable.played) : desc(queryTable.rating);

    const [results, totalResult] = await Promise.all([
      db.select().from(queryTable).where(combinedConditions).limit(limit).offset(offset).orderBy(order),
      db.select({ count: count() }).from(queryTable).where(combinedConditions)
    ]);

    const total = totalResult[0]?.count ?? 0;

    return NextResponse.json({ results, total });
  } catch (error) {
    console.error('Error executing query:', (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
