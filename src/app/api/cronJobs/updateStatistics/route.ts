import { NextRequest, NextResponse } from 'next/server';
import { updateActivityStatistics } from '~/server/actions/updateActivityStatistics';
import { updateClassSpecCount } from '~/server/actions/updateClassSpecCount';
import { updateLeaderboard } from '~/server/actions/updateLeaderboard';
import { updateRatingsCutoffs } from '~/server/actions/updateRatingsCutoffs';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
   // Verify the shared secret
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        console.log('Unauthorized request to retail update');
        return new Response('Unauthorized', {
            status: 401,
        });
    }

    try {
        console.log('Updating rating cutoffs.');
            await updateClassSpecCount();
            await updateRatingsCutoffs();
            await updateActivityStatistics();

        console.log('Finished updating rating cutoffs.');
        return NextResponse.json({ message: 'Finished updating rating cutoffs.' });
    } catch (error) {
        console.error('Error running scheduled tasks:', error);
        return NextResponse.json({ error: 'Error running scheduled tasks.' }, { status: 500 });
    }
}
