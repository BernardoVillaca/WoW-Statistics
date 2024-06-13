import axios from 'axios';
import { db } from '~/server/db';
import { getAuthToken } from '~/server/actions/getAuthToken';
import { eq } from 'drizzle-orm/expressions';
import { RatingsCutoff } from '../db/schema';
import { specIdMap } from '~/utils/helper/specIdMap';

interface RegionParams {
    url: string;
    params: {
        namespace: string;
        locale: string;
    };
}

const regionParams: { [key: string]: RegionParams } = {
    us: {
        url: 'https://us.api.blizzard.com/data/wow/pvp-season/37/pvp-reward/index',
        params: {
            namespace: 'dynamic-us',
            locale: 'en_US',
        },
    },
    eu: {
        url: 'https://eu.api.blizzard.com/data/wow/pvp-season/37/pvp-reward/index',
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
    [key: string]: number;
}

interface AllCutoffs {
    [key: string]: {
        [key: string]: number;
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
                    const specName = specIdMap[reward.specialization.id];
                    if (specName) {
                        cutoffs[`${specName}_cutoff`] = reward.rating_cutoff;
                    }
                } else if (reward.faction) {
                    cutoffs[`rbg_${reward.faction.type.toLowerCase()}_cutoff`] = reward.rating_cutoff;
                } else {
                    cutoffs[`${reward.bracket.type.toLowerCase()}_cutoff`] = reward.rating_cutoff;
                }
            }

            // Push the cutoffs to the respective part of allCutoffs
            allCutoffs[`${region}_cutoffs`] = { ...allCutoffs[`${region}_cutoffs`], ...cutoffs };

            console.log(`Ratings cutoff collected for ${region.toUpperCase()} region!`);
        }

        // Update the database with the collected cutoffs and set updated_at field
        await db.update(RatingsCutoff).set({ ...allCutoffs, updated_at: new Date()}).where(eq(RatingsCutoff.id, 1));
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
