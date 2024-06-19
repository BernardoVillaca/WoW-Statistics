import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import * as schema from './schema'
import { getLeaderboardsStatistics } from '../actions/getLeaderboardsStatistics';
import { updateRatingsCutoffs } from '../actions/updateRatingsCutoffs';

export const db = drizzle(sql, { schema });


let firstRun = true;

if(db && firstRun) {
    await updateRatingsCutoffs();
    firstRun = false;
}