import { db } from "../db";
import { currentActivePlayers } from "../db/schema";
import { sql } from 'drizzle-orm';

export const printOldRecords = async () => {
    try {
        // Calculate the time 20 minutes ago
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
        console.log(new Date() > twoHoursAgo)
        // Fetch and print records older than 20 minutes
        const oldRecords = await db.delete(currentActivePlayers).where(sql`${currentActivePlayers.updated_at} < ${twoHoursAgo}`);
        console.log('Records older than 20 minutes:', oldRecords);
    } catch (error) {
        console.error('Error fetching old records:', error);
    }
};


