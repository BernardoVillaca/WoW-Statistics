import { asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { usRealms } from "~/server/db/schema";

export async function GET(req: NextRequest) {
    try {
        const realmList = await db.query.usRealms.findMany({
            orderBy: [asc(usRealms.realm_name)]
        });

        return NextResponse.json({ realmList });
    } catch (error) {
        console.error('Error fetching realms:', error);
        return NextResponse.json({ error: 'Failed to fetch realms' }, { status: 500 });
    }
}
