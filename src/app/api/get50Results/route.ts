import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { us3v3Leaderboard, us2v2Leaderboard } from '~/server/db/schema';
import { asc, count, eq, and, SQL, gte, lte, or } from 'drizzle-orm';


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  const faction = searchParams.get('faction'); // faction_name on the db
  const realm = searchParams.get('realm'); // realm_slug on the db
  const minRating = parseInt(searchParams.get('minRating') ?? '0'); // rating on the db
  const maxRating = parseInt(searchParams.get('maxRating') ?? '4000'); // rating on the db
  const bracket = searchParams.get('bracket') ?? '3v3';

  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = 50;
  const offset = (page - 1) * limit;

  // Select the correct table based on the bracket parameter
  const table = bracket === '2v2' ? us2v2Leaderboard : us3v3Leaderboard;

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

  try {
    const [results, totalResult] = await Promise.all([
      db.select().from(table).where(combinedConditions).limit(limit).offset(offset).orderBy(asc(table.rank)),
      db.select({ count: count() }).from(table).where(combinedConditions)
    ]);

    const total = totalResult[0]?.count ?? 0;

    return NextResponse.json({ results, total });
  } catch (error) {
    console.error('Error executing query:', error);
    return NextResponse.json({ results: [], total: 0 });
  }
}
