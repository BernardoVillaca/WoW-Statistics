import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import * as schema from './schema'
import { updateActivityStatistics } from '../actions/updateActivityStatistics';
import { updateShuffle } from '../actions/updateShuffle';
import { updateClassSpecCount } from '../actions/updateClassSpecCount';
import { updateLeaderboard } from '../actions/updateLeaderboard';
import { getExtraDataForEachPlayer } from '../actions/getExtraDataForEachPlayer';
import { updateLegacyLeaderboard } from '../actions/updateLegacyLeaderboards';
import { getClassSpecForLegacy } from '../actions/getClassSpecForLegacy';
import { resetLeaderboardDb } from '../actions/resetLeaderboardDb';



export const db = drizzle(sql, { schema });

// let first = true;

// if (first) {

//     resetLeaderboardDb('retail', 'eu', 'shuffle');
   
    
//     first = false;
// }