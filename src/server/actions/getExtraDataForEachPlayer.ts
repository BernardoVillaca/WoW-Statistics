import axios from 'axios';
import { db } from '~/server/db';
import { getAuthToken } from '~/server/actions/getAuthToken';
import { eq } from 'drizzle-orm';
import {
    versionRegionBracketMapping,
    LeaderboardParams,
    BracketMapping,
    RegionMapping,
    VersionMapping
} from '~/utils/helper/versionRegionBracketMapping';
import { scrapPlayerArmory } from './scrapPlayerArmory';

export const getExtraDataForEachPlayer = async (version: keyof VersionMapping, region: keyof RegionMapping, bracket: keyof BracketMapping) => {
    const versionMapping = versionRegionBracketMapping[version];
    if (!versionMapping) {
        throw new Error(`Invalid version: ${version}`);
    }
    const regionMapping = versionMapping[region];
    if (!regionMapping || !regionMapping[bracket]) {
        throw new Error(`Invalid region or bracket: ${region} ${bracket}`);
    }

    const { table, characterApiEndpoint, armoryEndpoint, profileParams } = regionMapping[bracket];
    let requests: Promise<any>[] = [];
    console.log(`Updating extra data for ${version} ${region} ${bracket}...`);

    // Retrieve all leaderboard entries without a class_spec
    const leaderboardData = await db.select().from(table).where(eq(table.character_spec, ''));
    // console.log(`Found ${leaderboardData.length} entries to update`);

    for (const character of leaderboardData) {
        const { character_name: characterName, realm_slug: realmSlug, character_id: characterId } = character;

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

const updateCharacterData = async (version: keyof VersionMapping, characterName: string, realmSlug: string, characterId: number, table: any, characterApiEndpoint: string, armoryEndpoint: string, profileParams: LeaderboardParams) => {
    try {
        const characterData = await getPlayerData(characterName, realmSlug, characterApiEndpoint, profileParams);
        let specName = '';

        if (version === 'classic' && characterData) {
            const specData = await getSpecData(characterName, realmSlug, characterApiEndpoint, profileParams);
            specName = determineSpecWithMostPoints(specData);
        } else if (characterData && characterData.active_spec) {
            specName = characterData.active_spec.name;
        }

        if (characterData) {
            await db.update(table)
                .set({
                    character_spec: specName,
                    character_class: characterData.character_class.name,
                })
                .where(eq(table.character_id, characterId));``            
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
    } catch (error: any) {
        console.error(`Failed to update for ${characterName}: ${error.message}`);
    }
};

const getPlayerData = async (characterName: string, realmSlug: string, characterApiEndpoint: string, profileParams: LeaderboardParams): Promise<any> => {
    const authToken = await getAuthToken(false);
    const url = `${characterApiEndpoint}${realmSlug}/${characterName.toLowerCase()}`;
    // console.log(`Fetching data for ${characterName}-${realmSlug} from ${url}`);
    try {
        const response = await axios.get(url, {
            params: {
                ...profileParams,
                access_token: authToken
            },
        });
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            console.log('Token expired, refreshing token and retrying the request...');
            await getAuthToken(true);
            return getPlayerData(characterName, realmSlug, characterApiEndpoint, profileParams); // Retry the request after refreshing the token
        }
    }
};

const getSpecData = async (characterName: string, realmSlug: string, characterApiEndpoint: string, profileParams: LeaderboardParams): Promise<any> => {
    const authToken = await getAuthToken(false);
    const specUrl = `${characterApiEndpoint}${realmSlug}/${characterName.toLowerCase()}/specializations`;
    // console.log(`Fetching spec data for ${characterName}-${realmSlug} from ${specUrl}`);
    try {
        const response = await axios.get(specUrl, {
            params: {
                ...profileParams,
                access_token: authToken
            },
        });
        return response.data;
    } catch (error: any) {
        console.error(`Error fetching spec data for ${characterName}-${realmSlug}: ${error.message}`);
    }
};

const determineSpecWithMostPoints = (specData: any): string => {
    if (!specData || !specData.specialization_groups) {
        return '';
    }

    let maxPoints = 0;
    let mainSpecName = '';

    for (const group of specData.specialization_groups) {
        if (Array.isArray(group.specializations)) {
            for (const specialization of group.specializations) {
                const points = specialization.spent_points || 0;
                if (points > maxPoints) {
                    maxPoints = points;
                    mainSpecName = specialization.specialization_name;
                }
            }
        }
    }

    return mainSpecName;
};
