import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import * as schema from './schema'
import { updateLeaderboard } from "~/api/updateLeaderboard";
import { getExtraDataForEachPlayer } from '~/api/getExtraDataForEachPlayer';

// Use this object to send drizzle queries to your DB
export const db = drizzle(sql, { schema });
let firstRun = true;


const doFirstRun = async () => {
  if(firstRun){
    
    
    firstRun = false;
  
  }
}
doFirstRun();


setInterval(async () => {
  console.log('Updating leaderboard...');
  await updateLeaderboard();
  // await getExtraDataForEachPlayer()
}, 1800000); // 1800000 ms = 30 min
