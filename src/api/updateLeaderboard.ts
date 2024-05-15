import axios from 'axios';
import { db } from '~/server/db';
import { leaderboard } from '~/server/db/schema';
import { getAuthToken } from './getAuthToken';

export const getLeaderboardData = async (): Promise<void> => {
    let authToken;
    try {
        authToken = await getAuthToken(false);
        const response = await axios.get('https://us.api.blizzard.com/data/wow/pvp-season/37/pvp-leaderboard/3v3', {
            params: {
                namespace: 'dynamic-us',
                locale: 'en_US',
                access_token: authToken
            },
        });

        if (response.data && response.data.entries) {
            const formattedData = response.data.entries.map((item: any) => ({
                character_name: item.character.name,
                character_id: item.character.id,
                realm_id: item.character.realm.id,
                realm_slug: item.character.realm.slug,
                faction_name: item.faction.type,
                rank: item.rank,
                rating: item.rating,
                played: item.season_match_statistics.played,
                won: item.season_match_statistics.won,
                lost: item.season_match_statistics.lost,
                tier_id: item.tier.id,
                tier_href: item.tier.key.href,
                created_at: new Date(),
                updated_at: new Date()
            }));
            console.log(response.data.entries.splice(0, 2))
            // Handling upsert logic
            for (let data of formattedData) {
                await db.insert(leaderboard).values(data)
                    .onConflictDoUpdate({
                        target: [leaderboard.character_name],
                        set: {
                            rank: data.rank,
                            rating: data.rating,
                            played: data.played,
                            won: data.won,
                            lost: data.lost,
                            updated_at: new Date(),
                        }
                    });
            }
            console.log('Leaderboard data updated successfully');
        } else {
            console.log('No entries found in the response');
        }
    } catch (error: any) {
        console.log('Failed to fetch or insert leaderboard data:', error.message);
        if (error.response && error.response.status === 401) {
            console.log('Token expired, refreshing token and retrying the request...');
            await getAuthToken(true);
            return getLeaderboardData(); // Retry the request recursively after refreshing the token
        }
    }
}
