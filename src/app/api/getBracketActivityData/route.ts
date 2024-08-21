import { NextRequest, NextResponse } from "next/server";
import { db } from '~/server/db';
import { BracketMapping, RegionMapping, VersionMapping, versionRegionBracketMapping } from "~/utils/helper/versionRegionBracketMapping";
import { eq, and } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const version = (searchParams.get('version') ?? 'retail') as keyof VersionMapping;
  const region = (searchParams.get('region') ?? 'us') as keyof RegionMapping;
  const bracket = (searchParams.get('bracket')?.includes('shuffle') ? 'shuffle' : searchParams.get('bracket') ?? '3v3') as keyof BracketMapping;
  const spec = searchParams.get('spec') ?? '';
  const name = searchParams.get('name') ?? '';
  const realm = searchParams.get('realm') ?? '';

  try {
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

    if (!name || !realm) {
      throw new Error("Both 'name' and 'realm' parameters are required.");
    }

    const capitalizeFirstChar = (word: string) => {
      if (!word || typeof word !== 'string') {
        return '';
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    }

    const results = await db.select()
      .from(table)
      .where(
        and(
          eq(table.character_name, capitalizeFirstChar(name)),
          eq(table.realm_slug, realm.toLowerCase()),
          eq(table.character_spec, spec)
        )
      );

    if (results.length === 0) {
      return NextResponse.json({ message: 'Character not found' });
    }

    return NextResponse.json(results[0]);
  } catch (error) {
    console.error('Error fetching character data:', (error as Error).message);
    return NextResponse.json({ error: 'Failed to fetch profile data' }, { status: 500 });
  }
}
