import { NextRequest, NextResponse } from 'next/server';
import { getExtraDataForEachPlayer } from '~/server/actions/getExtraDataForEachPlayer';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(req: NextRequest) {
    // Verify the shared secret
    const providedSecret = req.headers.get('scheduled-task-secret');
    if (!providedSecret || providedSecret !== CRON_SECRET) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        console.log('Getting extra data for eu classic players...');

        await getExtraDataForEachPlayer('classic', 'eu', '3v3');
        await getExtraDataForEachPlayer('classic', 'eu', '2v2');
        await getExtraDataForEachPlayer('classic', 'eu', 'rbg');

        console.log('Finished getting extra data for eu classic players.');
        return NextResponse.json({ message: 'Scheduled tasks completed.' });
    } catch (error) {
        console.error('Error running scheduled tasks:', error);
        return NextResponse.json({ error: 'Error running scheduled tasks.' }, { status: 500 });
    }
}