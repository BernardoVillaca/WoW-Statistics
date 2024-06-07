import axios from 'axios';
import { db } from '~/server/db';
import { getAuthToken } from '~/server/actions/getAuthToken';
import { and, eq } from 'drizzle-orm/expressions';
import {
    versionRegionBracketMapping,
    BracketMapping,
    RegionMapping,
    VersionMapping
} from '~/utils/helper/versionRegionBracketMapping';


export const updateLeaderboard = async (version: keyof VersionMapping, region: keyof RegionMapping, bracket: keyof BracketMapping): Promise<void> => {
    const versionMapping = versionRegionBracketMapping[version];
    if (!versionMapping) {
        throw new Error(`Invalid version: ${version}`);
    }
    const regionMapping = versionMapping[region];
    if (!regionMapping || !regionMapping[bracket]) {
        throw new Error(`Invalid region or bracket: ${region} ${bracket}`);
    }

    const { table, apiEndpoint, params } = regionMapping[bracket];
    let requests: Promise<any>[] = [];

    try {
        const authToken = await getAuthToken(false);
        const response = await axios.get(apiEndpoint, {
            params: {
                ...params,
                access_token: authToken
            }
        });

        if (response.data && response.data.entries) {
            const formattedData = response.data.entries.map((item: any) => ({
                character_name: item.character.name,
                character_id: item.character.id,
                realm_id: item.character.realm.id,
                realm_slug: item.character.realm.slug,
                faction_name: item.faction.type,
                rank: item.rank,
                rating: item.rating,
                played: item.season_match_statistics.played,
                won: item.season_match_statistics.won,
                lost: item.season_match_statistics.lost,
                tier_id: item.tier.id,
                tier_href: item.tier.key.href,
                created_at: new Date(),
                updated_at: new Date(),
                win_ratio: Math.round((item.season_match_statistics.won / item.season_match_statistics.played) * 100)
            }));

            console.log(`Updating leaderboard data for ${version} ${region} ${bracket}...`);

            for (let data of formattedData) {
                requests.push(handleDataInsert(data, table));

                if (requests.length >= 100) {
                    await Promise.all(requests);
                    requests.length = 0;
                }
            }

            if (requests.length > 0) {
                await Promise.all(requests);
            }

            console.log(`Leaderboard data updated successfully for ${version} ${region} ${bracket}!`);
        } else {
            console.log('No entries found in the response');
        }
    } catch (error: any) {
        console.log('Failed to fetch or insert leaderboard data:', error.message);
        if (error.response && error.response.status === 401) {
            console.log('Token expired, refreshing token and retrying the request...');
            await getAuthToken(true);
            return updateLeaderboard(version, region, bracket);
        }
    }
}

const handleDataInsert = async (data: any, table: any) => {
    const existingRecord = await db
        .select()
        .from(table)
        .where(eq(table.character_id, data.character_id))
        .limit(1);

    if (existingRecord.length === 0) return await db.insert(table).values(data);
    if (existingRecord[0]?.played !== data.played) {
        // console.log(`Updating record for ${data.character_name} with ${data.rating} from ${existingRecord[0]?.played} games played to ${data.played} games played`);
        await db.update(table).set({
            character_name: data.character_name,
            character_class: data.character_class,
            character_spec: data.character_spec,
            realm_id: data.realm_id,
            realm_slug: data.realm_slug,
            faction_name: data.faction_name,
            rank: data.rank,
            rating: data.rating,
            played: data.played,
            won: data.won,
            lost: data.lost,
            tier_id: data.tier_id,
            tier_href: data.tier_href,
            updated_at: new Date()
        }).where(eq(table.character_id, data.character_id));
    }
}
