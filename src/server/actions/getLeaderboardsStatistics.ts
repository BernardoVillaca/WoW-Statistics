import { db } from '~/server/db';
import { desc, eq } from "drizzle-orm";
import { leaderboardTablesMap } from "~/utils/helper/leaderboardTablesMap";
import type { IClassStatisticsMap } from "~/utils/helper/classStatisticsMap";   
import { wowStatistics } from '../db/schema';

export const getLeaderboardsStatistics = async () => {
    for (const [key, { version, column, table }] of Object.entries(leaderboardTablesMap)) {
        // Create a new map for the current loop iteration
        const currentClassStatisticsMap: IClassStatisticsMap = {};

        const tableData = await db.select().from(table).orderBy(desc(table.rating));

        for (const row of tableData) {
            if (!row.character_class || !row.character_spec || !row.rating) {
                continue;
            }
            const className = row.character_class;
            const specName = row.character_spec;
            // If the class doesn't exist in the current map, create it
            if (!currentClassStatisticsMap[className]) {
                currentClassStatisticsMap[className] = {};
            }
            // If the spec doesn't exist in the current map, create it
            if (!currentClassStatisticsMap[className]![specName]) {
                currentClassStatisticsMap[className]![specName] = {
                    totalCount: 0,
                    countAbove2800: 0,
                    countAbove2600: 0,
                    countAbove2400: 0,
                    countAbove2200: 0,
                    countAbove2000: 0,
                    countAbove1600: 0,
                    countAbove1800: 0
                };
            }
            // If the Allspecs doesn't exist in the current map, create it
            if (!currentClassStatisticsMap[className]!.AllSpecs) {
                currentClassStatisticsMap[className]!.AllSpecs = {
                    totalCount: 0,
                    countAbove2800: 0,
                    countAbove2600: 0,
                    countAbove2400: 0,
                    countAbove2200: 0,
                    countAbove2000: 0,
                    countAbove1600: 0,
                    countAbove1800: 0
                };
            }

            // Update the total count
            currentClassStatisticsMap[className]![specName]!.totalCount += 1;
            currentClassStatisticsMap[className]!.AllSpecs!.totalCount += 1;

            // Update the counts based on rating thresholds
            const rating = row.rating;
            if (rating >= 2800) {
                currentClassStatisticsMap[className]![specName]!.countAbove2800 += 1;
                currentClassStatisticsMap[className]!.AllSpecs!.countAbove2800 += 1;
            } else if (rating >= 2600) {
                currentClassStatisticsMap[className]![specName]!.countAbove2600 += 1;
                currentClassStatisticsMap[className]!.AllSpecs!.countAbove2600 += 1;
            } else if (rating >= 2400) {
                currentClassStatisticsMap[className]![specName]!.countAbove2400 += 1;
                currentClassStatisticsMap[className]!.AllSpecs!.countAbove2400 += 1;
            } else if (rating >= 2200) {
                currentClassStatisticsMap[className]![specName]!.countAbove2200 += 1;
                currentClassStatisticsMap[className]!.AllSpecs!.countAbove2200 += 1;
            } else if (rating >= 2000) {
                currentClassStatisticsMap[className]![specName]!.countAbove2000 += 1;
                currentClassStatisticsMap[className]!.AllSpecs!.countAbove2000 += 1;
            } else if (rating >= 1800) {
                currentClassStatisticsMap[className]![specName]!.countAbove1800 += 1;
                currentClassStatisticsMap[className]!.AllSpecs!.countAbove1800 += 1;
            } else if (rating >= 1600) {
                currentClassStatisticsMap[className]![specName]!.countAbove1600 += 1;
                currentClassStatisticsMap[className]!.AllSpecs!.countAbove1600 += 1;
            }
        }

        try {
            const response = await db.select().from(wowStatistics).where(eq(wowStatistics.id, 1));

            // If no data is found, insert the new cutoffs
            if (response.length === 0) {
                await db.insert(wowStatistics).values({
                    id: 1,
                    [column]: currentClassStatisticsMap
                });
                console.log(`Ratings cutoff inserted successfully in the ${column} column!`);
            } else {
                await db.update(wowStatistics).set({ [column]: currentClassStatisticsMap }).where(eq(wowStatistics.id, 1));
                console.log(`Ratings cutoff updated successfully in the ${column} column!`);
            }
        } catch (error) {
            console.error(`Error updating the ${column} column:`, error);
        }
    }
};
