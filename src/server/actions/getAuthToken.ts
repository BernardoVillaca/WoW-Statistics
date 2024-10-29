import axios from "axios";
import { eq } from "drizzle-orm";
import { db } from '~/server/db';
import { authToken } from '~/server/db/schema';

interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export const getAuthToken = async (tokenHasExpired: boolean): Promise<string> => {
    console.log('Getting new token')
    const tokenData = await db.query.authToken.findFirst();
    if (!tokenData || tokenHasExpired) {
        return refreshToken();
    }
    return tokenData.access_token;
};


// Refreshes the token and updates the database
const refreshToken = async (): Promise<string> => {
    const clientId = process.env.BLIZZARD_ID;
    const clientSecret = process.env.BLIZZARD_SECRET;
    const response = await axios.post<TokenResponse>('https://oauth.battle.net/token', null, {
        params: {
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret,
        },
    });
    console.log(response)
    const { access_token, token_type, expires_in } = response.data;

    // Upsert the token into the database
    await db.update(authToken).set({
        access_token,
        token_type,
        expires_in,
        updated_at: new Date()
    }).where(eq(authToken.id, 1));

    return access_token;
}
