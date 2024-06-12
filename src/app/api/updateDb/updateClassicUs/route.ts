import { NextRequest, NextResponse } from 'next/server';
import { updateLeaderboard } from '~/server/actions/updateLeaderboard';
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

        console.log('Running update  classic us tables tasks...');
        await updateLeaderboard('classic', 'us', '3v3');
        await updateLeaderboard('classic', 'us', '2v2');
        await updateLeaderboard('classic', 'us', 'rbg');
        
        console.log('Finished updating classic us tables tasks');
        return NextResponse.json({ message: 'Finished updating classic us tables tasks' });
    } catch (error) {
        console.error('Error running scheduled tasks:', error);
        return NextResponse.json({ error: 'Error running scheduled tasks.' }, { status: 500 });
    }
}