import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "~/server/actions/getAuthToken";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const version = (searchParams.get('version') ?? 'retail')
    const region = (searchParams.get('region') ?? 'us')
    const name = searchParams.get('name') ?? '';
    const realm = searchParams.get('realm') ?? '';
    const authToken = await getAuthToken(false);


    const getAchievementData = async () => {

        try {
            const response = await axios.get(`https://${region}.api.blizzard.com/profile/wow/character/${realm}/${name}/achievements`,
                {
                    params: {
                        namespace: `profile-${region}`,
                        locale: region === 'us' ? 'en_US' : 'en_GB',
                        access_token: authToken,
                    },
                }
            )

            const achievements = response.data.achievements;
            const rankOneTitles: typeof achievements[] = [];
            const gladiatorTitles: typeof achievements[] = [];
            const heroTitles: typeof achievements[] = [];
            const rankOneLegendTitles: typeof achievements[] = [];
            const legendTitles: typeof achievements[] = [];

            achievements.forEach((achiev: { achievement: { name: string; }; }) => {
                const name = achiev.achievement.name.toLowerCase();

                if (name.includes('legend:')) {
                    if (name.startsWith('legend')) return legendTitles.push(achiev);
                    return rankOneLegendTitles.push(achiev);
                }

                if (name.includes('hero of the alliance') || name.includes('hero of the horde')) return heroTitles.push(achiev);

                if (!name.includes('gladiator:')) return;

                if (name.startsWith('gladiator')) return gladiatorTitles.push(achiev)

                rankOneTitles.push(achiev);
            });
            return { rankOneTitles, gladiatorTitles, rankOneLegendTitles, legendTitles, heroTitles };

        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                console.log('Token expired, refreshing token and retrying the request...');
                await getAuthToken(true);
                return getAchievementData();
            } else {
                console.error('Error fetching profile data:', error);
                throw error;
            }
        }
    }

    try {
        const achievementData = await getAchievementData();
        return NextResponse.json(achievementData)

    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch profile data' }, { status: 500 });
    }

}
