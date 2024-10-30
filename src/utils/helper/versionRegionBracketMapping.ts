import {
    eu3v3Leaderboard, eu2v2Leaderboard, euRBGLeaderboard, euShuffleLeaderboard,
    us3v3Leaderboard, us2v2Leaderboard, usRBGLeaderboard, usShuffleLeaderboard,
    classicUs3v3Leaderboard, classicUs2v2Leaderboard, classicUsRBGLeaderboard,
    classicEu2v2Leaderboard, classicEu3v3Leaderboard, classicEuRBGLeaderboard
} from '~/server/db/schema';

export type LeaderboardParams = {
    namespace: string;
    locale: string;
};

type LeaderboardTable = typeof eu3v3Leaderboard | typeof eu2v2Leaderboard | typeof euRBGLeaderboard | typeof euShuffleLeaderboard |
    typeof us3v3Leaderboard | typeof us2v2Leaderboard | typeof usRBGLeaderboard | typeof usShuffleLeaderboard |
    typeof classicUs3v3Leaderboard | typeof classicUs2v2Leaderboard | typeof classicUsRBGLeaderboard |
    typeof classicEu2v2Leaderboard | typeof classicEu3v3Leaderboard | typeof classicEuRBGLeaderboard;

export type LeaderboardMapping = {
    table: LeaderboardTable;
    apiEndpoint: string;
    characterApiEndpoint: string;
    armoryEndpoint: string;
    params: LeaderboardParams;
    profileParams: LeaderboardParams;
};

export type BracketMapping = {
    '3v3': LeaderboardMapping;
    '2v2': LeaderboardMapping;
    'rbg': LeaderboardMapping;
    'shuffle': LeaderboardMapping | null;
};

export type RegionMapping = {
    eu: BracketMapping;
    us: BracketMapping;
};

export type VersionMapping = {
    retail: RegionMapping;
    classic: RegionMapping;
};


const CURRENT_RETAIL_SEASON = '38'

const CURRENT_CLASSIC_SEASON = '10'

export const versionRegionBracketMapping: VersionMapping = {
    retail: {
        eu: {
            '3v3': {
                table: eu3v3Leaderboard,
                apiEndpoint: `https://eu.api.blizzard.com/data/wow/pvp-season/${CURRENT_RETAIL_SEASON}/pvp-leaderboard/3v3`,
                characterApiEndpoint: 'https://eu.api.blizzard.com/profile/wow/character/',
                armoryEndpoint: 'https://worldofwarcraft.blizzard.com/en-gb/character/eu/',
                params: {
                    namespace: 'dynamic-eu',
                    locale: 'en_GB'
                },
                profileParams: {
                    namespace: 'profile-eu',
                    locale: 'en_GB'
                }
            },
            '2v2': {
                table: eu2v2Leaderboard,
                apiEndpoint: `https://eu.api.blizzard.com/data/wow/pvp-season/${CURRENT_RETAIL_SEASON}/pvp-leaderboard/2v2`,
                characterApiEndpoint: 'https://eu.api.blizzard.com/profile/wow/character/',
                armoryEndpoint: 'https://worldofwarcraft.blizzard.com/en-gb/character/eu/',
                params: {
                    namespace: 'dynamic-eu',
                    locale: 'en_GB'
                },
                profileParams: {
                    namespace: 'profile-eu',
                    locale: 'en_GB'
                }
            },
            'rbg': {
                table: euRBGLeaderboard,
                apiEndpoint: `https://eu.api.blizzard.com/data/wow/pvp-season/${CURRENT_RETAIL_SEASON}/pvp-leaderboard/rbg`,
                characterApiEndpoint: 'https://eu.api.blizzard.com/profile/wow/character/',
                armoryEndpoint: 'https://worldofwarcraft.blizzard.com/en-gb/character/eu/',
                params: {
                    namespace: 'dynamic-eu',
                    locale: 'en_GB'
                },
                profileParams: {
                    namespace: 'profile-eu',
                    locale: 'en_GB'
                }
            },
            'shuffle': {
                table: euShuffleLeaderboard,
                apiEndpoint: `https://eu.api.blizzard.com/data/wow/pvp-season/${CURRENT_RETAIL_SEASON}/pvp-leaderboard/shuffle`,
                characterApiEndpoint: 'https://eu.api.blizzard.com/profile/wow/character/',
                armoryEndpoint: 'https://worldofwarcraft.blizzard.com/en-gb/character/eu/',
                params: {
                    namespace: 'dynamic-eu',
                    locale: 'en_GB'
                },
                profileParams: {
                    namespace: 'profile-eu',
                    locale: 'en_GB'
                }
            }
        },
        us: {
            '3v3': {
                table: us3v3Leaderboard,
                apiEndpoint: `https://us.api.blizzard.com/data/wow/pvp-season/${CURRENT_RETAIL_SEASON}/pvp-leaderboard/3v3`,
                characterApiEndpoint: 'https://us.api.blizzard.com/profile/wow/character/',
                armoryEndpoint: 'https://worldofwarcraft.blizzard.com/en-us/character/us/',
                params: {
                    namespace: 'dynamic-us',
                    locale: 'en_US'
                },
                profileParams: {
                    namespace: 'profile-us',
                    locale: 'en_US'
                }
            },
            '2v2': {
                table: us2v2Leaderboard,
                apiEndpoint: `https://us.api.blizzard.com/data/wow/pvp-season/${CURRENT_RETAIL_SEASON}/pvp-leaderboard/2v2`,
                characterApiEndpoint: 'https://us.api.blizzard.com/profile/wow/character/',
                armoryEndpoint: 'https://worldofwarcraft.blizzard.com/en-us/character/us/',
                params: {
                    namespace: 'dynamic-us',
                    locale: 'en_US'
                },
                profileParams: {
                    namespace: 'profile-us',
                    locale: 'en_US'
                }
            },
            'rbg': {
                table: usRBGLeaderboard,
                apiEndpoint: `https://us.api.blizzard.com/data/wow/pvp-season/${CURRENT_RETAIL_SEASON}/pvp-leaderboard/rbg`,
                characterApiEndpoint: 'https://us.api.blizzard.com/profile/wow/character/',
                armoryEndpoint: 'https://worldofwarcraft.blizzard.com/en-us/character/us/',
                params: {
                    namespace: 'dynamic-us',
                    locale: 'en_US'
                },
                profileParams: {
                    namespace: 'profile-us',
                    locale: 'en_US'
                }
            },
            'shuffle': {
                table: usShuffleLeaderboard,
                apiEndpoint: `https://us.api.blizzard.com/data/wow/pvp-season/${CURRENT_RETAIL_SEASON}/pvp-leaderboard/shuffle`,
                characterApiEndpoint: 'https://us.api.blizzard.com/profile/wow/character/',
                armoryEndpoint: 'https://worldofwarcraft.blizzard.com/en-us/character/us/',
                params: {
                    namespace: 'dynamic-us',
                    locale: 'en_US'
                },
                profileParams: {
                    namespace: 'profile-us',
                    locale: 'en_US'
                }
            }
        }
    },
    classic: {
        eu: {
            '3v3': {
                table: classicEu3v3Leaderboard,
                apiEndpoint: `https://eu.api.blizzard.com/data/wow/pvp-season/${CURRENT_CLASSIC_SEASON}/pvp-leaderboard/3v3`,
                characterApiEndpoint: 'https://eu.api.blizzard.com/profile/wow/character/',
                armoryEndpoint: '',
                params: {
                    namespace: 'dynamic-classic-eu',
                    locale: 'en_GB'
                },
                profileParams: {
                    namespace: 'profile-classic-eu',
                    locale: 'en_GB'
                }
            },
            '2v2': {
                table: classicEu2v2Leaderboard,
                apiEndpoint: `https://eu.api.blizzard.com/data/wow/pvp-season/${CURRENT_CLASSIC_SEASON}/pvp-leaderboard/2v2`,
                characterApiEndpoint: 'https://eu.api.blizzard.com/profile/wow/character/',
                armoryEndpoint: '',
                params: {
                    namespace: 'dynamic-classic-eu',
                    locale: 'en_GB'
                },
                profileParams: {
                    namespace: 'profile-classic-eu',
                    locale: 'en_GB'
                }
            },
            'rbg': {
                table: classicEuRBGLeaderboard,
                apiEndpoint: `https://us.api.blizzard.com/data/wow/pvp-season/${CURRENT_CLASSIC_SEASON}/pvp-leaderboard/rbg`,
                characterApiEndpoint: 'https://us.api.blizzard.com/profile/wow/character/',
                armoryEndpoint: '',
                params: {
                    namespace: 'dynamic-classic-us',
                    locale: 'en_US'
                },
                profileParams: {
                    namespace: 'profile-classic-us',
                    locale: 'en_US'
                }
            },
            'shuffle': null
        },
        us: {
            '3v3': {
                table: classicUs3v3Leaderboard,
                apiEndpoint: `https://us.api.blizzard.com/data/wow/pvp-season/${CURRENT_CLASSIC_SEASON}/pvp-leaderboard/3v3`,
                characterApiEndpoint: 'https://us.api.blizzard.com/profile/wow/character/',
                armoryEndpoint: '',
                params: {
                    namespace: 'dynamic-classic-us',
                    locale: 'en_US'
                },
                profileParams: {
                    namespace: 'profile-classic-us',
                    locale: 'en_US'
                }
            },
            '2v2': {
                table: classicUs2v2Leaderboard,
                apiEndpoint: `https://us.api.blizzard.com/data/wow/pvp-season/${CURRENT_CLASSIC_SEASON}/pvp-leaderboard/2v2`,
                characterApiEndpoint: 'https://us.api.blizzard.com/profile/wow/character/',
                armoryEndpoint: '',
                params: {
                    namespace: 'dynamic-classic-us',
                    locale: 'en_US'
                },
                profileParams: {
                    namespace: 'profile-classic-us',
                    locale: 'en_US'
                }
            },
            'rbg': {
                table: classicUsRBGLeaderboard,
                apiEndpoint: `https://us.api.blizzard.com/data/wow/pvp-season/${CURRENT_CLASSIC_SEASON}/pvp-leaderboard/rbg`,
                characterApiEndpoint: 'https://us.api.blizzard.com/profile/wow/character/',
                armoryEndpoint: '',
                params: {
                    namespace: 'dynamic-classic-us',
                    locale: 'en_US'
                },
                profileParams: {
                    namespace: 'profile-classic-us',
                    locale: 'en_US'
                }
            },
            'shuffle': null
        }
    }
};
