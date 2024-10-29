import { db } from '~/server/db';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { RatingsCutoff } from '~/server/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.nextUrl);
    const history = url.searchParams.get('history') === 'true';

    let response;
    if (history) {
      // Fetch the last 20 records if history is true
      response = await db
        .select()
        .from(RatingsCutoff)
        .orderBy(desc(RatingsCutoff.created_at))
        .limit(20);
      return NextResponse.json({ history: response });
    }
    // Fetch the latest record
    response = await db
      .select()
      .from(RatingsCutoff)
      .orderBy(desc(RatingsCutoff.created_at))
      .limit(1);
    return NextResponse.json({ cutoffs: response[0] });

  } catch (error) {
    console.error('Error executing query:', (error as Error).message);
    return NextResponse.json({ error: 'Error fetching ratings. Please try again later.' }, { status: 500 });
  }
}
