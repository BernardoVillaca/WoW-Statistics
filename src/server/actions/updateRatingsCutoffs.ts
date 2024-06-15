import axios from 'axios';
import { db } from '~/server/db';
import { getAuthToken } from '~/server/actions/getAuthToken';
import { and, eq, gte } from 'drizzle-orm/expressions';
import { RatingsCutoff, eu3v3Leaderboard, euRBGLeaderboard, euShuffleLeaderboard, us3v3Leaderboard, usRBGLeaderboard, usShuffleLeaderboard } from '../db/schema';
import { specIdMap } from '~/utils/helper/specIdMap';
import { sql } from 'drizzle-orm';

interface RegionParams {
    url: string;
    db3v3: typeof eu3v3Leaderboard | typeof us3v3Leaderboard;
    dbShuffle: typeof euShuffleLeaderboard | typeof usShuffleLeaderboard;
    dbRbg: typeof euRBGLeaderboard | typeof usRBGLeaderboard;
    params: {
        namespace: string;
        locale: string;
    };
}

interface HistoryEntry {
    us_changes: string[];
    eu_changes: string[];
    us_cutoffs: Cutoffs | undefined;
    eu_cutoffs: Cutoffs | undefined;
    updated_at: Date;
}

interface RatingsCutoffType {
    id: number;
    history: HistoryEntry[];
    updated_at: Date;
    us_cutoffs: Cutoffs;
    eu_cutoffs: Cutoffs;
}

const regionParams: Record<string, RegionParams> = {
    us: {
        url: 'https://us.api.blizzard.com/data/wow/pvp-season/37/pvp-reward/index',
        db3v3: us3v3Leaderboard,
        dbShuffle: usShuffleLeaderboard,
        dbRbg: usRBGLeaderboard,
        params: {
            namespace: 'dynamic-us',
            locale: 'en_US',
        },
    },
    eu: {
        url: 'https://eu.api.blizzard.com/data/wow/pvp-season/37/pvp-reward/index',
        db3v3: eu3v3Leaderboard,
        dbShuffle: euShuffleLeaderboard,
        dbRbg: euRBGLeaderboard,
        params: {
            namespace: 'dynamic-eu',
            locale: 'en_GB',
        },
    },
};

interface ApiResponse {
    rewards: {
        bracket: {
            id: number;
            type: string;
        };
        rating_cutoff: number;
        specialization?: {
            id: number;
        };
        faction?: {
            type: string;
        };
    }[];
}

type Cutoffs = Record<string, { rating: number; count: number }>;

type AllCutoffs = {
    us_cutoffs: Cutoffs;
    eu_cutoffs: Cutoffs;
};

const getCutoffsForSpec = async (reward: ApiResponse['rewards'][0], tableShuffle: typeof euShuffleLeaderboard | typeof usShuffleLeaderboard) => {
    const keyName = specIdMap[reward.specialization!.id]?.name;
    if (keyName && tableShuffle) {
        const specName = specIdMap[reward.specialization!.id]?.spec ?? '';
        const className = specIdMap[reward.specialization!.id]?.class ?? '';
        const ratingCutoff = reward.rating_cutoff ?? 0;
        const data = await db
            .select()
            .from(tableShuffle)
            .where(and(
                eq(tableShuffle.character_spec, specName),
                eq(tableShuffle.character_class, className),
                gte(tableShuffle.rating, ratingCutoff)
            ));
        const count = data.length;
        return { [keyName]: { rating: ratingCutoff, count: count } };
    }
    return {};
};

const getCutoffsForFaction = async (reward: ApiResponse['rewards'][0], tableRbg: typeof euRBGLeaderboard | typeof usRBGLeaderboard) => {
    if (!reward.faction || !tableRbg) return {};

    const faction = reward.faction.type;
    const factionName = faction === 'HORDE' ? 'HORDE' : 'ALLIANCE';
    const data = await db
        .select()
        .from(tableRbg)
        .where(and(
            eq(tableRbg.faction_name, factionName),
            gte(tableRbg.rating, reward.rating_cutoff ?? 0)
        ));
    const count = data.length;
    return { [`rbg_${faction.toLowerCase()}_cutoff`]: { rating: reward.rating_cutoff ?? 0, count: count } };
};

const getCutoffsForBracket = async (reward: ApiResponse['rewards'][0], table3v3: typeof eu3v3Leaderboard | typeof us3v3Leaderboard) => {
    if (!table3v3) return {};

    const data = await db
        .select()
        .from(table3v3)
        .where(gte(table3v3.rating, reward.rating_cutoff ?? 0));
    const count = data.length;
    return { [`${reward.bracket.type.toLowerCase()}_cutoff`]: { rating: reward.rating_cutoff ?? 0, count: count } };
};

export const updateRatingsCutoffs = async (): Promise<void> => {
    console.log('Updating ratings cutoffs...');
    const authToken = await getAuthToken(false);
    const allCutoffs: AllCutoffs = {
        us_cutoffs: {},
        eu_cutoffs: {},
    };

    try {
        for (const region in regionParams) {
            const regionParam = regionParams[region];
            if (!regionParam) continue;

            const { url, params, db3v3, dbShuffle, dbRbg } = regionParam;
            const response = await axios.get<ApiResponse>(url, {
                params: {
                    ...params,
                    access_token: authToken,
                },
            });
            const data = response.data;

            const cutoffs: Cutoffs = {};

            for (const reward of data.rewards) {
                const specCutoffs = reward.specialization ? await getCutoffsForSpec(reward, dbShuffle) : {};
                const factionCutoffs = reward.faction ? await getCutoffsForFaction(reward, dbRbg) : {};
                const bracketCutoffs = !reward.specialization && !reward.faction ? await getCutoffsForBracket(reward, db3v3) : {};

                Object.assign(cutoffs, specCutoffs, factionCutoffs, bracketCutoffs);
            }

            if (region === 'us') {
                allCutoffs.us_cutoffs = { ...allCutoffs.us_cutoffs, ...cutoffs };
            } else if (region === 'eu') {
                allCutoffs.eu_cutoffs = { ...allCutoffs.eu_cutoffs, ...cutoffs };
            }

            console.log(`Ratings cutoff collected for ${region.toUpperCase()} region!`);
        }

        // Fetch current history from the database
        const response = await db.select().from(RatingsCutoff).where(eq(RatingsCutoff.id, 1));

        // If no data is found, insert the new cutoffs
        if (response.length === 0) {
            await db.insert(RatingsCutoff).values({
                id: 1,
                history: [],
                updated_at: new Date(),
                us_cutoffs: allCutoffs.us_cutoffs,
                eu_cutoffs: allCutoffs.eu_cutoffs,
            });

            console.log('Ratings cutoff inserted successfully in the database!');
            return;
        }
        const currentData: RatingsCutoffType = response[0] as RatingsCutoffType;

        // Initialize history as an array of HistoryEntry if it's not already
        let newHistory: HistoryEntry[] = currentData?.history ?? [];

        // Check if either eu_cutoffs or us_cutoffs have changed
        const cutoffsChanged = !deepEqual(currentData.us_cutoffs, allCutoffs.us_cutoffs) || !deepEqual(currentData.eu_cutoffs, allCutoffs.eu_cutoffs);

        if (cutoffsChanged) {
            let usChanges: string[] = [];
            let euChanges: string[] = [];

            if (!deepEqual(currentData.us_cutoffs, allCutoffs.us_cutoffs)) {
                usChanges = logDifferences(currentData.us_cutoffs, allCutoffs.us_cutoffs, 'us');
            }
            if (!deepEqual(currentData.eu_cutoffs, allCutoffs.eu_cutoffs)) {
                euChanges = logDifferences(currentData.eu_cutoffs, allCutoffs.eu_cutoffs, 'eu');
            }

            // Append the new cutoffs to the history
            const newEntry: HistoryEntry = {
                us_changes: usChanges,
                eu_changes: euChanges,
                us_cutoffs: currentData?.us_cutoffs,
                eu_cutoffs: currentData?.eu_cutoffs,
                updated_at: currentData?.updated_at
            };
            newHistory.push(newEntry);

            // Ensure history length does not exceed 40 entries
            if (newHistory.length > 40) {
                newHistory = newHistory.slice(newHistory.length - 40);
            }

            await db.update(RatingsCutoff)
                .set({
                    ...allCutoffs,
                    updated_at: new Date(),
                    history: sql`jsonb '${JSON.stringify(newHistory)}'`,
                })
                .where(eq(RatingsCutoff.id, 1));

            console.log('Ratings cutoff updated successfully in the database!');
        } else {
            console.log('No changes in cutoffs, no update needed.');
        }
    } catch (error) {
        console.log('Failed to fetch or insert leaderboard data:', (error as Error).message);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            console.log('Token expired, refreshing token and retrying the request...');
            await getAuthToken(true);
            return updateRatingsCutoffs();
        }
    }
};

const deepEqual = (obj1: Record<string, unknown> | undefined, obj2: Record<string, unknown> | undefined): boolean => {
    if (obj1 === obj2) {
        return true;
    }
    if (obj1 && obj2 && typeof obj1 === 'object' && typeof obj2 === 'object') {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        if (keys1.length !== keys2.length) {
            return false;
        }
        return keys1.every(key => deepEqual(obj1[key] as Record<string, unknown>, obj2[key] as Record<string, unknown>));
    }
    return false;
};

const logDifferences = (oldCutoffs: Cutoffs, newCutoffs: Cutoffs, region: string): string[] => {
    const changedKeys = Object.keys(newCutoffs).filter(key =>
        oldCutoffs[key] !== undefined && !deepEqual(oldCutoffs[key] as Record<string, unknown>, newCutoffs[key] as Record<string, unknown>));
    console.log(`Changes detected in ${region} cutoffs for keys:`, changedKeys);
    changedKeys.forEach(key => {
        console.log(`Old ${region} ${key}:`, oldCutoffs[key]);
        console.log(`New ${region} ${key}:`, newCutoffs[key]);
    });
    return changedKeys;
};

