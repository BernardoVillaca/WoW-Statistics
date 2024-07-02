import { db } from '~/server/db';
import { desc } from "drizzle-orm";
import { leaderboardTablesMap } from "~/utils/helper/leaderboardTablesMap";
import type { ClassStatisticsMap } from "~/utils/helper/classStatisticsMap";
import { classSpecStatistics } from '../db/schema';

type OverallClassSpecStatisticsData = {
    created_at: Date;
    [key: string]: ClassStatisticsMap | Date;
};


export const updateClassSpecCount = async () => {
    const overallClassSpecStatisticsData: OverallClassSpecStatisticsData = {
        created_at: new Date()
    };
    console.log('Updating class spec statistics')
    for (const { column, table } of Object.values(leaderboardTablesMap)) {
        // Create a new map for the current loop iteration
        const currentClassStatisticsMap: ClassStatisticsMap = {};

        const tableData = await db.select().from(table).orderBy(desc(table.rating));

        for (const row of tableData) {
            if (!row.character_class || !row.character_spec || !row.rating) {
                continue;
            }

            const className = row.character_class;
            const specName = row.character_spec;

            // Initialize the class and spec objects if they don't exist
            if (!currentClassStatisticsMap[className]) {
                currentClassStatisticsMap[className] = {
                    AllSpecs: {
                        totalCount: 0,
                        countAbove2800: 0,
                        countAbove2600: 0,
                        countAbove2400: 0,
                        countAbove2200: 0,
                        countAbove2000: 0,
                        countAbove1800: 0,
                        countAbove1600: 0
                    }
                };
            }

            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            if (!currentClassStatisticsMap![className]![specName]) {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                currentClassStatisticsMap![className]![specName] = {
                    totalCount: 0,
                    countAbove2800: 0,
                    countAbove2600: 0,
                    countAbove2400: 0,
                    countAbove2200: 0,
                    countAbove2000: 0,
                    countAbove1800: 0,
                    countAbove1600: 0
                };
            }

            // Update the total count
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            currentClassStatisticsMap[className]![specName]!.totalCount += 1;
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            currentClassStatisticsMap[className]!.AllSpecs!.totalCount += 1;

            // Update the counts based on rating thresholds
            const rating = row.rating;
            if (rating >= 2800) {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                currentClassStatisticsMap[className]![specName]!.countAbove2800 += 1;
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                currentClassStatisticsMap[className]!.AllSpecs!.countAbove2800 += 1;
            }
            if (rating >= 2600) {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                currentClassStatisticsMap[className]![specName]!.countAbove2600 += 1;
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                currentClassStatisticsMap[className]!.AllSpecs!.countAbove2600 += 1;
            }
            if (rating >= 2400) {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                currentClassStatisticsMap[className]![specName]!.countAbove2400 += 1;
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                currentClassStatisticsMap[className]!.AllSpecs!.countAbove2400 += 1;
            }
            if (rating >= 2200) {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                currentClassStatisticsMap[className]![specName]!.countAbove2200 += 1;
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                currentClassStatisticsMap[className]!.AllSpecs!.countAbove2200 += 1;
            }
            if (rating >= 2000) {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                currentClassStatisticsMap[className]![specName]!.countAbove2000 += 1;
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                currentClassStatisticsMap[className]!.AllSpecs!.countAbove2000 += 1;
            }
            if (rating >= 1800) {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                currentClassStatisticsMap[className]![specName]!.countAbove1800 += 1;
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                currentClassStatisticsMap[className]!.AllSpecs!.countAbove1800 += 1;
            }
            if (rating >= 1600) {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                currentClassStatisticsMap[className]![specName]!.countAbove1600 += 1;
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                currentClassStatisticsMap[className]!.AllSpecs!.countAbove1600 += 1;
            }
        }

        // Add the currentClassStatisticsMap to the allClassStatistics object
        overallClassSpecStatisticsData[column] = currentClassStatisticsMap;
    }

    // Insert all data at once
    try {
        await db.insert(classSpecStatistics).values(overallClassSpecStatisticsData);

        console.log('Successfully updated class spec statistics');
    } catch (error) {
        console.error('Error updating class spec statistics:', error);
    }
};
