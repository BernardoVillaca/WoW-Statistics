import { db } from '~/server/db';
import { asc, eq } from 'drizzle-orm';
import {
    us3v3Leaderboard,
    usRealms,
    eu3v3Leaderboard,
    euRealms,
    classicUs3v3Leaderboard,
    classicUsRealms,
    classicEu2v2Leaderboard,
    classicEusRealms,
} from '~/server/db/schema';

interface LeaderboardRealmMap {
    leaderboard: typeof us3v3Leaderboard | typeof eu3v3Leaderboard | typeof classicUs3v3Leaderboard | typeof classicEu2v2Leaderboard;
    realmTable: typeof usRealms | typeof euRealms | typeof classicUsRealms | typeof classicEusRealms;
    name: string;
}

interface RealmCount {
    realmName: string;
    count: number;
}

const leaderboardsToRealmsMap: LeaderboardRealmMap[] = [
    { leaderboard: us3v3Leaderboard, realmTable: usRealms, name: 'us' },
    { leaderboard: eu3v3Leaderboard, realmTable: euRealms, name: 'eu' },
    { leaderboard: classicUs3v3Leaderboard, realmTable: classicUsRealms, name: 'classicUs' },
    { leaderboard: classicEu2v2Leaderboard, realmTable: classicEusRealms, name: 'classicEu' },
];

export const getPossibleRealms = async (): Promise<void> => {
    for (const { leaderboard, realmTable, name } of leaderboardsToRealmsMap) {
        console.log(`Starting update for ${name}`);
        await updateRealmsForLeaderboard(leaderboard, realmTable, name);
        console.log(`Finished update for ${name}`);
    }
};

const updateRealmsForLeaderboard = async (
    leaderboard: typeof us3v3Leaderboard | typeof eu3v3Leaderboard | typeof classicUs3v3Leaderboard | typeof classicEu2v2Leaderboard,
    realmTable: typeof usRealms | typeof euRealms | typeof classicUsRealms | typeof classicEusRealms,
    name: string
): Promise<void> => {
    const leaderboardData = await db.select().from(leaderboard).orderBy(asc(leaderboard.rank));

    const realmCount: RealmCount[] = [];
   
    for (const data of leaderboardData) {
        const realmSlug = data.realm_slug ?? '';
        const existingRealm = realmCount.find(realm => realm.realmName === realmSlug);

        if (existingRealm) {
            existingRealm.count++;
        } else {
            realmCount.push({ realmName: realmSlug, count: 1 });
        }
    }

    await handleRealmInsert(realmCount, realmTable, name);
};

const handleRealmInsert = async (
    realmCount: RealmCount[],
    realmTable: typeof usRealms | typeof euRealms | typeof classicUsRealms | typeof classicEusRealms,
    name: string
): Promise<void> => {
    const batchSize = 50;
    const requests: Promise<void>[] = [];

    for (let i = 0; i < realmCount.length; i += batchSize) {
        const batch = realmCount.slice(i, i + batchSize);

        const updatePromises = batch.map(async ({ realmName, count }) => {
            const existingRealm = await db
                .select()
                .from(realmTable)
                .where(eq(realmTable.realm_name, realmName));

            if (existingRealm.length === 0) {
                console.log(`Inserting ${realmName} into the database for ${name}`);
                try {
                    await db.insert(realmTable).values({
                        realm_name: realmName,
                        records_count: count,
                    }).onConflictDoNothing();
                } catch (error) {
                    if (error instanceof Error) {
                        console.log(error.message);
                    }
                }
            } else if (existingRealm[0]?.records_count !== count) {
                console.log(`Updating record count for ${realmName} in the database for ${name}`);
                try {
                    await db.update(realmTable)
                        .set({ records_count: count })
                        .where(eq(realmTable.realm_name, realmName));
                } catch (error) {
                    if (error instanceof Error) {
                        console.log(error.message);
                    }
                }
            }
        });

        // Push the individual promises to the requests array
        requests.push(...updatePromises);
    }

    // Wait for all batches to complete
    await Promise.all(requests);
};
