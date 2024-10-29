import axios from "axios";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuthToken } from "~/server/actions/getAuthToken";

interface Achievement {
    achievement: {
        name: string;
    };
}

interface AchievementsResponse {
    achievements: Achievement[];
}


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const version = (searchParams.get('version') ?? 'retail')
    const region = (searchParams.get('region') ?? 'us')
    const name = searchParams.get('name') ?? '';
    const realm = searchParams.get('realm') ?? '';
    const authToken = await getAuthToken(false);


    const getAchievementData = async (token: string) => {

        try {
            const response = await axios.get<AchievementsResponse>(`https://${region}.api.blizzard.com/profile/wow/character/${realm}/${name}/achievements`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        namespace: version === 'retail' ? `profile-${region}` : `profile-classic-${region}`,
                        locale: region === 'us' ? 'en_US' : 'en_GB',                       
                    },
                }
            )

            const achievements = response.data.achievements;
            let rankOneTitles: Achievement[] = [];
            const gladiatorTitles: Achievement[] = [];
            let heroTitles: Achievement[] = [];
            const rankOneLegendTitles: Achievement[] = [];
            const legendTitles: Achievement[] = [];
            
            achievements.forEach((item: { achievement: { name: string; }; }) => {
                const name = item.achievement.name.toLowerCase();

                if (version === 'retail') {
                    // Retail filtering
                    if (name.includes('legend:')) {
                        if (name.startsWith('legend')) return legendTitles.push(item);
                        return rankOneLegendTitles.push(item);
                    }
                    if (name.includes('hero of the alliance') || name.includes('hero of the horde')) return heroTitles.push(item);

                    if (!name.includes('gladiator:')) return;

                    if (name.startsWith('gladiator')) return gladiatorTitles.push(item);

                    rankOneTitles.push(item);
                } else {
                    // Classic filtering
                    if (name.includes('vengeful nether drake')
                        || name.includes('merciless nether drake')
                        || name.includes('brutal nether drake')
                        || name.includes('swift nether drake')) return gladiatorTitles.push(item);

                    if (!name.includes('gladiator')) return;

                    if (name.includes('frost wyrm')) return gladiatorTitles.push(item);

                    if (name.includes('hero of the alliance') || name.includes('hero of the horde')) return heroTitles.push(item)

                    rankOneTitles.push(item);

                }
            });
            // filter the baseline achievements
            rankOneTitles = rankOneTitles.filter((item) => item.achievement.name.toLowerCase() !== 'gladiator');
            heroTitles = heroTitles.filter((item) => item.achievement.name.toLowerCase() !== 'hero of the alliance' && item.achievement.name.toLowerCase() !== 'hero of the horde');
            
            if (version === 'classic') return ({ rankOneTitles, gladiatorTitles, heroTitles });
            return { rankOneTitles, gladiatorTitles, rankOneLegendTitles, legendTitles, heroTitles };


        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                console.log('Token expired, refreshing token and retrying the request...');
                const newToken = await getAuthToken(true);
                return getAchievementData(newToken);
            } else {
                console.error('Error fetching profile data:', error);
                throw error;
            }
        }
    }

    try {
        const achievementData = await getAchievementData(authToken);
        return NextResponse.json(achievementData)

    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch profile data' }, { status: 500 });
    }

}
