import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import * as schema from './schema'
import { updateLeaderboard } from '../actions/updateLeaderboard';
import { updateShuffle } from '../actions/updateShuffle';

export const db = drizzle(sql, { schema });

// let first = true;

// if(first) {
//    await updateLeaderboard('retail', 'us', '3v3');
//     first = false;
// }