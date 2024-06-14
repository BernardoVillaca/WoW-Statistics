import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import * as schema from './schema'
import { updateLeaderboard } from '../actions/updateLeaderboard';
import { updateRatingsCutoffs } from '../actions/updateRatingsCutoffs';

export const db = drizzle(sql, { schema });

let first = true;

if(first) {

    await updateRatingsCutoffs();
    // await updateLeaderboard('retail', 'us', '3v3')
    first = false;
}