import schedule from 'node-schedule';
import { updateLeaderboard } from '../actions/updateLeaderboard';
import { getExtraDataForEachPlayer } from '../actions/getExtraDataForEachPlayer';
import { getPossibleRealms } from '../actions/getPossibleRealms';
import './scheduler'
console.log('Scheduler initialized.');

// Schedule tasks to run every 30 seconds for testing
schedule.scheduleJob('0 */2 * * *', async () => {
    try {
        console.log('Running scheduled tasks...');

        await updateLeaderboard('retail', 'us', '3v3');
        await updateLeaderboard('retail', 'us', '2v2');
        await updateLeaderboard('retail', 'us', 'rbg');

        await updateLeaderboard('retail', 'eu', '3v3');
        await updateLeaderboard('retail', 'eu', '2v2');
        await updateLeaderboard('retail', 'eu', 'rbg');

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

        await getPossibleRealms();

        console.log('Scheduled tasks completed.');
    } catch (error) {
        console.error('Error running scheduled tasks:', error);
    }
});
