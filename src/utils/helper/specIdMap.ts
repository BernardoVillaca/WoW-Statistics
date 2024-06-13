interface SpecInfo {
    name: string;
    class: string;
    spec: string;
}

// Define specIdMap with numeric keys
export const specIdMap: { [key: number]: SpecInfo } = {
    250: { name: 'death_knight_blood_cutoff', class: 'Death Knight', spec: 'Blood' },
    251: { name: 'death_knight_frost_cutoff', class: 'Death Knight', spec: 'Frost' },
    252: { name: 'death_knight_unholy_cutoff', class: 'Death Knight', spec: 'Unholy' },

    577: { name: 'demon_hunter_havoc_cutoff', class: 'Demon Hunter', spec: 'Havoc' },
    581: { name: 'demon_hunter_vengeance_cutoff', class: 'Demon Hunter', spec: 'Vengeance' },

    102: { name: 'druid_balance_cutoff', class: 'Druid', spec: 'Balance' },
    103: { name: 'druid_feral_cutoff', class: 'Druid', spec: 'Feral' },
    104: { name: 'druid_guardian_cutoff', class: 'Druid', spec: 'Guardian' },
    105: { name: 'druid_restoration_cutoff', class: 'Druid', spec: 'Restoration' },

    253: { name: 'hunter_beast_mastery_cutoff', class: 'Hunter', spec: 'Beast Mastery' },
    254: { name: 'hunter_marksmanship_cutoff', class: 'Hunter', spec: 'Marksmanship' },
    255: { name: 'hunter_survival_cutoff', class: 'Hunter', spec: 'Survival' },

    62: { name: 'mage_arcane_cutoff', class: 'Mage', spec: 'Arcane' },
    63: { name: 'mage_fire_cutoff', class: 'Mage', spec: 'Fire' },
    64: { name: 'mage_frost_cutoff', class: 'Mage', spec: 'Frost' },

    268: { name: 'monk_brewmaster_cutoff', class: 'Monk', spec: 'Brewmaster' },
    270: { name: 'monk_mistweaver_cutoff', class: 'Monk', spec: 'Mistweaver' },
    269: { name: 'monk_windwalker_cutoff', class: 'Monk', spec: 'Windwalker' },

    65: { name: 'paladin_holy_cutoff', class: 'Paladin', spec: 'Holy' },
    66: { name: 'paladin_protection_cutoff', class: 'Paladin', spec: 'Protection' },
    70: { name: 'paladin_retribution_cutoff', class: 'Paladin', spec: 'Retribution' },

    256: { name: 'priest_discipline_cutoff', class: 'Priest', spec: 'Discipline' },
    257: { name: 'priest_holy_cutoff', class: 'Priest', spec: 'Holy' },
    258: { name: 'priest_shadow_cutoff', class: 'Priest', spec: 'Shadow' },

    259: { name: 'rogue_assassination_cutoff', class: 'Rogue', spec: 'Assassination' },
    260: { name: 'rogue_outlaw_cutoff', class: 'Rogue', spec: 'Outlaw' },
    261: { name: 'rogue_subtlety_cutoff', class: 'Rogue', spec: 'Subtlety' },

    262: { name: 'shaman_elemental_cutoff', class: 'Shaman', spec: 'Elemental' },
    263: { name: 'shaman_enhancement_cutoff', class: 'Shaman', spec: 'Enhancement' },
    264: { name: 'shaman_restoration_cutoff', class: 'Shaman', spec: 'Restoration' },

    265: { name: 'warlock_affliction_cutoff', class: 'Warlock', spec: 'Affliction' },
    266: { name: 'warlock_demonology_cutoff', class: 'Warlock', spec: 'Demonology' },
    267: { name: 'warlock_destruction_cutoff', class: 'Warlock', spec: 'Destruction' },

    71: { name: 'warrior_arms_cutoff', class: 'Warrior', spec: 'Arms' },
    72: { name: 'warrior_fury_cutoff', class: 'Warrior', spec: 'Fury' },
    73: { name: 'warrior_protection_cutoff', class: 'Warrior', spec: 'Protection' },

    1467: { name: 'evoker_preservation_cutoff', class: 'Evoker', spec: 'Preservation' },
    1473: { name: 'evoker_augmentation_cutoff', class: 'Evoker', spec: 'Augmentation' },
    1477: { name: 'evoker_devastation_cutoff', class: 'Evoker', spec: 'Devastation' },
};
