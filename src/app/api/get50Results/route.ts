import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { us3v3Leaderboard } from '~/server/db/schema';
import { asc, count, eq, or, and, SQL } from 'drizzle-orm';

const validClasses = [
  'Death Knight', 'Demon Hunter', 'Druid', 'Hunter', 'Mage', 'Monk', 'Paladin', 
  'Priest', 'Rogue', 'Shaman', 'Warlock', 'Warrior'
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = 50;
  const offset = (page - 1) * limit;

  
  let conditions: SQL[] = [];

  if (search) {
    const decodedSearch = decodeURIComponent(search).trim();
    const searchTerms = decodedSearch.split(',').map(term => term.trim());

   // Getting the class from the last word of the search term and the spec from the remaining words
    conditions = searchTerms.map(term => {
      let className = '';
      let specName = '';

      for (const validClass of validClasses) {
        if (term.endsWith(validClass)) {
          className = validClass;
          specName = term.slice(0, -validClass.length).trim();
          break;
        }
      }

      if (className && specName) {
        return and(
          eq(us3v3Leaderboard.character_class, className),
          eq(us3v3Leaderboard.character_spec, specName)
        );
      } else {
        console.error('Failed to parse class and spec from search term:', term);
        return null;
      }
    }).filter(condition => condition !== null) as SQL[];  
  }

  try {
    const [results, totalResult] = await Promise.all([
      db.query.us3v3Leaderboard.findMany({
        where: or(...conditions),
        limit,
        offset,
        orderBy: [asc(us3v3Leaderboard.rank)]
      }),
      db.select({ count: count() }).from(us3v3Leaderboard).where(or(...conditions))
    ]);

    const total = totalResult[0]?.count ?? 0;
    
    return NextResponse.json({ results, total });
  } catch (error) {
    console.error('Error executing query:', error);
    return NextResponse.json({ results: [], total: 0 });
  }
}
