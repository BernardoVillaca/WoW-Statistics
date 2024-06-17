import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import * as schema from './schema'
import { getLeaderboardsStatistics } from '../actions/getLeaderboardsStatistics';

export const db = drizzle(sql, { schema });


let firstRun = true;

if(db && firstRun) {
    await getLeaderboardsStatistics();
    firstRun = false;
}