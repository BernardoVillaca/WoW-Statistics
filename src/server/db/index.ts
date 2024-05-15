import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import * as schema from './schema'
import { getLeaderboardData } from "~/api/updateLeaderboard";

// Use this object to send drizzle queries to your DB
export const db = drizzle(sql, { schema });

setInterval(async () => {
  console.log('Updating leaderboard...');
  await getLeaderboardData();
}, 1800000); // 1800000 ms = 30 min
