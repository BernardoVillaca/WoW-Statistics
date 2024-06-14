import { NextRequest, NextResponse } from 'next/server';
import { updateLeaderboard } from '~/server/actions/updateLeaderboard';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    console.log('EU update endpoint hit');
    
    // Verify the shared secret
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        console.log('Unauthorized request to EU update');
        return new Response('Unauthorized', {
            status: 401,
        });
    }

    try {
        console.log('Running update EU tables tasks...');
        await updateLeaderboard('retail', 'eu', '3v3');
        await updateLeaderboard('retail', 'eu', '2v2');
        await updateLeaderboard('retail', 'eu', 'rbg');
        
        console.log('Finished updating EU tables tasks');
        return NextResponse.json({ message: 'Finished updating EU tables tasks' });
    } catch (error) {
        console.error('Error running scheduled tasks:', error);
        return NextResponse.json({ error: 'Error running scheduled tasks.' }, { status: 500 });
    }
}
