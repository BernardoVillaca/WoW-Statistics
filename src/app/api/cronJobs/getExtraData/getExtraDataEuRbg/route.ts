import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getExtraDataForEachPlayer } from '~/server/actions/getExtraDataForEachPlayer';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    // Verify the shared secret
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }

    try {
        console.log('Get extra data for eu rbg');

        await getExtraDataForEachPlayer('retail', 'eu', 'rbg');
     
        console.log('Fished getting extra data for eu 2v2.');
        return NextResponse.json({ message: 'Scheduled tasks rbg.' });
    } catch (error) {
        console.error('Error running scheduled tasks:', error);
        return NextResponse.json({ error: 'Error running scheduled tasks.' }, { status: 500 });
    }

}