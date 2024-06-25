import axios from 'axios';
import { db } from '~/server/db';
import { getAuthToken } from '~/server/actions/getAuthToken';
import { and, eq, gte } from 'drizzle-orm/expressions';
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
        }// Fetch current history from the database

        await db.insert(RatingsCutoff).values({
            created_at: new Date(),
            us_cutoffs: allCutoffs.us_cutoffs,
            eu_cutoffs: allCutoffs.eu_cutoffs,
        });

    } catch (error) {
        console.log('Failed to fetch or insert leaderboard data:', (error as Error).message);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            console.log('Token expired, refreshing token and retrying the request...');
            await getAuthToken(true);
            return updateRatingsCutoffs();
        }
    }
};