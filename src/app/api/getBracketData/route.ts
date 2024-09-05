import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "~/server/actions/getAuthToken";

type BracketData = {
    rating: number;
    season_match_statistics: {
        played: number;
        won: number;
        lost: number;
    };
    weekly_match_statistics: {
        played: number;
        won: number;
        lost: number;
    };
};

type Brackets = {
    [key: string]: BracketData;
};

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const version = searchParams.get('version') ?? 'retail';
    const region = searchParams.get('region') ?? 'us';
    const name = searchParams.get('name') ?? '';
    const realm = searchParams.get('realm') ?? '';
    const charClass = searchParams.get('class') ?? '';
    const spec = searchParams.get('spec') ?? '';
    const authToken = await getAuthToken(false);

    const getBracketData = async (token: string) => {
        const brackets = ['3v3', '2v2', 'rbg', `shuffle-${charClass}-${spec}`];
        const bracketsData: Brackets = {};

        try {
            if (version === 'retail') {
                const requests = brackets.map(bracket =>
                    axios.get(`https://${region}.api.blizzard.com/profile/wow/character/${realm}/${name}/pvp-bracket/${bracket}`,
                        {
                            params: {
                                namespace: `profile-${region}`,
                                locale: region === 'us' ? 'en_US' : 'en_GB',
                                access_token: token,
                            },
                        }).catch(error => {
                            console.error(`Error fetching data for bracket ${bracket}:`, error.message);
                            return {
                                bracket,
                                data: {
                                    rating: 0,
                                    season_match_statistics: {
                                        played: 0,
                                        won: 0,
                                        lost: 0,
                                    },
                                    weekly_match_statistics: {
                                        played: 0,
                                        won: 0,
                                        lost: 0,
                                    },
                                }
                            };
                        })
                );

                // Wait for all requests to complete
                const responses = await Promise.all(requests);

                // Process the responses
                responses.forEach((response, index) => {
                    const bracket = brackets[index] as string;
                    bracketsData[bracket] = {
                        rating: response.data.rating,
                        season_match_statistics: {
                            played: response.data.season_match_statistics.played,
                            won: response.data.season_match_statistics.won,
                            lost: response.data.season_match_statistics.lost,
                        },
                        weekly_match_statistics: {
                            played: response.data.weekly_match_statistics.played,
                            won: response.data.weekly_match_statistics.won,
                            lost: response.data.weekly_match_statistics.lost,
                        },
                    };
                });
                return bracketsData;
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                console.log('Token expired, refreshing token and retrying the request...');
                const newToken = await getAuthToken(true);
                return getBracketData(newToken);
            } else {
                console.error('Error fetching bracket data:', error);
                throw error;
            }
        }
    };

    try {
        const profileData = await getBracketData(authToken);

        return NextResponse.json(profileData);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch profile data' }, { status: 500 });
    }
}
