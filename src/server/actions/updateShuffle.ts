import axios from 'axios';
import { db } from '~/server/db';
import { getAuthToken } from '~/server/actions/getAuthToken';
import { and, eq } from 'drizzle-orm/expressions';
import { euShuffleLeaderboard, usShuffleLeaderboard } from '~/server/db/schema';

const classesSpecs = [
    { class: 'warrior', specs: ['arms', 'fury', 'protection'] },
    { class: 'paladin', specs: ['holy', 'protection', 'retribution'] },
    { class: 'hunter', specs: ['beastmastery', 'marksmanship', 'survival'] },
    { class: 'rogue', specs: ['assassination', 'outlaw', 'subtlety'] },
    { class: 'priest', specs: ['discipline', 'holy', 'shadow'] },
    { class: 'deathknight', specs: ['blood', 'frost', 'unholy'] },
    { class: 'shaman', specs: ['elemental', 'enhancement', 'restoration'] },
    { class: 'mage', specs: ['arcane', 'fire', 'frost'] },
    { class: 'warlock', specs: ['affliction', 'demonology', 'destruction'] },
    { class: 'monk', specs: ['brewmaster', 'mistweaver', 'windwalker'] },
    { class: 'druid', specs: ['balance', 'feral', 'guardian', 'restoration'] },
    { class: 'demonhunter', specs: ['havoc', 'vengeance'] },
    { class: 'evoker', specs: ['preservation, augmentation, devastation'] }
];

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

type LeaderboardTable = typeof euShuffleLeaderboard | typeof usShuffleLeaderboard;

const capitalizeAndFormatString = (str: string): string => {
    if (!str) return str;
   
    const formattedStr = str.replace(/([a-z])([A-Z])/g, '$1 $2');
    // Capitalize the first character of each word
    return formattedStr.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

export const updateShuffle = async (region: 'eu' | 'us'): Promise<void> => {
    const isEU = region === 'eu';
    const table = isEU ? euShuffleLeaderboard : usShuffleLeaderboard;
    const regionParams = isEU ? {
        namespace: 'dynamic-eu',
        locale: 'en_GB'
    } : {
        namespace: 'dynamic-us',
        locale: 'en_US'
    };

    try {
        const authToken = await getAuthToken(false);
        const requests: Promise<void>[] = [];

        for (const { class: characterClass, specs } of classesSpecs) {
            for (const spec of specs) {
                const apiEndpoint = `https://${region}.api.blizzard.com/data/wow/pvp-season/37/pvp-leaderboard/shuffle-${characterClass}-${spec}`;
                console.log(`Fetching shuffle leaderboard data for ${region} ${characterClass} ${spec}...`)
                const response = await axios.get<ApiResponse>(apiEndpoint, {
                    params: {
                        ...regionParams,
                        access_token: authToken
                    }
                });

                const entries = response.data?.entries;
                if (entries) {
                    const formattedData: LeaderboardEntry[] = entries.map((item): LeaderboardEntry => ({
                        character_name: item.character.name,
                        character_id: item.character.id,
                        character_class: capitalizeAndFormatString(characterClass),
                        character_spec: capitalizeAndFormatString(spec),
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
                        win_ratio: Math.round((item.season_match_statistics.won / item.season_match_statistics.played) * 100).toString()
                    }));

                    console.log(`Updating shuffle leaderboard data for ${region} ${characterClass} ${spec}...`);

                    for (const data of formattedData) {
                        requests.push(handleDataInsert(data, table));
                        if (requests.length >= 100) {
                            await Promise.all(requests);
                            requests.length = 0;
                        }
                    }

                    if (requests.length > 0) {
                        await Promise.all(requests);
                    }

                    console.log(`Shuffle leaderboard data updated successfully for ${region} ${characterClass} ${spec}!`);
                } else {
                    console.log(`No entries found for ${characterClass} ${spec} in the response`);
                }
            }
        }
    } catch (error: unknown) {
        console.log('Failed to fetch or insert leaderboard data:', (error as Error).message);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            console.log('Token expired, refreshing token and retrying the request...');
            await getAuthToken(true);
            return updateShuffle(region);
        }
    
    }
};

const handleDataInsert = async (data: LeaderboardEntry, table: LeaderboardTable): Promise<void> => {
    const existingRecord = await db
        .select()
        .from(table)
        .where(and(
            eq(table.character_name, data.character_name),
            eq(table.realm_slug, data.realm_slug),
            eq(table.character_spec, data.character_spec)
        ))
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

    await db.update(table).set(updateData).where(and(
        eq(table.character_name, data.character_name),
        eq(table.realm_slug, data.realm_slug),
        eq(table.character_spec, data.character_spec)
    ));
};

