import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import * as schema from './schema'
import { updateRatingsCutoffs } from '~/server/actions/updateRatingsCutoffs';
import { getExtraDataForEachPlayer } from '../actions/getExtraDataForEachPlayer';




// Use this object to send drizzle queries to your DB
export const db = drizzle(sql, { schema });

let firstRun = true;

if (firstRun) {
  await updateRatingsCutoffs();



    firstRun = false;
}