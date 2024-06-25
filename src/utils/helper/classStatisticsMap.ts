export interface ISpecStatistics {
    totalCount: number;
    countAbove2800: number;
    countAbove2600: number;
    countAbove2400: number;
    countAbove2200: number;
    countAbove2000: number;
    countAbove1800: number;
    countAbove1600: number;
}

export type ClassStatisticsMap = Record<string, Record<string, ISpecStatistics>>;

export const classStatisticsMap: ClassStatisticsMap = {
    'Warrior': {
        'Allspecs': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Arms': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Fury': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Protection': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 }
    },
    'Paladin': {
        'Allspecs': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Holy': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Protection': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Retribution': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 }
    },
    'Hunter': {
        'Allspecs': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Beast Mastery': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Marksmanship': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Survival': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 }
    },
    'Rogue': {
        'Allspecs': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Assassination': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Outlaw': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Subtlety': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 }
    },
    'Priest': {
        'Allspecs': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Discipline': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Holy': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Shadow': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 }
    },
    'Death Knight': {
        'Allspecs': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Blood': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Frost': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Unholy': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 }
    },
    'Shaman': {
        'Allspecs': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Elemental': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Enhancement': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Restoration': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 }
    },
    'Mage': {
        'Allspecs': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Arcane': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Fire': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Frost': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 }
    },
    'Monk': {
        'Allspecs': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Brewmaster': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Mistweaver': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Windwalker': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 }
    },
    'Demon Hunter': {
        'Allspecs': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Havoc': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Vengeance': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 }
    },
    'Druid': {
        'Allspecs': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Balance': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Feral': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Guardian': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Restoration': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 }
    },
    'Warlock': {
        'Allspecs': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Affliction': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Demonology': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Destruction': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 }
    },
    'Evoker': {
        'Allspecs': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Preservation': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Augmentation': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 },
        'Devastation': { totalCount: 0, countAbove2800: 0, countAbove2600: 0, countAbove2400: 0, countAbove2200: 0, countAbove2000: 0, countAbove1800: 0, countAbove1600: 0 }
    }
};
