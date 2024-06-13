import { db } from '~/server/db';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { RatingsCutoff } from '~/server/db/schema';

export async function GET(req: NextRequest) {
  try {
    const response = await db.select().from(RatingsCutoff)
    const cutoffs = response[0]
    
    return NextResponse.json({ cutoffs });
  } catch (error) {
    console.error('Error executing query:', (error as Error).message);
    return NextResponse.json({ error: 'Error fetching ratings. Please try again later.' }, { status: 500 });
  }
}
