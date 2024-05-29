import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { us3v3Leaderboard } from '~/server/db/schema';
import { asc, count, eq, or } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  console.log(searchParams.get('search'), searchParams.get('page'));
  const limit = 50;
  const page = parseInt(searchParams.get('page') ?? '1');
  const offset = (page - 1) * limit;

  const [results, totalResult] = await Promise.all([
    db.query.us3v3Leaderboard.findMany({
      limit,
      offset,
      orderBy: [asc(us3v3Leaderboard.rank)]
    }),
    db.select({ count: count() }).from(us3v3Leaderboard)
  ]);

  const total = totalResult[0]?.count ?? 0;

  return NextResponse.json({ results, total });
}
