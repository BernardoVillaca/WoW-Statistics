import { db } from '~/server/db';
import { desc, and, eq } from "drizzle-orm";
import { leaderboardTablesMap } from "~/utils/helper/leaderboardTablesMap";
import { classStatisticsMap, type ClassStatisticsMap } from "~/utils/helper/classStatisticsMap";
import { classSpecStatistics } from '../db/schema';

type OverallClassSpecStatisticsData = {
    created_at: Date;
    [key: string]: ClassStatisticsMap | Date;
};

export const updateClassSpecCount = async () => {
    const overallClassSpecStatisticsData: OverallClassSpecStatisticsData = {
        created_at: new Date()
    };
    console.log('Updating class spec statistics');

    for (const { column, table } of Object.values(leaderboardTablesMap)) {
        const currentClassStatisticsMap: ClassStatisticsMap = {};

        const classes = Object.keys(classStatisticsMap);

        for (const character_class of classes) {
            const response = await db
                .select()
                .from(table)
                .where(and(
                    eq(table.character_class, character_class),
                ));

            if (!currentClassStatisticsMap[character_class]) {
                currentClassStatisticsMap[character_class] = {
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

            const allSpecsData = currentClassStatisticsMap[character_class]?.AllSpecs;
            if (allSpecsData) {
                allSpecsData.totalCount = response.length;
                allSpecsData.countAbove2800 = response.filter(character => character.rating !== null && character.rating >= 2800).length;
                allSpecsData.countAbove2600 = response.filter(character => character.rating !== null && character.rating >= 2600).length;
                allSpecsData.countAbove2400 = response.filter(character => character.rating !== null && character.rating >= 2400).length;
                allSpecsData.countAbove2200 = response.filter(character => character.rating !== null && character.rating >= 2200).length;
                allSpecsData.countAbove2000 = response.filter(character => character.rating !== null && character.rating >= 2000).length;
                allSpecsData.countAbove1800 = response.filter(character => character.rating !== null && character.rating >= 1800).length;
                allSpecsData.countAbove1600 = response.filter(character => character.rating !== null && character.rating >= 1600).length;
            }

            for (const spec in classStatisticsMap[character_class]) {
                if (spec === 'AllSpecs') continue;

                if (!currentClassStatisticsMap[character_class][spec]) {
                    currentClassStatisticsMap[character_class][spec] = {
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

                const specData = currentClassStatisticsMap[character_class][spec];
                const specResponse = response.filter(character => character.character_spec === spec);

                if (specData) {
                    specData.totalCount = specResponse.length;
                    specData.countAbove2800 = specResponse.filter(character => character.rating !== null && character.rating >= 2800).length;
                    specData.countAbove2600 = specResponse.filter(character => character.rating !== null && character.rating >= 2600).length;
                    specData.countAbove2400 = specResponse.filter(character => character.rating !== null && character.rating >= 2400).length;
                    specData.countAbove2200 = specResponse.filter(character => character.rating !== null && character.rating >= 2200).length;
                    specData.countAbove2000 = specResponse.filter(character => character.rating !== null && character.rating >= 2000).length;
                    specData.countAbove1800 = specResponse.filter(character => character.rating !== null && character.rating >= 1800).length;
                    specData.countAbove1600 = specResponse.filter(character => character.rating !== null && character.rating >= 1600).length;
                }
            }
        }
        console.log('Finished updating class spec statistics for', column)
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
