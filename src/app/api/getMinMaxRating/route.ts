import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { us3v3Leaderboard } from '~/server/db/schema';
import { max, min } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const [highestRatingResult, lowestRatingResult] = await Promise.all([
      db.select({ highestRating: max(us3v3Leaderboard.rating) }).from(us3v3Leaderboard),
      db.select({ lowestRating: min(us3v3Leaderboard.rating) }).from(us3v3Leaderboard)
    ]);

    const highestRating = highestRatingResult[0]?.highestRating ?? 0;
    const lowestRating = lowestRatingResult[0]?.lowestRating ?? 0;

    return NextResponse.json({ highestRating, lowestRating });
  } catch (error) {
    console.error('Error executing query:', error);
    return NextResponse.json({ highestRating: 0, lowestRating: 0 });
  }
}

