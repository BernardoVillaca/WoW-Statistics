import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { max, min } from 'drizzle-orm';
import type { VersionMapping, RegionMapping, BracketMapping } from '~/utils/helper/versionRegionBracketMapping';
import { versionRegionBracketMapping } from '~/utils/helper/versionRegionBracketMapping';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bracket = (searchParams.get('bracket') ?? '3v3') as keyof BracketMapping;
  const version = (searchParams.get('version') ?? 'retail') as keyof VersionMapping;
  const region = (searchParams.get('region') ?? 'us') as keyof RegionMapping;

  const versionMapping = versionRegionBracketMapping[version];
  if (!versionMapping) {
    return NextResponse.json({ error: `Invalid version: ${version}` }, { status: 400 });
  }

  const regionMapping = versionMapping?.[region];
  const bracketMapping = regionMapping?.[bracket];

  if (!bracketMapping) {
    return NextResponse.json({ error: `Invalid region or bracket: ${region} ${bracket}` }, { status: 400 });
  }

  const { table } = bracketMapping;

  try {
    const [highestRatingResult, lowestRatingResult] = await Promise.all([
      db.select({ highestRating: max(table.rating) }).from(table),
      db.select({ lowestRating: min(table.rating) }).from(table)
    ]);

    const highestRating = highestRatingResult?.[0]?.highestRating ?? 0;
    const lowestRating = lowestRatingResult?.[0]?.lowestRating ?? 0;

    return NextResponse.json({ highestRating, lowestRating });
  } catch (error) {
    console.error('Error executing query:', (error as Error).message);
    return NextResponse.json({ error: 'Error fetching ratings. Please try again later.' }, { status: 500 });
  }
}
