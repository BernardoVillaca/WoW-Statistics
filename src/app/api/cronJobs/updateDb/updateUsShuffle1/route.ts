import { NextRequest, NextResponse } from 'next/server';
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

        console.log('Running update us shuffle first part');
        await updateShuffle('us', 1)
        
        console.log('Finished updating us shuffle first part');
        return NextResponse.json({ message: 'Finished updating us shuffle first part' });
    } catch (error) {
        console.error('Error running scheduled tasks:', error);
        return NextResponse.json({ error: 'Error running scheduled tasks.' }, { status: 500 });
    }
}