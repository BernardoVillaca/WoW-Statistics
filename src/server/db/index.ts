import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import * as schema from './schema'
import { updateActivityStatistics } from '../actions/updateActivityStatistics';
import { resetLeaderboardDb } from '../actions/resetLeaderboardDb';
import { updateLeaderboard } from '../actions/updateLeaderboard';
import { getExtraDataForEachPlayer } from '../actions/getExtraDataForEachPlayer';



export const db = drizzle(sql, { schema });

let first = true
if (first) {

    // updateLeaderboard('classic', 'us', '3v3',)
    getExtraDataForEachPlayer('classic', 'us', '3v3')
    
    first = false
}