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

        console.log('Running update eu shuffle');
        await updateShuffle('eu')
        
        console.log('Finished updating eu shuffle');
        return NextResponse.json({ message: 'Finished updating eu shuffle' });
    } catch (error) {
        console.error('Error running scheduled tasks:', error);
        return NextResponse.json({ error: 'Error running scheduled tasks.' }, { status: 500 });
    }
}