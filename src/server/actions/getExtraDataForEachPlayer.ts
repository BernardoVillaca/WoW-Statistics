import axios from 'axios';
import { db } from '~/server/db';
import { getAuthToken } from '~/server/actions/getAuthToken';
import { eq } from 'drizzle-orm';
import type {
    LeaderboardParams,
    BracketMapping,
    RegionMapping,
    VersionMapping,
} from '~/utils/helper/versionRegionBracketMapping';
import { versionRegionBracketMapping } from '~/utils/helper/versionRegionBracketMapping';
import { scrapPlayerArmory } from './scrapPlayerArmory';
import type {
    eu3v3Leaderboard, eu2v2Leaderboard, euRBGLeaderboard,
    us3v3Leaderboard, us2v2Leaderboard, usRBGLeaderboard,
    classicUs3v3Leaderboard, classicUs2v2Leaderboard, classicUsRBGLeaderboard,
    classicEu2v2Leaderboard, classicEu3v3Leaderboard, classicEuRBGLeaderboard
} from '~/server/db/schema';

interface CharacterData {
    active_spec?: {
        name: string;
    };
    character_class: {
        name: string;
    };
}

interface SpecData {
    specialization_groups: {
        specializations: {
            spent_points?: number;
            specialization_name: string;
        }[];
    }[];
}

interface LeaderboardEntry {
    character_name: string;
    realm_slug: string;
    character_id: number;
    character_spec: string;
}

type LeaderboardTable = typeof eu3v3Leaderboard | typeof eu2v2Leaderboard | typeof euRBGLeaderboard
    | typeof us3v3Leaderboard | typeof us2v2Leaderboard | typeof usRBGLeaderboard
    | typeof classicUs3v3Leaderboard | typeof classicUs2v2Leaderboard | typeof classicUsRBGLeaderboard
    | typeof classicEu2v2Leaderboard | typeof classicEu3v3Leaderboard | typeof classicEuRBGLeaderboard;

export const getExtraDataForEachPlayer = async (version: keyof VersionMapping, region: keyof RegionMapping, bracket: keyof BracketMapping) => {
    const versionMapping = versionRegionBracketMapping[version];
    if (!versionMapping) {
        throw new Error(`Invalid version: ${version}`);
    }
    const regionMapping = versionMapping[region];
    if ( !regionMapping?.[bracket]) {
        throw new Error(`Invalid region or bracket: ${region} ${bracket}`);
    }

    const { table, characterApiEndpoint, armoryEndpoint, profileParams } = regionMapping[bracket];
    const requests: Promise<void>[] = [];
    console.log(`Updating extra data for ${version} ${region} ${bracket}...`);

    // Retrieve all leaderboard entries without a class_spec
    const leaderboardData = await db.select().from(table).where(eq(table.character_spec, ''));
    // console.log(`Found ${leaderboardData.length} entries to update`);

    for (const character of leaderboardData) {
        const { character_name: characterName, realm_slug: realmSlug, character_id: characterId } = character as LeaderboardEntry;

        if (characterName && realmSlug) {
            requests.push(updateCharacterData(version, characterName, realmSlug, characterId, table, characterApiEndpoint, armoryEndpoint, profileParams));

            // Process in batches of 30 requests
            if (requests.length >= 30) {
                await Promise.all(requests);
                requests.length = 0; // Clear the array after processing
            }
        }
    }

    // Process any remaining requests
    if (requests.length > 0) {
        await Promise.all(requests);
    }
    console.log(`Finished updating extra data for ${version} ${region} ${bracket}...`);
};

const updateCharacterData = async (
    version: keyof VersionMapping,
    characterName: string,
    realmSlug: string,
    characterId: number,
    table: LeaderboardTable,
    characterApiEndpoint: string,
    armoryEndpoint: string,
    profileParams: LeaderboardParams
): Promise<void> => {
    try {
        const characterData = await getPlayerData(characterName, realmSlug, characterApiEndpoint, profileParams);
        let specName = '';

        if (version === 'classic' && characterData) {
            const specData = await getSpecData(characterName, realmSlug, characterApiEndpoint, profileParams);
            specName = determineSpecWithMostPoints(specData);
        } else if (characterData?.active_spec) {
            specName = characterData.active_spec.name;
        }

        if (characterData) {
            await db.update(table)
                .set({
                    character_spec: specName,
                    character_class: characterData.character_class.name,
                })
                .where(eq(table.character_id, characterId));
        } else if (version === 'retail') {
            console.log(`${characterName} on realm: ${realmSlug} not found fetching from armory`);
            const playerArmoryData = await scrapPlayerArmory(characterName, realmSlug, armoryEndpoint);
            if (playerArmoryData) {
                const { characterClass, characterSpec } = playerArmoryData;
                await db.update(table)
                    .set({
                        character_spec: characterSpec,
                        character_class: characterClass,
                    })
                    .where(eq(table.character_id, characterId));
                return;
            }
            console.log(`Deleting ${characterName} on realm: ${realmSlug}`);
            await db.delete(table).where(eq(table.character_id, characterId));
        }
    } catch (error: unknown) {
        console.error(`Failed to update for ${characterName}: ${(error as Error).message}`);
    }
};

// Specified return type
const getPlayerData = async (characterName: string, realmSlug: string, characterApiEndpoint: string, profileParams: LeaderboardParams): Promise<CharacterData | null> => {
    const authToken = await getAuthToken(false);
    const url = `${characterApiEndpoint}${realmSlug}/${characterName.toLowerCase()}`;
    // console.log(`Fetching data for ${characterName}-${realmSlug} from ${url}`);
    try {
        const response = await axios.get<CharacterData>(url, {
            params: {
                ...profileParams,
                access_token: authToken
            },
        });
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            console.log('Token expired, refreshing token and retrying the request...');
            await getAuthToken(true);
            return getPlayerData(characterName, realmSlug, characterApiEndpoint, profileParams); // Retry the request after refreshing the token
        }
        return null;
    }
};

// Specified return type
const getSpecData = async (characterName: string, realmSlug: string, characterApiEndpoint: string, profileParams: LeaderboardParams): Promise<SpecData | null> => {
    const authToken = await getAuthToken(false);
    const specUrl = `${characterApiEndpoint}${realmSlug}/${characterName.toLowerCase()}/specializations`;
    // console.log(`Fetching spec data for ${characterName}-${realmSlug} from ${specUrl}`);
    try {
        const response = await axios.get<SpecData>(specUrl, {
            params: {
                ...profileParams,
                access_token: authToken
            },
        });
        return response.data;
    } catch (error: unknown) {
        console.error(`Error fetching spec data for ${characterName}-${realmSlug}: ${(error as Error).message}`);
        return null;
    }
};

const determineSpecWithMostPoints = (specData: SpecData | null): string => {
    if (!specData?.specialization_groups) {
        return '';
    }

    let maxPoints = 0;
    let mainSpecName = '';

    for (const group of specData.specialization_groups) {
        if (Array.isArray(group.specializations)) {
            for (const specialization of group.specializations) {
                const points = specialization.spent_points ?? 0;
                if (points > maxPoints) {
                    maxPoints = points;
                    mainSpecName = specialization.specialization_name;
                }
            }
        }
    }

    return mainSpecName;
};
