import axios from 'axios';
import { db } from '~/server/db';
import { getAuthToken } from '~/server/getAuthToken';
import { leaderboard } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export const getExtraDataForEachPlayer = async () => {
    const requests = [];
    // Retrieve all leaderboard entries without a character class
    const leaderboardData = await db.query.leaderboard.findMany({

        where: eq(leaderboard.character_class, '')
    });

    for (const character of leaderboardData) {
        const { character_name: characterName, realm_slug: realmSlug } = character;

        if (characterName && realmSlug) {
            console.log(`Fetching data for ${characterName} from ${realmSlug}`);
            requests.push(
                getPlayerData(characterName, realmSlug)
                    .then(characterData => {
                        if (characterData) {
                            console.log(`Updating database for ${characterName}`);
                            return db.update(leaderboard)
                                .set({
                                    character_class: characterData.character_class.name,
                                    character_spec: characterData.active_spec.name,
                                })
                                .where(eq(leaderboard.character_name, characterName))
                                .execute();
                        }
                    })
                    .catch(error => {
                        console.error(`Failed to update for ${characterName}: ${error.message}`);
                    })
            );
        }

        // Process in batches of 20 requests
        if (requests.length >= 20) {
            await Promise.all(requests);
            requests.length = 0; // Clear the array after processing
        }
    }

    // Process any remaining requests
    if (requests.length > 0) {
        await Promise.all(requests);
    }
    console.log('Extra data updated successfully');
};

const getPlayerData = async (characterName: string, realmSlug: string) => {
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
        console.error('Failed to fetch player data:', error.message);
        if (error.response && error.response.status === 401) {
            console.log('Token expired, refreshing token and retrying the request...');
            await getAuthToken(true);
            return getExtraDataForEachPlayer(); // Retry the request recursively after refreshing the token
            
        }
    };
}