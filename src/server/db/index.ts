import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import * as schema from './schema'
import { updateLeaderboard } from '../actions/updateLeaderboard';
import { updateShuffle } from '../actions/updateShuffle';
import { updateClassSpecCount } from '../actions/updateClassSpecCount';
import { updateRatingsCutoffs } from '../actions/updateRatingsCutoffs';
import { updateActivityStatistics } from '../actions/updateActivityStatistics';
import { deleteActivePlayers } from '../actions/deleteActivePlayers';


export const db = drizzle(sql, { schema });

// let first = true;

// if (first) {
//     await deleteActivePlayers();
//     first = false;
// }