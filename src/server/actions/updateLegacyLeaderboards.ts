import axios from 'axios';
import { db } from '~/server/db';
import { getAuthToken } from '~/server/actions/getAuthToken';
import { and, eq } from 'drizzle-orm/expressions';
import { retailLegacyLeaderboard } from '~/server/db/schema';

interface LeaderboardEntry {
    character_name: string;
    character_id: number;
    character_class: string;
    character_spec: string;
    realm_id: number;
    realm_slug: string;
    bracket: string;
    pvp_season_index: number;
    region: string;
    faction_name: string;
    rank: number;
    rating: number;
    played: number;
    won: number;
    lost: number;
    tier_id: number;
    tier_href: string;
    created_at: Date;    
    win_ratio: string;
}

interface ApiResponse {
    entries: {
        character: {
            name: string;
            id: number;
            realm: {
                id: number;
                slug: string;
            };
        };
        faction: {
            type: string;
        };
        rank: number;
        rating: number;
        season_match_statistics: {
            played: number;
            won: number;
            lost: number;
        };
        tier: {
            id: number;
            key: {
                href: string;
            };
        };
    }[];
}

const seasons = [36]
const brackets = ['2v2', '3v3', 'rbg'];
const regions = ['us', 'eu'];

export const updateLegacyLeaderboard = async (): Promise<void> => {
    try {
        const authToken = await getAuthToken(false);
        
        for (const season of seasons) {
            for (const bracket of brackets) {
                for (const region of regions) {
                    const apiEndpoint = `https://${region}.api.blizzard.com/data/wow/pvp-season/${season}/pvp-leaderboard/${bracket}`;
                    await fetchAndStoreData(apiEndpoint, authToken, season, bracket, region);
                }
            }
        }
    } catch (error: unknown) {
        console.log('Failed to update legacy leaderboard:', (error as Error).message);
    }
};

const fetchAndStoreData = async (apiEndpoint: string, authToken: string, season: number, bracket: string, region: string): Promise<void> => {
    try {
        const response = await axios.get<ApiResponse>(apiEndpoint, {
            params: {
                locale: 'en_US',
                namespace: `dynamic-${region}`,
                access_token: authToken,
            },
        });

        const entries = response.data?.entries;
        if (entries) {
            const formattedData: LeaderboardEntry[] = entries.map((item): LeaderboardEntry => ({
                character_name: item.character.name,
                character_id: item.character.id,
                character_class: '', // You might need to fill this based on your requirements
                character_spec: '',  // You might need to fill this based on your requirements
                realm_id: item.character.realm.id,
                realm_slug: item.character.realm.slug,
                bracket: bracket,
                pvp_season_index: season,
                region: region,
                faction_name: item.faction.type,
                rank: item.rank,
                rating: item.rating,
                played: item.season_match_statistics.played,
                won: item.season_match_statistics.won,
                lost: item.season_match_statistics.lost,
                tier_id: item.tier.id,
                tier_href: item.tier.key.href,
                created_at: new Date(),
                win_ratio: Math.round((item.season_match_statistics.won / item.season_match_statistics.played) * 100).toString(),
            }));

            await processEntries(formattedData);
        } else {
            console.log('No entries found in the response');
        }
    } catch (error: unknown) {
        console.log('Failed to fetch or insert leaderboard data:', (error as Error).message);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            console.log('Token expired, refreshing token and retrying the request...');
            const newAuthToken = await getAuthToken(true);
            return fetchAndStoreData(apiEndpoint, newAuthToken, season, bracket, region);
        }
    }
};

const processEntries = async (entries: LeaderboardEntry[]): Promise<void> => {
    const requests: Promise<void>[] = [];

    for (const data of entries) {
        if (retailLegacyLeaderboard !== null) {
            requests.push(handleDataInsert(data));
        }

        if (requests.length >= 100) {
            await Promise.all(requests);
            requests.length = 0;
        }
    }

    if (requests.length > 0) {
        await Promise.all(requests);
    }
};

const handleDataInsert = async (formattedData: LeaderboardEntry): Promise<void> => {
    const updateData: LeaderboardEntry = { ...formattedData };
    const table = retailLegacyLeaderboard;
    try {
        const existingRecord = await db
            .select()
            .from(table)
            .where(and(
                eq(table.character_id, formattedData.character_id),
                eq(table.bracket, formattedData.bracket),
                eq(table.region, formattedData.region),
                eq(table.pvp_season_index, formattedData.pvp_season_index)
            ))
            .limit(1);

        if (existingRecord.length === 0) {
            await db.insert(table).values(formattedData);
            return;
        }
    } catch (error) {
        console.log('Error fetching existing data', (error as Error).message);
    }

    try {
        await db.update(table).set(updateData).where(eq(table.character_id, formattedData.character_id));
    } catch (error) {
        console.log('Error updating leaderboard data:', (error as Error).message);
    }
};
