import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import * as schema from './schema'
import { updateRatingsCutoffs } from '../actions/updateRatingsCutoffs';
import { updateActivityStatistics } from '../actions/updateActivityStatistics';
import { updateClassSpecCount } from '../actions/updateClassSpecCount';



export const db = drizzle(sql, { schema });

 let firstRun = true;

 if(firstRun) {
  //  await updateRatingsCutoffs();
  //  await updateActivityStatistics();
  //  await updateClassSpecCount();

    firstRun = false;
 }