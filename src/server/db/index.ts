import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import * as schema from './schema'
import { first } from 'node_modules/cheerio/lib/api/traversing';
import { getExtraDataForEachPlayer } from '../actions/getExtraDataForEachPlayer';
import { updateShuffle } from '../actions/updateShuffle';



// Use this object to send drizzle queries to your DB
export const db = drizzle(sql, { schema });

let firstRun = true;

if(firstRun) {


   await getExtraDataForEachPlayer('classic', 'eu', '3v3');



    firstRun = false;
}