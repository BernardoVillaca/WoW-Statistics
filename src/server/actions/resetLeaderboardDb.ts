import { versionRegionBracketMapping } from "~/utils/helper/versionRegionBracketMapping";
import type { VersionMapping, RegionMapping, BracketMapping } from "~/utils/helper/versionRegionBracketMapping";
import { db } from '~/server/db'; // Assuming you have a db instance from Drizzle ORM


export const resetLeaderboardDb = async (version: keyof VersionMapping, region: keyof RegionMapping, bracket: keyof BracketMapping) => {
    const versionMapping = versionRegionBracketMapping[version];
    const regionMapping = versionMapping[region];
    const bracketMapping = regionMapping[bracket];

    if (!bracketMapping) {
        console.log(`No mapping found for version: ${version}, region: ${region}, bracket: ${bracket}`);
        return;
    }

    const { table } = bracketMapping;

    try {
        // eslint-disable-next-line drizzle/enforce-delete-with-where
        await db.delete(table)
        console.log(`Successfully reset leaderboard for ${region} ${bracket} in version ${version}`);
    } catch (error) {
        console.error(`Error resetting leaderboard for ${region} ${bracket}:`, error);
    }
};


