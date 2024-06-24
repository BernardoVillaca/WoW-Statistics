import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import * as schema from './schema'
import { getActivityStatistics } from '../actions/getActivityStatistics';
import { getExtraDataForEachPlayer } from '../actions/getExtraDataForEachPlayer';



export const db = drizzle(sql, { schema });

 let firstRun = true;

 if(firstRun) {
   await getActivityStatistics()

    firstRun = false;
 }