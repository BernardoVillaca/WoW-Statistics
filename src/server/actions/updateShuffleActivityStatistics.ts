import { classStatisticsMap } from "~/utils/helper/classStatisticsMap"
import { db } from "../db"
import { usShuffleLeaderboard } from "../db/schema"
import { and, eq, sql } from "drizzle-orm"





export const updateShuffleActivityStatistics = async () => {
    for (const character_class in classStatisticsMap) {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
        const twentyFourHoursAgoISOString = twentyFourHoursAgo.toISOString();

        const response = await db
            .select()
            .from(usShuffleLeaderboard)
            .where(and(
                eq(usShuffleLeaderboard.character_class, character_class),
                sql`${usShuffleLeaderboard.updated_at} >= ${sql.raw(`'${twentyFourHoursAgoISOString}'`)}`
            ));

        console.log(response.length, character_class);
    }
};


