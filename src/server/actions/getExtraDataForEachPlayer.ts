import axios from 'axios';
import { db } from '~/server/db';
import { getAuthToken } from '~/server/actions/getAuthToken';
import { leaderboard } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export const getExtraDataForEachPlayer = async () => {
    const requests = [];
    console.log('Updating extra data for each player')
    // Retrieve all leaderboard entries without a class_spec
    const leaderboardData = await db.query.leaderboard.findMany({
        where: eq(leaderboard.character_class, '')
    });


    for (const character of leaderboardData) {
        const { character_name: characterName, realm_slug: realmSlug } = character;

        if (characterName && realmSlug) {
            requests.push(updateCharacterData(characterName, realmSlug));

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
    console.log('Extra data updated successfully');
};

const updateCharacterData = async (characterName: string, realmSlug: string) => {
    try {
        const characterData = await getPlayerData(characterName, realmSlug);
        if (characterData) {
            await db.update(leaderboard)
                .set({
                    character_spec: characterData.active_spec.name,
                    character_class: characterData.character_class.name,
                })
                .where(eq(leaderboard.character_name, characterName))
        }
    } catch (error: any) {
        console.error(`Failed to update for ${characterName}: ${error.message}`);
    }
};

const getPlayerData = async (characterName: string, realmSlug: string): Promise<any> => {
    const authToken = await getAuthToken(false);
    try {
        const response = await axios.get(`https://us.api.blizzard.com/profile/wow/character/${realmSlug}/${characterName.toLowerCase()}`, {
            params: {
                namespace: 'profile-us',
                locale: 'en_US',
                access_token: authToken
            },
        });
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            console.log(`Character ${characterName}-${realmSlug} not found`);
            // If the character is not found, delete the entry from the leaderboard
        //     await db.delete(leaderboard)
        //         .where(eq(leaderboard.character_name, characterName))
        // }
        if (error.response && error.response.status === 401) {
            console.log('Token expired, refreshing token and retrying the request...');
            await getAuthToken(true);
            return getPlayerData(characterName, realmSlug); // Retry the request after refreshing the token
        }
    }
};
