import axios from 'axios';
import { db } from '~/server/db';
import { getAuthToken } from '~/server/actions/getAuthToken';
import { and, eq, gt } from 'drizzle-orm/expressions';
import { RatingsCutoff, eu3v3Leaderboard, euRBGLeaderboard, euShuffleLeaderboard, us3v3Leaderboard, usRBGLeaderboard, usShuffleLeaderboard } from '../db/schema';
import { specIdMap } from '~/utils/helper/specIdMap';

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

const regionParams: { [key: string]: RegionParams } = {
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

interface Cutoffs {
    [key: string]: {
        rating: number;
        count: number;
    }
}

interface AllCutoffs {
    [key: string]: {
        [key: string]: {
            rating: number;
            count: number;
        }
    };
}

export const updateRatingsCutoffs = async (): Promise<void> => {
    console.log('Updating ratings cutoffs...');
    const authToken = await getAuthToken(false);
    let allCutoffs: AllCutoffs = {
        us_cutoffs: {},
        eu_cutoffs: {},
    };

    try {
        for (const region in regionParams) {
            const regionParam = regionParams[region];
            const table3v3 = regionParam?.db3v3;
            const tableShuffle = regionParam?.dbShuffle;
            const tableRbg = regionParam?.dbRbg;
            if (!regionParam) continue;
            const { url, params } = regionParam;
            const response = await axios.get<ApiResponse>(url, {
                params: {
                    ...params,
                    access_token: authToken,
                },
            });
            const data = response.data;

            const cutoffs: Cutoffs = {};

            for (const reward of data.rewards) {
                if (reward.specialization) {
                    const keyName = specIdMap[reward.specialization.id]?.name;
                    if (keyName && tableShuffle) {
                        const specName = specIdMap[reward.specialization.id]?.spec || '';
                        const className = specIdMap[reward.specialization.id]?.class || '';
                        const ratingCutoff = reward.rating_cutoff || 0;
                        const data = await db
                            .select()
                            .from(tableShuffle)
                            .where(and(
                                eq(tableShuffle.character_spec, specName),
                                eq(tableShuffle.character_class, className),
                                gt(tableShuffle.rating, ratingCutoff)
                            ))
                        const count = data.length;
                        cutoffs[keyName] = { rating: reward.rating_cutoff, count: count };
                    }

                } else if (reward.faction && tableRbg) {
                    if (reward.faction.type === 'HORDE') {
                        const data = await db
                            .select()
                            .from(tableRbg)
                            .where(and(
                                eq(tableRbg.faction_name, 'HORDE'),
                                gt(tableRbg.rating, reward.rating_cutoff)
                            ))
                        const count = data.length;
                        cutoffs['rbg_horde_cutoff'] = { rating: reward.rating_cutoff, count: count };
                    } else if (reward.faction.type === 'ALLIANCE') {
                        const data = await db
                            .select()
                            .from(tableRbg)
                            .where(and(
                                eq(tableRbg.faction_name, 'ALLIANCE'),
                                gt(tableRbg.rating, reward.rating_cutoff)
                            ))
                        const count = data.length;
                        cutoffs['rbg_alliance_cutoff'] = { rating: reward.rating_cutoff, count: count };
                    }
                } else {
                    if (table3v3) {
                        const data = await db
                            .select()
                            .from(table3v3)
                            .where(and(
                                gt(table3v3.rating, reward.rating_cutoff)
                            ))
                        const count = data.length;
                        cutoffs[`${reward.bracket.type.toLowerCase()}_cutoff`] = { rating: reward.rating_cutoff, count: count };
                    }

                }
            }

            allCutoffs[`${region}_cutoffs`] = { ...allCutoffs[`${region}_cutoffs`], ...cutoffs };

            console.log(`Ratings cutoff collected for ${region.toUpperCase()} region!`);
        }

        await db.update(RatingsCutoff).set({ ...allCutoffs, updated_at: new Date() }).where(eq(RatingsCutoff.id, 1));
        console.log('Ratings cutoff updated successfully in the database!');
    } catch (error) {
        console.log('Failed to fetch or insert leaderboard data:', (error as Error).message);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            console.log('Token expired, refreshing token and retrying the request...');
            await getAuthToken(true);
            return updateRatingsCutoffs();
        }
    }
};
