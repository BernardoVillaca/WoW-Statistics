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

    try {
        const response = await axios.get(`https://${region}.api.blizzard.com/profile/wow/character/${realm}/${name.toLowerCase()}/achievements`,
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
                if(name.startsWith('legend')) return legendTitles.push(achiev);
                return rankOneLegendTitles.push(achiev);
            }

            if (name.includes('hero of the alliance') || name.includes('hero of the horde')) return heroTitles.push(achiev);

            if (!name.includes('gladiator:')) return;

            if (name.startsWith('gladiator')) return gladiatorTitles.push(achiev)

            rankOneTitles.push(achiev);
        });

        

        return NextResponse.json({ rankOneTitles, gladiatorTitles, rankOneLegendTitles, legendTitles, heroTitles });

    } catch (error) {
        console.log(error)
    }


}
