import { db } from '~/server/db';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { RatingsCutoff } from '~/server/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const history = searchParams.get('history') === 'true';

  try {
    // Only parse URL when needed to avoid static rendering issues

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

    // Fetch the latest record if history is false
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
