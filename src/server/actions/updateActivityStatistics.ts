import { db } from '~/server/db';
import { desc } from "drizzle-orm";
import { leaderboardTablesMap } from "~/utils/helper/leaderboardTablesMap";
import { activityStatistics } from '../db/schema';
import type { ActivityStatistics, PlayerActivity, SpecActivity } from '~/utils/helper/activityMap';


type OverallActivityStatisticsData = {
    created_at: Date;
    [key: string]: ActivityStatistics | Date;
};

type IHistory = {
    won: number;
    lost: number;
    played: number;
    rank: number;
    rating: number;
    updated_at: Date;
}

export const updateActivityStatistics = async () => {
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    // Initialize the overall activity statistics object
    const overallActivityStatisticsData: OverallActivityStatisticsData = {
        created_at: now,
    };

    console.log('Updating activity statistics');
    for (const [key, { column, table }] of Object.entries(leaderboardTablesMap)) {
        // Initialize counts for active players
        let total24h = 0;
        let total48h = 0;
        let total72h = 0;

        const playerActivity24h = new Map<string, PlayerActivity>();
        const playerActivity48h = new Map<string, PlayerActivity>();
        const playerActivity72h = new Map<string, PlayerActivity>();

        const specActivity24h = new Map<string, SpecActivity>();
        const specActivity48h = new Map<string, SpecActivity>();
        const specActivity72h = new Map<string, SpecActivity>();

        const tableData = await db.select().from(table).orderBy(desc(table.rating))

        for (const row of tableData) {
            if (!row.updated_at || !row.played || !row.won || !row.lost || !row.character_name
                || !row.character_spec || !row.character_class || !row.realm_slug
                || !row.history || !row.rating || !row.rank) {
                continue;
            }

            const updatedAt = new Date(row.updated_at);
            const history: IHistory[] = (row.history as IHistory[]);
            const timeDiff = now.getTime() - updatedAt.getTime();

            const findHistoryRecordToCalculate = (timeFrame: number): IHistory | undefined => {
                for (let i = history.length - 1; i >= 0; i--) {
                    const historyRecord = history[i];
                    if (!historyRecord) continue;

                    const historyUpdatedAt = new Date(historyRecord.updated_at).getTime();
                    if (now.getTime() - historyUpdatedAt > timeFrame) {
                        return historyRecord;
                    }
                }
                return undefined;
            };

            // 24 hours count
            if (timeDiff <= oneDay) {
                total24h += 1;

                const specKey = `${row.character_spec}-${row.character_class}`;
                const currentSpecActivity = specActivity24h.get(specKey);

                if (currentSpecActivity) {
                    currentSpecActivity.played += 1;
                } else {
                    specActivity24h.set(specKey, {
                        played: 1,
                        character_spec: row.character_spec,
                        character_class: row.character_class
                    });
                }
                const historyRecord = findHistoryRecordToCalculate(oneDay);
                if (historyRecord) {
                    const { character_name, realm_slug } = row;
                    playerActivity24h.set(`${character_name}-${realm_slug}`, {
                        played: row.played - historyRecord.played,
                        rating: row.rating,
                        rank: row.rank,
                        won: row.won - historyRecord.won,
                        lost: row.lost - historyRecord.lost,
                        character_name: row.character_name,
                        character_spec: row.character_spec,
                        character_class: row.character_class,
                        realm_slug: row.realm_slug
                    });
                }

            }

            // 48 hours count
            if (timeDiff <= oneDay * 2) {
                total48h += 1;

                const specKey48h = `${row.character_spec}-${row.character_class}`;
                if (specActivity48h.has(specKey48h)) {
                    specActivity48h.get(specKey48h)!.played += 1;
                } else {
                    specActivity48h.set(specKey48h, {
                        played: 1,
                        character_spec: row.character_spec,
                        character_class: row.character_class
                    });
                };
                const historyRecord = findHistoryRecordToCalculate(oneDay * 2);
                if (historyRecord) {
                    const { character_name, realm_slug } = row
                    playerActivity48h.set(`${character_name}-${realm_slug}`, {
                        played: row.played - historyRecord.played,
                        rating: row.rating,
                        rank: row.rank,
                        won: row.won - historyRecord.won,
                        lost: row.lost - historyRecord.lost,
                        character_name: row.character_name,
                        character_spec: row.character_spec,
                        character_class: row.character_class,
                        realm_slug: row.realm_slug
                    });
                };

            };

            // 72 hours count
            if (timeDiff <= oneDay * 3) {
                total72h += 1;

                const specKey72h = `${row.character_spec}-${row.character_class}`;
                if (specActivity72h.has(specKey72h)) {
                    specActivity72h.get(specKey72h)!.played += 1;
                } else {
                    specActivity72h.set(specKey72h, {
                        played: 1,
                        character_spec: row.character_spec,
                        character_class: row.character_class
                    });
                };
                const historyRecord = findHistoryRecordToCalculate(oneDay * 3);
                if (historyRecord) {
                    const { character_name, realm_slug } = row
                    playerActivity72h.set(`${character_name}-${realm_slug}`, {
                        played: row.played - historyRecord.played,
                        rating: row.rating,
                        rank: row.rank,
                        won: row.won - historyRecord.won,
                        lost: row.lost - historyRecord.lost,
                        character_name: row.character_name,
                        character_spec: row.character_spec,
                        character_class: row.character_class,
                        realm_slug: row.realm_slug
                    });
                };

            };

            const getTop5 = <T extends { rank?: number; played: number }>(activity: Map<string, T>): Record<string, T> => {
                // Convert the Map to an array of entries, filter, sort, and slice to get top 5
                const top5 = new Map(
                    [...activity.entries()]
                        .filter(([_, value]) => value.rank === undefined || value.rank < 2500)
                        .sort((a, b) => b[1].played - a[1].played)
                        .slice(0, 5)
                );

                // Convert the Map back to an object
                const result: Record<string, T> = {};
                top5.forEach((value, key) => {
                    result[key] = value;
                });

                return result;
            };

            // Add the activity statistics for this column to the overall object
            overallActivityStatisticsData[column] = {
                total24h,
                total48h,
                total72h,

                mostActivePlayers24h: getTop5(playerActivity24h),
                mostActivePlayers48h: getTop5(playerActivity48h),
                mostActivePlayers72h: getTop5(playerActivity72h),
                
                mostActiveSpecs24h: getTop5(specActivity24h),
                mostActiveSpecs48h: getTop5(specActivity48h),
                mostActiveSpecs72h: getTop5(specActivity72h),

            };
        }
    };
    try {
        await db.insert(activityStatistics).values(overallActivityStatisticsData);
        console.log(`Activity statistics inserted successfully!`);
    } catch (error) {
        console.error(`Error inserting activity statistics:`, error);
    }
}
