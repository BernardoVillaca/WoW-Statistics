import { NextRequest, NextResponse } from 'next/server';
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
        console.log('Getting extra data for us players...');

        await getExtraDataForEachPlayer('retail', 'us', '3v3');
        await getExtraDataForEachPlayer('retail', 'us', '2v2');
        await getExtraDataForEachPlayer('retail', 'us', 'rbg');

        console.log('Finished getting extra data for us players.');
        return NextResponse.json({ message: 'Scheduled tasks completed.' });
    } catch (error) {
        console.error('Error running scheduled tasks:', error);
        return NextResponse.json({ error: 'Error running scheduled tasks.' }, { status: 500 });
    }
}