import { db } from '~/server/db';
import { asc, eq } from 'drizzle-orm';
import { us3v3Leaderboard, usRealms } from '~/server/db/schema';

export const getPossibleRealms = async (): Promise<void> => {
    const leaderboardData = await db.query.us3v3Leaderboard.findMany({
        orderBy: [asc(us3v3Leaderboard.rank)]
    });

    let requests = [];

    for (const data of leaderboardData) {
        requests.push(handleRealmInsert(data));

        if (requests.length >= 50) {
            await Promise.all(requests);
            requests.length = 0;
        }
    }

    if (requests.length > 0) {
        await Promise.all(requests);
    }
};

const handleRealmInsert = async (data: any) => {
    const existingRealm = await db
        .select()
        .from(usRealms)
        .where(eq(usRealms.realm_name, data.realm_slug ?? ''));

    if (existingRealm.length === 0) {
        console.log('Inserting', data.realm_slug, 'into the database');
        try {
            await db.insert(usRealms).values({
                realm_name: data.realm_slug
            }).onConflictDoNothing();
        } catch (error: any) {
            console.log(error.message);
        }
    }
};
