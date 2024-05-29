import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import * as schema from './schema'
import { updateLeaderboard } from "~/server/actions/updateLeaderboard"
import { getExtraDataForEachPlayer } from "~/server/actions/getExtraDataForEachPlayer";

// Use this object to send drizzle queries to your DB
export const db = drizzle(sql, { schema });
let firstRun = true;

const doFirstRun = async () => {
  if (firstRun) {
    await updateLeaderboard();
    await getExtraDataForEachPlayer()

    firstRun = false;

  }
  
}
doFirstRun();

// setInterval(async () => {
//   console.log('Updating db');
//   await updateLeaderboard();
//   await getExtraDataForEachPlayer()
// }, 1800000); // 1800000 ms = 30 min
