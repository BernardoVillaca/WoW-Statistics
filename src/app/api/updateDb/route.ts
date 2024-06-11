import { VercelRequest, VercelResponse } from '@vercel/node';
import { getExtraDataForEachPlayer } from '~/server/actions/getExtraDataForEachPlayer';
import { updateLeaderboard } from '~/server/actions/updateLeaderboard';
import { updateShuffle } from '~/server/actions/updateShuffle';


export default async (req: VercelRequest, res: VercelResponse) => {
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

        await getExtraDataForEachPlayer('retail', 'us', '3v3');
        await getExtraDataForEachPlayer('retail', 'us', '2v2');
        await getExtraDataForEachPlayer('retail', 'us', 'rbg');

        await getExtraDataForEachPlayer('retail', 'eu', '3v3');
        await getExtraDataForEachPlayer('retail', 'eu', '2v2');
        await getExtraDataForEachPlayer('retail', 'eu', 'rbg');

        await getExtraDataForEachPlayer('classic', 'us', '3v3');
        await getExtraDataForEachPlayer('classic', 'us', '2v2');
        await getExtraDataForEachPlayer('classic', 'us', 'rbg');

        await getExtraDataForEachPlayer('classic', 'eu', '3v3');
        await getExtraDataForEachPlayer('classic', 'eu', '2v2');
        await getExtraDataForEachPlayer('classic', 'eu', 'rbg');


        console.log('Scheduled tasks completed.');
        res.status(200).json({ message: 'Scheduled tasks completed.' });
    } catch (error) {
        console.error('Error running scheduled tasks:', error);
        res.status(500).json({ error: 'Error running scheduled tasks.' });
    }
};
