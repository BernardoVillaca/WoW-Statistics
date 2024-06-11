import axios from 'axios';
import { load } from 'cheerio';

interface CharacterSpec {
    name: string;
}

interface CharacterClass {
    name: string;
}

interface CharacterData {
    character: {
        spec?: CharacterSpec;
        class?: CharacterClass;
    };
}

export const scrapPlayerArmory = async (characterName: string, realmSlug: string, armoryEndpoint: string) => {
    const url = `${armoryEndpoint}${realmSlug}/${characterName}`;
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const { data } = response;

        const $ = load(data);

        // Locate the specific script tag that contains the JSON data
        const scriptTag = $('#character-profile-mount').attr('data-initial-state-variable-name');
        const jsonData = scriptTag ? $(`script:contains(${scriptTag})`).html() : null;

        // Extract the JSON data from the script tag
        const jsonStringMatch = jsonData?.match(/({.*})/);

        if (jsonStringMatch && jsonStringMatch[0]) {
            const jsonString = jsonStringMatch[0];
            const characterData: CharacterData = JSON.parse(jsonString);

            const characterSpec = characterData.character?.spec?.name ?? '';
            const characterClass = characterData.character?.class?.name ?? '';

            return {
                characterClass,
                characterSpec
            };
        } else {
            throw new Error('Unable to locate character data in the script tag.');
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error(`Failed to retrieve data for ${characterName} on realm ${realmSlug}:`, error.message);
        } else {
            console.error(`Failed to retrieve data for ${characterName} on realm ${realmSlug}:`, (error as Error).message);
        }
        return null;
    }
};
