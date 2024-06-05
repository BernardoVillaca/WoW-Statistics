import axios from 'axios';
import { db } from '~/server/db';
import { us3v3Leaderboard, us2v2Leaderboard, eu3v3Leaderboard, eu2v2Leaderboard } from '~/server/db/schema';
import { getAuthToken } from '~/server/actions/getAuthToken';
import { and, eq } from 'drizzle-orm/expressions';

const bracketMapping = {
    '3v3': {
        table: us3v3Leaderboard,
        apiEndpoint: 'https://us.api.blizzard.com/data/wow/pvp-season/37/pvp-leaderboard/3v3'
    },
    '2v2': {
        table: us2v2Leaderboard,
        apiEndpoint: 'https://us.api.blizzard.com/data/wow/pvp-season/37/pvp-leaderboard/2v2'
    },
    
};

export const updateLeaderboard = async (bracket: string): Promise<void> => {
    if (!bracketMapping[bracket as keyof typeof bracketMapping]) {
        throw new Error(`Invalid bracket: ${bracket}`);
    }

    const { table, apiEndpoint } = bracketMapping[bracket as keyof typeof bracketMapping];
    let requests = [];
    
    try {
        const authToken = await getAuthToken(false);
        const response = await axios.get(apiEndpoint, {
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
                updated_at: new Date(),
                win_ratio: Math.round((item.season_match_statistics.won / item.season_match_statistics.played) * 100)
            }));

            console.log('Leaderboard data fetched starting to insert on db');
            
            for (let data of formattedData) {
                requests.push(handleDataInsert(data, table));

                if (requests.length >= 100) {
                    await Promise.all(requests);
                    requests.length = 0; 
                }
            }

            if (requests.length > 0) {
                await Promise.all(requests);
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
            return updateLeaderboard(bracket);
        }
    }
}

const handleDataInsert = async (data: any, table: any) => {
    const existingRecord = await db
        .select()
        .from(table)
        .where(and(
            eq(table.character_name, data.character_name),
            eq(table.realm_slug, data.realm_slug)
        ));

    if (existingRecord.length === 0) {
        console.log(`Inserting new record for ${data.character_name} with ${data.rating}`);
        return await db.insert(table).values(data);
    }

    if (existingRecord.length > 0 && existingRecord[0]?.played !== data.played) {
        console.log(`Updating record for ${data.character_name} with ${data.rating} from ${existingRecord[0]?.played} games played to ${data.played} games played`);
        await db.update(table).set({
            rank: data.rank,
            rating: data.rating,
            played: data.played,
            won: data.won,
            lost: data.lost,
            updated_at: new Date()
        }).where(and(
            eq(table.character_name, data.character_name),
            eq(table.realm_slug, data.realm_slug)
        ));
    }
}
