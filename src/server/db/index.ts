import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import * as schema from './schema'



export const db = drizzle(sql, { schema });

// let first = true;

// if (first) {

//     await getClassSpecForLegacy('eu', '3v3', 37)
//     await getClassSpecForLegacy('eu', '2v2', 37)
//     await getClassSpecForLegacy('eu', 'rbg', 37)
//     first = false;
// }