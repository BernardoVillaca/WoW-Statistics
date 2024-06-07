import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import * as schema from './schema'
import { updateLeaderboard } from "~/server/actions/updateLeaderboard"
import { getExtraDataForEachPlayer } from "~/server/actions/getExtraDataForEachPlayer";
import { getPossibleRealms } from '../actions/getPossibleRealms';
import { scrapPlayerArmory } from '../actions/scrapPlayerArmory';

// Use this object to send drizzle queries to your DB
export const db = drizzle(sql, { schema });
let firstRun = true;

const doFirstRun = async () => {
  if (firstRun) {











    // await updateLeaderboard('retail', 'us', '3v3');
    // await updateLeaderboard('retail', 'us', '2v2');
    // await updateLeaderboard('retail', 'eu', '3v3');
    // await updateLeaderboard('retail', 'eu', '2v2');

    // await updateLeaderboard('classic', 'us', '3v3');
    // await updateLeaderboard('classic', 'us', '2v2');
    // await updateLeaderboard('classic', 'eu', '2v2');
    // await updateLeaderboard('classic', 'eu', '3v3');

    // await getExtraDataForEachPlayer('retail', 'us', '3v3');
    // await getExtraDataForEachPlayer('retail', 'us', '2v2');
    // await getExtraDataForEachPlayer('retail', 'eu', '3v3');
    // await getExtraDataForEachPlayer('retail', 'eu', '2v2');

    // await getExtraDataForEachPlayer('classic', 'us', '3v3');
    // await getExtraDataForEachPlayer('classic', 'us', '2v2');
    // await getExtraDataForEachPlayer('classic', 'eu', '3v3');
    // await getExtraDataForEachPlayer('classic', 'eu', '2v2');

    // await getPossibleRealms()
    firstRun = false;

  }



}
doFirstRun();

// setInterval(async () => {
//   console.log('Updating db');
//   await updateLeaderboard();
//   await getExtraDataForEachPlayer()
// }, 1800000); // 1800000 ms = 30 min
