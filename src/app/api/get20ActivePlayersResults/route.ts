import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { eq, and, desc, count } from 'drizzle-orm';
import { currentActivePlayers } from '~/server/db/schema';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const limit = 10;
    const version = (searchParams.get('version') ?? 'retail')
    const region = (searchParams.get('region') ?? 'us')
    const bracket = (searchParams.get('bracket') ?? '3v3')
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const offset = (page - 1) * limit;
    try {
        const conditions = (and(
            eq(currentActivePlayers.version, version),
            eq(currentActivePlayers.region, region),
            eq(currentActivePlayers.bracket, bracket)))
        const [activePlayers, totalResult] = await Promise.all([
            await db.select().from(currentActivePlayers).where(conditions).limit(limit).offset(offset).orderBy(desc(currentActivePlayers.rating)),
            db.select({ count: count() }).from(currentActivePlayers).where(conditions)
        ]);

        const total = totalResult[0]?.count ?? 0;

        return NextResponse.json({ activePlayers, total });
    } catch (error) {
        console.error('Error executing query:', (error as Error).message);
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}
