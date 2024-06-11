import { NextRequest, NextResponse } from 'next/server';
import { getExtraDataForEachPlayer } from '~/server/actions/getExtraDataForEachPlayer';
import { updateLeaderboard } from '~/server/actions/updateLeaderboard';
import { updateShuffle } from '~/server/actions/updateShuffle';
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

        console.log('Running scheduled tasks...');
        await updateLeaderboard('retail', 'us', '3v3');
        await updateLeaderboard('retail', 'us', '2v2');
        await updateLeaderboard('retail', 'us', 'rbg');
        await updateShuffle('us');

        await updateLeaderboard('retail', 'eu', '3v3');
        await updateLeaderboard('retail', 'eu', '2v2');
        await updateLeaderboard('retail', 'eu', 'rbg');
        await updateShuffle('eu');

        await updateLeaderboard('classic', 'us', '3v3');
        await updateLeaderboard('classic', 'us', '2v2');
        await updateLeaderboard('classic', 'us', 'rbg');
        
        await updateLeaderboard('classic', 'eu', '3v3');
        await updateLeaderboard('classic', 'eu', '2v2');
        await updateLeaderboard('classic', 'eu', 'rbg');

        console.log('Scheduled tasks completed.');
        return NextResponse.json({ message: 'Scheduled tasks completed.' });
    } catch (error) {
        console.error('Error running scheduled tasks:', error);
        return NextResponse.json({ error: 'Error running scheduled tasks.' }, { status: 500 });
    }
}