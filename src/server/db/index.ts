import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import * as schema from './schema'

import { updateLeaderboard } from '../actions/updateLeaderboard';
import { getExtraDataForEachPlayer } from '../actions/getExtraDataForEachPlayer';
import { getPossibleRealms } from '../actions/getPossibleRealms';

// Use this object to send drizzle queries to your DB
export const db = drizzle(sql, { schema });


let isFirstRun = true;

// if (isFirstRun) {
//     await updateLeaderboard('retail', 'us', '3v3');
//     await updateLeaderboard('retail', 'us', '2v2');
//     await updateLeaderboard('retail', 'us', 'rbg');

//     await updateLeaderboard('retail', 'eu', '3v3');
//     await updateLeaderboard('retail', 'eu', '2v2');
//     await updateLeaderboard('retail', 'eu', 'rbg');

//     await updateLeaderboard('classic', 'us', '3v3');
//     await updateLeaderboard('classic', 'us', '2v2');
//     await updateLeaderboard('classic', 'us', 'rbg');

//     await updateLeaderboard('classic', 'eu', '3v3');
//     await updateLeaderboard('classic', 'eu', '2v2');
//     await updateLeaderboard('classic', 'eu', 'rbg');

//     await getExtraDataForEachPlayer('retail', 'us', '3v3');
//     await getExtraDataForEachPlayer('retail', 'us', '2v2');
//     await getExtraDataForEachPlayer('retail', 'us', 'rbg');

//     await getExtraDataForEachPlayer('retail', 'eu', '3v3');
//     await getExtraDataForEachPlayer('retail', 'eu', '2v2');
//     await getExtraDataForEachPlayer('retail', 'eu', 'rbg');

//     await getExtraDataForEachPlayer('classic', 'us', '3v3');
//     await getExtraDataForEachPlayer('classic', 'us', '2v2');
//     await getExtraDataForEachPlayer('classic', 'us', 'rbg');

//     await getExtraDataForEachPlayer('classic', 'eu', '3v3');
//     await getExtraDataForEachPlayer('classic', 'eu', '2v2');
//     await getExtraDataForEachPlayer('classic', 'eu', 'rbg');

//     await getPossibleRealms();

//     isFirstRun = false;
// }