import axios from 'axios';
import { db } from '~/server/db';
import { getAuthToken } from '~/server/actions/getAuthToken';
import { and, desc, eq } from 'drizzle-orm';
import type {
    LeaderboardParams,
    BracketMapping,
    RegionMapping,
} from '~/utils/helper/versionRegionBracketMapping';
import { versionRegionBracketMapping } from '~/utils/helper/versionRegionBracketMapping';
import { scrapPlayerArmory } from './scrapPlayerArmory';
import { retailLegacyLeaderboard } from '~/server/db/schema';
import { spec } from 'node:test/reporters';

interface CharacterData {
    active_spec?: {
        name: string;
    };
    character_class: {
        name: string;
    };
}


interface LeaderboardEntry {
    character_name: string;
    realm_slug: string;
    character_id: number;
    character_spec: string;
}

export const getClassSpecForLegacy = async (region: keyof RegionMapping, bracket: keyof BracketMapping, season: number) => {
    const versionMapping = versionRegionBracketMapping.retail;
    if (!versionMapping) {
        throw new Error(`Invalid version`);
    }
    const regionMapping = versionMapping[region];
    const bracketMapping = regionMapping?.[bracket];

    if (!bracketMapping) {
        throw new Error(`Invalid region or bracket: ${region} ${bracket}`);
    }

    const { characterApiEndpoint, armoryEndpoint, profileParams } = bracketMapping;
    const requests: Promise<void>[] = [];
    console.log(`Updating extra data for ${region} ${bracket} ${season}`);

    // Retrieve all leaderboard entries without a class_spec for the given season
    const leaderboardData = await db
        .select()
        .from(retailLegacyLeaderboard)
        .where(and(
            eq(retailLegacyLeaderboard.character_spec, ''),
            // eq(retailLegacyLeaderboard.pvp_season_index, season),

        ))
        .orderBy(desc(retailLegacyLeaderboard.rating));


    for (const character of leaderboardData) {
        const { character_name: characterName, realm_slug: realmSlug, character_id: characterId } = character as LeaderboardEntry;

        if (characterName && realmSlug) {
            requests.push(updateCharacterData(characterName, realmSlug, characterId, characterApiEndpoint, armoryEndpoint, profileParams));


            if (requests.length >= 5) {
                await Promise.all(requests);
                requests.length = 0;
            }
        }
    }4

    if (requests.length > 0) {
        await Promise.all(requests);
    }
    console.log(`Finished updating extra data for ${region} ${bracket} ${season}`);
};

const updateCharacterData = async (
    characterName: string,
    realmSlug: string,
    characterId: number,
    characterApiEndpoint: string,
    armoryEndpoint: string,
    profileParams: LeaderboardParams
): Promise<void> => {
    try {
        const characterData = await getPlayerData(characterName, realmSlug, characterApiEndpoint, profileParams);

        const specName = characterData?.active_spec?.name;
        const className = characterData?.character_class.name;

        if (characterData) {
            console.log(`Updating ${characterName} with spec: ${specName} and class: ${className}`)
            await db.update(retailLegacyLeaderboard)
                .set({
                    character_spec: specName,
                    character_class: className,
                })
                .where(eq(retailLegacyLeaderboard.character_id, characterId))


        } else {
            const playerArmoryData = await scrapPlayerArmory(characterName.toLowerCase(), realmSlug, armoryEndpoint);
            console.log(`Scraping ${characterName} from armory`)
            if (playerArmoryData) {
                console.log(`Updating ${characterName} with spec: ${playerArmoryData.characterSpec} and class: ${playerArmoryData.characterClass}`)
                const { characterClass, characterSpec } = playerArmoryData;
                await db.update(retailLegacyLeaderboard)
                    .set({
                        character_spec: characterSpec,
                        character_class: characterClass,
                    })
                    .where(eq(retailLegacyLeaderboard.character_id, characterId));
                return;
            }

        }
    } catch (error: unknown) {
        console.error(`Failed to update for ${characterName}: ${(error as Error).message}`);

    };
}


const getPlayerData = async (characterName: string, realmSlug: string, characterApiEndpoint: string, profileParams: LeaderboardParams): Promise<CharacterData | null> => {
    const authToken = await getAuthToken(false);
    const url = `${characterApiEndpoint}${realmSlug}/${characterName.toLowerCase()}`;

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
            return getPlayerData(characterName, realmSlug, characterApiEndpoint, profileParams);
        }
        return null;
    }
};


