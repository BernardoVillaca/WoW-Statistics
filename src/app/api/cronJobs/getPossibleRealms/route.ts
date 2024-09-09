import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getPossibleRealms } from '~/server/actions/getPossibleRealms';
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

        console.log('Getting possible realms and entry count');
        await getPossibleRealms();

        console.log('Finished getting possible realms and entry count');
        return NextResponse.json({ message: 'Finished getting possible realms and entry count' });
    } catch (error) {
        console.error('Error running scheduled tasks:', error);
        return NextResponse.json({ error: 'Error running scheduled tasks.' }, { status: 500 });
    }
}