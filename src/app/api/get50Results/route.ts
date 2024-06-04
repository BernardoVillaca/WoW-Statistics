import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { us3v3Leaderboard } from '~/server/db/schema';
import { asc, count, eq, and, SQL, gte, lte, or } from 'drizzle-orm';

const validClasses = [
  'Death Knight', 'Demon Hunter', 'Druid', 'Hunter', 'Mage', 'Monk', 'Paladin',
  'Priest', 'Rogue', 'Shaman', 'Warlock', 'Warrior'
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  const faction = searchParams.get('faction'); // faction_name on the db
  const realm = searchParams.get('realm'); // realm_slug on the db
  const minRating = parseInt(searchParams.get('minRating') ?? '0'); // rating on the db
  const maxRating = parseInt(searchParams.get('maxRating') ?? '4000'); // rating on the db

  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = 50;
  const offset = (page - 1) * limit;

  let andConditions: SQL[] = [];
  let orConditions: any = [];

  if (search) {
    const decodedSearch = decodeURIComponent(search).trim();
    const searchTerms = decodedSearch.split(',').map(term => term.trim());
  
    searchTerms.forEach(term => {
      let [specName, ...classNames] = term.split(' ');
      let className = classNames.join(' ');
  
      if (specName && className) {
        orConditions.push(
          and(
            eq(us3v3Leaderboard.character_spec, specName),
            eq(us3v3Leaderboard.character_class, className)
          ) as unknown as SQL
        );
      }
    });
  };

  if (faction) {
    andConditions.push(eq(us3v3Leaderboard.faction_name, faction.toUpperCase()));
  };
  if (realm) {
    andConditions.push(eq(us3v3Leaderboard.realm_slug, realm.toLowerCase()));
  };
  if (minRating) {
    andConditions.push(gte(us3v3Leaderboard.rating, minRating));
  };
  if (maxRating) {
    andConditions.push(lte(us3v3Leaderboard.rating, maxRating));
  };

  let combinedConditions
  if (orConditions.length > 0) {
    combinedConditions = and(...andConditions, or(...orConditions));
  } else {
    combinedConditions = and(...andConditions);
  };

  try {
    const [results, totalResult] = await Promise.all([
      db.query.us3v3Leaderboard.findMany({
        where: combinedConditions,
        limit,
        offset,
        orderBy: [asc(us3v3Leaderboard.rank)]
      }),
      db.select({ count: count() }).from(us3v3Leaderboard).where(combinedConditions)
    ]);

    const total = totalResult[0]?.count ?? 0;

    return NextResponse.json({ results, total });
  } catch (error) {
    console.error('Error executing query:', error);
    return NextResponse.json({ results: [], total: 0 });
  }
}
