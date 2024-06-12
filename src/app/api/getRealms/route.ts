import { asc } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { usRealms, euRealms, classicUsRealms, classicEusRealms } from "~/server/db/schema";

const realmsMap = [
    { version: 'retail', region: 'us', table: usRealms },
    { version: 'retail', region: 'eu', table: euRealms },
    { version: 'classic', region: 'us', table: classicUsRealms },
    { version: 'classic', region: 'eu', table: classicEusRealms }
];

export async function GET(req: NextRequest) {
  
    const { searchParams } = new URL(req.url);
    const version = searchParams.get('version') ?? 'retail';
    const region = searchParams.get('region') ?? 'us'; 

    // Find the corresponding table for the specified version and region
    const regionTableEntry = realmsMap.find(entry => entry.version === version && entry.region === region);

    if (!regionTableEntry) {
        return NextResponse.json({ error: 'Invalid version or region specified' }, { status: 400 });
    }

    const regionTable = regionTableEntry.table;

    try {
        // Query the correct table for realms
        const realmList = await db.select().from(regionTable).orderBy(asc(regionTable.realm_name));

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
