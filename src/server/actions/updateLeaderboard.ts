import axios from 'axios';
import { db } from '~/server/db';
import { getAuthToken } from '~/server/actions/getAuthToken';
import { and, eq, lt } from 'drizzle-orm/expressions';
import type {
    BracketMapping,
    RegionMapping,
    VersionMapping
} from '~/utils/helper/versionRegionBracketMapping';
import { versionRegionBracketMapping } from '~/utils/helper/versionRegionBracketMapping';
import {
    type eu3v3Leaderboard, type eu2v2Leaderboard, type euRBGLeaderboard,
    type us3v3Leaderboard, type us2v2Leaderboard, type usRBGLeaderboard,
    type classicUs3v3Leaderboard, type classicUs2v2Leaderboard, type classicUsRBGLeaderboard,
    type classicEu2v2Leaderboard, type classicEu3v3Leaderboard, type classicEuRBGLeaderboard,
    type usShuffleLeaderboard,
    type euShuffleLeaderboard,
} from '~/server/db/schema';


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
    win_ratio: string;
    history: HistoryEntry[];
    present?: boolean; // Add the 'present' property as optional
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

type LeaderboardTable = typeof eu3v3Leaderboard | typeof eu2v2Leaderboard | typeof euRBGLeaderboard | typeof usShuffleLeaderboard
    | typeof us3v3Leaderboard | typeof us2v2Leaderboard | typeof usRBGLeaderboard | typeof euShuffleLeaderboard
    | typeof classicUs3v3Leaderboard | typeof classicUs2v2Leaderboard | typeof classicUsRBGLeaderboard
    | typeof classicEu2v2Leaderboard | typeof classicEu3v3Leaderboard | typeof classicEuRBGLeaderboard;

export const updateLeaderboard = async (version: keyof VersionMapping, region: keyof RegionMapping, bracket: keyof BracketMapping): Promise<void> => {
    const versionMapping = versionRegionBracketMapping[version];
    if (!versionMapping) {
        throw new Error(`Invalid version: ${version}`);
    }
    const regionMapping = versionMapping[region];
    const bracketMapping = regionMapping?.[bracket];

    if (!bracketMapping) {
        throw new Error(`Invalid region or bracket: ${region} ${bracket}`);
    }

    const { table, apiEndpoint, params } = bracketMapping;
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
                win_ratio: Math.round((item.season_match_statistics.won / item.season_match_statistics.played) * 100).toString(), // Ensure win_ratio is a number
                present: true
            }));

            console.log(`Updating leaderboard data for ${version} ${region} ${bracket}...`);

            // Set all present records to false
            await db.update(table).set({ present: false }).where(eq(table.present, true));

            for (const data of formattedData) {
                if (table !== null) {
                    requests.push(handleDataInsert(data, table, region, version, bracket));
                }

                if (requests.length >= 100) {
                    await Promise.all(requests);
                    requests.length = 0;
                }
            }

            if (requests.length > 0) {
                await Promise.all(requests);
            }

            console.log(`Deleting entries that are not present in the current leaderboard for ${version} ${region} ${bracket}...`);
            await db.delete(table).where(and(
                eq(table.present, false),
                lt(table.rank, 5000)
            ));            

            console.log(`Leaderboard data updated successfully for ${version} ${region} ${bracket}!`);
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

const handleDataInsert = async (formattedData: LeaderboardEntry, table: LeaderboardTable, region: string, version: string, bracket: string): Promise<void> => {

    let updateData: LeaderboardEntry = { ...formattedData };

    try {
        const existingRecord = await db
            .select()
            .from(table)
            .where(and(
                eq(table.character_name, formattedData.character_name),
                eq(table.realm_slug, formattedData.realm_slug),
            ));
        if (existingRecord.length === 0) {
            await db.insert(table).values(formattedData);
            return;
        }

        if (existingRecord.length > 1) {
            console.log('Multiple entries found for', formattedData.character_name, formattedData.realm_slug);
            // Delete duplicates
            await db
                .delete(table)
                .where(and(
                    eq(table.character_name, formattedData.character_name),
                    eq(table.realm_slug, formattedData.realm_slug),
                ));

            // Reinsert the formattedData as a fresh entry
            await db.insert(table).values(formattedData);
            return;
        }

        const existingEntry = existingRecord[0] as LeaderboardEntry;

        // Preserve existing data in some fields and changed updated_at if played is different
        updateData = {
            ...formattedData,
            character_class: existingEntry.character_class,
            character_spec: existingEntry.character_spec,
            created_at: existingEntry.created_at,
            updated_at: existingEntry.played === formattedData.played ? existingEntry.updated_at : new Date(),
            history: existingEntry.history,
            present: true
        };

        // If the played value is different, update the history and updated_at
        if (existingEntry.played !== formattedData.played) {

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

            // Limit history to 40 entries4
            if (newHistory.length > 40) {
                newHistory = newHistory.slice(newHistory.length - 20);
            }

        }
    } catch (error) {
        console.log('Error fetching existing data', (error as Error).message);

    }

    try {
        await db.update(table).set(updateData).where(and(
            eq(table.character_name, formattedData.character_name),
            eq(table.realm_slug, formattedData.realm_slug),
        ));


    } catch (error) {
        console.log('Error updating leaderboard data:', (error as Error).message);
    }

};

