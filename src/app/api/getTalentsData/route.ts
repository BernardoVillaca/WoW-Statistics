

import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "~/server/actions/getAuthToken";
import { determineSpecWithMostPoints } from "~/utils/helper/determineSpecWithMostPoints";



export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const version = searchParams.get('version') ?? 'retail';
    const region = searchParams.get('region') ?? 'us';
    const name = searchParams.get('name') ?? '';
    const realm = searchParams.get('realm') ?? '';
    const charClass = searchParams.get('class') ?? '';
    const spec = searchParams.get('spec') ?? '';
    const authToken = await getAuthToken(false);

    const getTalentsData = async (token: string) => {

        try {
            const response = await axios.get(`https://${region}.api.blizzard.com/profile/wow/character/${realm}/${name}/specializations`,
                {
                    params: {
                        namespace: version === 'retail' ? `profile-${region}` : `profile-classic-${region}`,
                        locale: region === 'us' ? 'en_US' : 'en_GB',
                        access_token: token,
                    },
                }
            )

            const activeSpec =  version === 'retail' ? response.data.active_specialization: determineSpecWithMostPoints(response.data);
            const specs = version === 'retail' ? response.data.specializations : response.data.specialization_groups[0].specializations;
              
            
            return { activeSpec, specs };

        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                console.log('Token expired, refreshing token and retrying the request...');
                const newToken = await getAuthToken(true);
                return getTalentsData(newToken);
            } else {
                console.error('Error fetching profile data:', error);
                throw error;
            }
        }
    };

    try {
        const {activeSpec, specs} = await getTalentsData(authToken);
        return NextResponse.json({ activeSpec, specs });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch profile data' }, { status: 500 });
    }
}
