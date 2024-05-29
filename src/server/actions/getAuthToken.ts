import axios from "axios";
import { db } from '~/server/db';
import { authToken } from '~/server/db/schema';

// Refreshes the token and updates the database
const refreshToken = async () => {
    const clientId = process.env.BLIZZARD_ID;
    const clientSecret = process.env.BLIZZARD_SECRET;
    const response = await axios.post('https://us.battle.net/oauth/token', null, {
        params: {
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret,
        },
    });

    // Upsert the token into the database
    await db.update(authToken).set({
        access_token: response.data.access_token,
        token_type: response.data.token_type,
        expires_in: response.data.expires_in,
        updated_at: new Date()
    })
    return response.data.access_token;
}

// Fetches or refreshes the token based request being unauthorized
export const getAuthToken = async (tokenHasExpired: boolean) => {
    const tokenData = await db.query.authToken.findFirst();
    if (!tokenData || tokenHasExpired) {
        return refreshToken();
    }
    return tokenData.access_token;
};
