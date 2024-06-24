export type ActivityData = {
    total24h: number;
    total48h: number;
    total72h: number;

    total24h2200plus: number;
    total48h2200plus: number;
    total72h2200plus: number;

    total24h2400plus: number;
    total48h2400plus: number;
    total72h2400plus: number;

    mostActivePlayers24h: Record<string, PlayerActivity>;
    mostActivePlayers48h: Record<string, PlayerActivity>;
    mostActivePlayers72h: Record<string, PlayerActivity>;

    mostActiveSpecs24h: Record<string, SpecActivity>;
    mostActiveSpecs48h: Record<string, SpecActivity>;
    mostActiveSpecs72h: Record<string, SpecActivity>;

    mostActiveSpecs24h2200plus: Record<string, SpecActivity>;
    mostActiveSpecs48h2200plus: Record<string, SpecActivity>;
    mostActiveSpecs72h2200plus: Record<string, SpecActivity>;

    mostActiveSpecs24h2400plus: Record<string, SpecActivity>;
    mostActiveSpecs48h2400plus: Record<string, SpecActivity>;
    mostActiveSpecs72h2400plus: Record<string, SpecActivity>;
};

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

export type ActivityMap = Record<string, ActivityData>;

const createActivityData = (): ActivityData => ({
    total24h: 0,
    total48h: 0,
    total72h: 0,

    total24h2200plus: 0,
    total48h2200plus: 0,
    total72h2200plus: 0,

    total24h2400plus: 0,
    total48h2400plus: 0,
    total72h2400plus: 0,

    mostActivePlayers24h: {},
    mostActivePlayers48h: {},
    mostActivePlayers72h: {},

    mostActiveSpecs24h: {},
    mostActiveSpecs48h: {},
    mostActiveSpecs72h: {},

    mostActiveSpecs24h2200plus: {},
    mostActiveSpecs48h2200plus: {},
    mostActiveSpecs72h2200plus: {},

    mostActiveSpecs24h2400plus: {},
    mostActiveSpecs48h2400plus: {},
    mostActiveSpecs72h2400plus: {}
});

export const activityMap: ActivityMap = {
    retail_us_3v3: createActivityData(),
    retail_us_2v2: createActivityData(),
    retail_us_rbg: createActivityData(),
    retail_eu_3v3: createActivityData(),
    retail_eu_2v2: createActivityData(),
    retail_eu_rbg: createActivityData(),
    classic_us_3v3: createActivityData(),
    classic_us_2v2: createActivityData(),
    classic_us_rbg: createActivityData(),
    classic_eu_3v3: createActivityData(),
    classic_eu_2v2: createActivityData(),
    classic_eu_rbg: createActivityData(),
};
