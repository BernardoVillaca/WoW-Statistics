import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import * as schema from './schema'
import { getClassSpecForLegacy } from '../actions/getClassSpecForLegacy';



export const db = drizzle(sql, { schema });



// let firstRun = true;

// if (db && firstRun) {

//     await getClassSpecForLegacy('us', '3v3', 36);

//     firstRun = false;
// }