export interface ActivityStatistics  {
    total24h: number;
    total48h: number;
    total72h: number;

    mostActivePlayers24h: Record<string, PlayerActivity>;
    mostActivePlayers48h: Record<string, PlayerActivity>;
    mostActivePlayers72h: Record<string, PlayerActivity>;

    mostActiveSpecs24h: Record<string, SpecActivity>;
    mostActiveSpecs48h: Record<string, SpecActivity>;
    mostActiveSpecs72h: Record<string, SpecActivity>;
    ratingsCount?: RatingsCount;
    
}

export type RatingsCount = {
    above2600: number;
    above2500: number;
    above2400: number;
    above2300: number;
    above2200: number;
    above2100: number;
    above2000: number;
}
    
export type PlayerActivity = {
    played: number;
    won: number;
    lost: number;
    rating: number;
    rank: number;
    character_name: string;
    character_spec: string;
    character_class: string;
    realm_slug: string;
};

export type SpecActivity = {
    played: number;
    character_spec: string;
    character_class: string;
};

export type ActivityMap = Record<string, ActivityStatistics>;

const createActivityData = (): ActivityStatistics => ({
    total24h: 0,
    total48h: 0,
    total72h: 0,

    mostActivePlayers24h: {},
    mostActivePlayers48h: {},
    mostActivePlayers72h: {},

    mostActiveSpecs24h: {},
    mostActiveSpecs48h: {},
    mostActiveSpecs72h: {},

   });

export const activityMap: ActivityMap = {
    retail_us_3v3: createActivityData(),
    retail_us_2v2: createActivityData(),
    retail_us_rbg: createActivityData(),
    retail_us_shuffle: createActivityData(),

    retail_eu_3v3: createActivityData(),
    retail_eu_2v2: createActivityData(),
    retail_eu_rbg: createActivityData(),
    retail_eu_shuffle: createActivityData(),

    classic_us_3v3: createActivityData(),
    classic_us_2v2: createActivityData(),
    classic_us_rbg: createActivityData(),
    
    classic_eu_3v3: createActivityData(),
    classic_eu_2v2: createActivityData(),
    classic_eu_rbg: createActivityData(),
};
