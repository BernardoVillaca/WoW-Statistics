import axios from 'axios';
import { db } from '~/server/db';
import { getAuthToken } from '~/server/actions/getAuthToken';
import { eq } from 'drizzle-orm/expressions';
import type {
    BracketMapping,
    RegionMapping,
    VersionMapping
} from '~/utils/helper/versionRegionBracketMapping';
import { versionRegionBracketMapping } from '~/utils/helper/versionRegionBracketMapping';

interface HistoryEntry {
    played: number;
    won: number;
    lost: number;
    rating: number;
    rank: number;
    updated_at: Date;
}

interface LeaderboardEntry {
    character_name: string;
    character_id: number;
    character_class: string;
    character_spec: string;
    realm_id: number;
    realm_slug: string;
    faction_name: string;
    rank: number;
    rating: number;
    played: number;
    won: number;
    lost: number;
    tier_id: number;
    tier_href: string;
    created_at: Date;
    updated_at: Date;
    win_ratio: number;
    history: HistoryEntry[];
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

export const updateLeaderboard = async (version: keyof VersionMapping, region: keyof RegionMapping, bracket: keyof BracketMapping): Promise<void> => {
    const versionMapping = versionRegionBracketMapping[version];
    if (!versionMapping) {
        throw new Error(`Invalid version: ${version}`);
    }
    const regionMapping = versionMapping[region];
    if (!regionMapping || !regionMapping[bracket]) {
        throw new Error(`Invalid region or bracket: ${region} ${bracket}`);
    }

    const { table, apiEndpoint, params } = regionMapping[bracket];
    const requests: Promise<void>[] = [];

    try {
        const authToken = await getAuthToken(false);
        const response = await axios.get<ApiResponse>(apiEndpoint, {
            params: {
                ...params,
                access_token: authToken
            }
        });

        const entries = response.data?.entries;
        if (entries) {
            const formattedData: LeaderboardEntry[] = entries.map((item): LeaderboardEntry => ({
                character_name: item.character.name,
                character_id: item.character.id,
                character_class: '',
                character_spec: '',
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
                history: [],
                win_ratio: Math.round((item.season_match_statistics.won / item.season_match_statistics.played) * 100)
            }));

            console.log(`Updating leaderboard data for ${version} ${region} ${bracket}...`);

            for (const data of formattedData) {
                requests.push(handleDataInsert(data, table));

                if (requests.length >= 500) {
                    await Promise.all(requests);
                    requests.length = 0;
                }
            }

            if (requests.length > 0) {
                await Promise.all(requests);
            }

            console.log(`Leaderboard data updated successfully for ${version} ${region} ${bracket}!`);
        } else {
            console.log('No entries found in the response');
        }
    } catch (error: unknown) {
        console.log('Failed to fetch or insert leaderboard data:', (error as Error).message);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            console.log('Token expired, refreshing token and retrying the request...');
            await getAuthToken(true);
            return updateLeaderboard(version, region, bracket);
        }
    }
};

const handleDataInsert = async (data: LeaderboardEntry, table: any): Promise<void> => {
    const existingRecord = await db
        .select()
        .from(table)
        .where(eq(table.character_id, data.character_id))
        .limit(1);

    if (existingRecord.length === 0) {
        await db.insert(table).values(data);
        return;
    }

    const existingEntry = existingRecord[0] as LeaderboardEntry | undefined;

    if (!existingEntry) {
        return;
    }

    const updateData: LeaderboardEntry = {
        ...data,
        history: existingEntry.history
    };

    if (existingEntry.played !== data.played) {
        const historyEntry: HistoryEntry = {
            played: existingEntry.played,
            won: existingEntry.won,
            lost: existingEntry.lost,
            rating: existingEntry.rating,
            rank: existingEntry.rank,
            updated_at: existingEntry.updated_at,
        };

        let newHistory: HistoryEntry[] = existingEntry.history ?? [];
        newHistory.push(historyEntry);

        if (newHistory.length > 20) {
            newHistory = newHistory.slice(newHistory.length - 20);
        }

        updateData.updated_at = new Date();
        updateData.history = newHistory;
    }

    await db.update(table).set(updateData).where(eq(table.character_id, data.character_id));
};
