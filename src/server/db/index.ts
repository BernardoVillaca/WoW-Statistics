import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import * as schema from './schema'
import { updateActivityStatistics } from '../actions/updateActivityStatistics';
import { resetLeaderboardDb } from '../actions/resetLeaderboardDb';
import { updateLeaderboard } from '../actions/updateLeaderboard';
import { getExtraDataForEachPlayer } from '../actions/getExtraDataForEachPlayer';



export const db = drizzle(sql, { schema });

// let first = true
// if (first) {

//     await resetLeaderboardDb('classic', 'us', '3v3')
//     await resetLeaderboardDb('classic', 'us', '2v2')
//     await resetLeaderboardDb('classic', 'us', 'rbg')
//     await resetLeaderboardDb('classic', 'eu', '3v3')
//     await resetLeaderboardDb('classic', 'eu', '2v2')
//     await resetLeaderboardDb('classic', 'eu', 'rbg')


//     first = false
// }