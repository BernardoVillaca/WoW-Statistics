import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { db } from "~/server/db";
import { wowStatistics } from "~/server/db/schema";
import { IClassStatisticsMap } from "~/utils/helper/classStatisticsMap";

export async function GET(req: NextRequest) {
  
    
    try {
        // Query the correct table for realms
        const response = await db.select().from(wowStatistics).where(eq(wowStatistics.id, 1));
        const stats = response[0]
        
       
        
        return NextResponse.json(stats);
    } catch (error) {
        console.error('Error fetching realms:', error);
        return NextResponse.json({ error: 'Failed to fetch realms' }, { status: 500 });
    }
}
