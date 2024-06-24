import { db } from '~/server/db';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { activityStatistics } from '~/server/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
    try {
        const response = await db.select().from(activityStatistics).orderBy(desc(activityStatistics.id)).limit(1);
        const activivtyData = response[0]

        return NextResponse.json({ activivtyData });
    } catch (error) {
        console.error('Error executing query:', (error as Error).message);
        return NextResponse.json({ error: 'Error fetching ratings. Please try again later.' }, { status: 500 });
    }
}
