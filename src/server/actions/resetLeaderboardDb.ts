import { BracketMapping, RegionMapping, VersionMapping, versionRegionBracketMapping } from "~/utils/helper/versionRegionBracketMapping";
import { db } from '~/server/db'; // Assuming you have a db instance from Drizzle ORM

const resetFields = {
    rank: 0,
    rating: 0,
    won: 0,
    lost: 0,
    played: 0,
    history: [],
};

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
        
        await db.delete(table)
        console.log(`Successfully reset leaderboard for ${region} ${bracket} in version ${version}`);
    } catch (error) {
        console.error(`Error resetting leaderboard for ${region} ${bracket}:`, error);
    }
};


