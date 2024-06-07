import axios from 'axios';
import { load } from 'cheerio';

export const scrapPlayerArmory = async (characterName: string, realmSlug: string, armoryEndpoint: string) => {
    const url = `${armoryEndpoint}${realmSlug}/${characterName}`;
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = load(data);

        // Locate the specific script tag that contains the JSON data
        const scriptTag = $('#character-profile-mount').attr('data-initial-state-variable-name');
        const jsonData = $(`script:contains(${scriptTag})`).html();

        // Extract the JSON data from the script tag
        const jsonStringMatch = jsonData && jsonData.match(/({.*})/);

        if (jsonStringMatch && jsonStringMatch[0]) {
            const jsonString = jsonStringMatch[0];
            const characterData = JSON.parse(jsonString);
             
            // Correctly access the class and spec information
            const characterSpec: string = characterData.character.spec && characterData.character.spec.name;
            const characterClass: string = characterData.character.class && characterData.character.class.name;

            console.log('Character Spec:', characterSpec);
            console.log('Character Class:', characterClass);

            return {
                characterClass,
                characterSpec
            };
        } else {
            throw new Error('Unable to locate character data in the script tag.');
        }
    } catch (error: any) {
        console.error(`Failed to retrieve data for ${characterName} on realm ${realmSlug}:`, error.message);
        return null;
    }
};


