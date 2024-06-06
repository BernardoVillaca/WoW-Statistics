// leaderboardMapping.ts

import { eu3v3Leaderboard, eu2v2Leaderboard, us3v3Leaderboard, us2v2Leaderboard, classicUs3v3Leaderboard, classicUs2v2Leaderboard, classicEu2v2Leaderboard, classicEu3v3Leaderboard } from '~/server/db/schema';

export type LeaderboardParams = {
    namespace: string;
    locale: string;
};

export type LeaderboardMapping = {
    table: any; // Replace `any` with the actual type if possible
    apiEndpoint: string;
    characterApiEndpoint: string;
    params: LeaderboardParams;
    profileParams: LeaderboardParams; // Added profileParams
};

export type BracketMapping = {
    '3v3': LeaderboardMapping;
    '2v2': LeaderboardMapping;
};

export type RegionMapping = {
    eu: BracketMapping;
    us: BracketMapping;
};

export type VersionMapping = {
    retail: RegionMapping;
    classic: RegionMapping;
};

export const versionRegionBracketMapping: VersionMapping = {
    retail: {
        eu: {
            '3v3': {
                table: eu3v3Leaderboard,
                apiEndpoint: 'https://eu.api.blizzard.com/data/wow/pvp-season/37/pvp-leaderboard/3v3',
                characterApiEndpoint: 'https://eu.api.blizzard.com/profile/wow/character/',
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
                apiEndpoint: 'https://eu.api.blizzard.com/data/wow/pvp-season/37/pvp-leaderboard/2v2',
                characterApiEndpoint: 'https://eu.api.blizzard.com/profile/wow/character/',
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
                apiEndpoint: 'https://us.api.blizzard.com/data/wow/pvp-season/37/pvp-leaderboard/3v3',
                characterApiEndpoint: 'https://us.api.blizzard.com/profile/wow/character/',
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
                apiEndpoint: 'https://us.api.blizzard.com/data/wow/pvp-season/37/pvp-leaderboard/2v2',
                characterApiEndpoint: 'https://us.api.blizzard.com/profile/wow/character/',
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
                apiEndpoint: 'https://eu.api.blizzard.com/data/wow/pvp-season/9/pvp-leaderboard/3v3',
                characterApiEndpoint: 'https://eu.api.blizzard.com/profile/wow/character/',
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
                apiEndpoint: 'https://eu.api.blizzard.com/data/wow/pvp-season/9/pvp-leaderboard/2v2',
                characterApiEndpoint: 'https://eu.api.blizzard.com/profile/wow/character/',
                params: {
                    namespace: 'dynamic-classic-eu',
                    locale: 'en_GB'
                },
                profileParams: {
                    namespace: 'profile-classic-eu',
                    locale: 'en_GB'
                }
            }
        },
        us: {
            '3v3': {
                table: classicUs3v3Leaderboard,
                apiEndpoint: 'https://us.api.blizzard.com/data/wow/pvp-season/9/pvp-leaderboard/3v3',
                characterApiEndpoint: 'https://us.api.blizzard.com/profile/wow/character/',
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
                apiEndpoint: 'https://us.api.blizzard.com/data/wow/pvp-season/9/pvp-leaderboard/2v2',
                characterApiEndpoint: 'https://us.api.blizzard.com/profile/wow/character/',
                params: {
                    namespace: 'dynamic-classic-us',
                    locale: 'en_US'
                },
                profileParams: {
                    namespace: 'profile-classic-us',
                    locale: 'en_US'
                }
            }
        }
    }
};
