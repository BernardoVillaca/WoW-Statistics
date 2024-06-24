import {
    classicEu2v2Leaderboard, classicEu3v3Leaderboard, classicEuRBGLeaderboard,
    classicUs2v2Leaderboard, classicUs3v3Leaderboard, classicUsRBGLeaderboard,
    eu2v2Leaderboard, eu3v3Leaderboard, euRBGLeaderboard,
    us2v2Leaderboard, us3v3Leaderboard, usRBGLeaderboard
} from '../../server/db/schema';

export interface ILeaderboardTable {
    version: 'classic' | 'retail';
    column: string;
    table: typeof classicEu2v2Leaderboard | typeof classicEu3v3Leaderboard | typeof classicEuRBGLeaderboard
    | typeof classicUs2v2Leaderboard | typeof classicUs3v3Leaderboard | typeof classicUsRBGLeaderboard
    | typeof eu2v2Leaderboard | typeof eu3v3Leaderboard | typeof euRBGLeaderboard
    | typeof us2v2Leaderboard | typeof us3v3Leaderboard | typeof usRBGLeaderboard;
}

export type ILeaderboardTablesMap = Record<string, ILeaderboardTable>;

export const leaderboardTablesMap: ILeaderboardTablesMap = {
    retailUs3v3: { version: 'retail', column: 'retail_us_3v3', table: us3v3Leaderboard },
    retailUs2v2: { version: 'retail', column: 'retail_us_2v2', table: us2v2Leaderboard },
    retailUsRBG: { version: 'retail', column: 'retail_us_rbg', table: usRBGLeaderboard },

    retailEu3v3: { version: 'retail', column: 'retail_eu_3v3', table: eu3v3Leaderboard },
    retailEu2v2: { version: 'retail', column: 'retail_eu_2v2', table: eu2v2Leaderboard },
    retailEuRBG: { version: 'retail', column: 'retail_eu_rbg', table: euRBGLeaderboard },

    classicUs3v3: { version: 'classic', column: 'classic_us_3v3', table: classicUs3v3Leaderboard },
    classicUs2v2: { version: 'classic', column: 'classic_us_2v2', table: classicUs2v2Leaderboard },
    classicUsRBG: { version: 'classic', column: 'classic_us_rbg', table: classicUsRBGLeaderboard },

    classicEu3v3: { version: 'classic', column: 'classic_eu_3v3', table: classicEu3v3Leaderboard },
    classicEu2v2: { version: 'classic', column: 'classic_eu_2v2', table: classicEu2v2Leaderboard },
    classicEuRBG: { version: 'classic', column: 'classic_eu_rbg', table: classicEuRBGLeaderboard }
}

