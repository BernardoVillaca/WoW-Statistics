import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import * as schema from './schema'
import { getExtraDataForEachPlayer } from '../actions/getExtraDataForEachPlayer';

export const db = drizzle(sql, { schema });



// let first = true;

// if(first) {
//     await getExtraDataForEachPlayer('classic', 'us', 'rbg');
//     first = false;
// }