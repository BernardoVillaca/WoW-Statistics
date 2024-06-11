import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import * as schema from './schema'
import { updateShuffle } from '../actions/updateShuffle';


// Use this object to send drizzle queries to your DB
export const db = drizzle(sql, { schema });

let firstRun = true;

if(firstRun){

await updateShuffle('us');
firstRun = false;


}