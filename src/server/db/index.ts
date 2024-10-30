import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import * as schema from './schema'
import { updateActivityStatistics } from '../actions/updateActivityStatistics';



export const db = drizzle(sql, { schema });

// let first = true
// if (first) {

//     await updateActivityStatistics()
//     first = false
// }