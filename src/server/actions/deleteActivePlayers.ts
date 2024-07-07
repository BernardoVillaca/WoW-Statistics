import { db } from "../db";
import { currentActivePlayers } from "../db/schema";
import { sql } from 'drizzle-orm';

export const deleteActivePlayers = async () => {
    try {
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
        await db.delete(currentActivePlayers).where(sql`${currentActivePlayers.updated_at} < ${twoHoursAgo}`);
        console.log('Old records deleted')
    } catch (error) {
        console.error('Error fetching old records:', error);
    }
};


