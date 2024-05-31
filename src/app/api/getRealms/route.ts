import { asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { usRealms } from "~/server/db/schema";

export async function GET(req: NextRequest) {
    try {
        const realmList = await db.query.usRealms.findMany({
            orderBy: [asc(usRealms.realm_name)]
        });

        // Transform the realm names to have the first character in uppercase
        const transformedRealmList = realmList.map(realm => ({
            ...realm,
            realm_name: realm.realm_name ? realm.realm_name.charAt(0).toUpperCase() + realm.realm_name.slice(1) : null
        }));

        return NextResponse.json({ realmList: transformedRealmList });
    } catch (error) {
        console.error('Error fetching realms:', error);
        return NextResponse.json({ error: 'Failed to fetch realms' }, { status: 500 });
    }
}
