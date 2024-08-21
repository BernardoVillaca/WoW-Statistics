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

        console.log(response.data)
    } catch (error) {
        console.log(error)


    }

    return NextResponse.json('asdasdas');
}
