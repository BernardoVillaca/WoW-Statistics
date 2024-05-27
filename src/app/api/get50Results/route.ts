import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { leaderboard } from '~/server/db/schema';
import { asc, count } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = 50;
  const page = parseInt(searchParams.get('page') ?? '1');
  const offset = (page - 1) * limit;

  const [results, totalResult] = await Promise.all([
    db.query.leaderboard.findMany({
      limit,
      offset,
      orderBy: [asc(leaderboard.rank)]
    }),
    db.select({ count: count() }).from(leaderboard)
  ]);

  const total = totalResult[0].count;

  return NextResponse.json({ results, total });
}
