import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { us3v3Leaderboard } from '~/server/db/schema';
import { max, min } from 'drizzle-orm';
import { versionRegionBracketMapping, VersionMapping, RegionMapping, BracketMapping } from '~/utils/helper/versionRegionBracketMapping';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bracket = (searchParams.get('bracket') ?? '3v3') as keyof BracketMapping;
  const version = (searchParams.get('version') ?? 'retail') as keyof VersionMapping;
  const region = (searchParams.get('region') ?? 'us') as keyof RegionMapping;

  const versionMapping = versionRegionBracketMapping[version];
  if (!versionMapping) {
    throw new Error(`Invalid version: ${version}`);
  }
  const regionMapping = versionMapping[region];
  if (!regionMapping || !regionMapping[bracket]) {
    throw new Error(`Invalid region or bracket: ${region} ${bracket}`);
  }

  const { table } = regionMapping[bracket];

  try {
    const [highestRatingResult, lowestRatingResult] = await Promise.all([
      db.select({ highestRating: max(table.rating) }).from(table),
      db.select({ lowestRating: min(table.rating) }).from(us3v3Leaderboard)
    ]);

    const highestRating = highestRatingResult[0]?.highestRating ?? 0;
    const lowestRating = lowestRatingResult[0]?.lowestRating ?? 0;

    return NextResponse.json({ highestRating, lowestRating });
  } catch (error) {
    console.error('Error executing query:', error);
    return NextResponse.json({ highestRating: 0, lowestRating: 0 });
  }
}
