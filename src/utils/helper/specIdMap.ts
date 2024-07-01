interface SpecInfo {
    name: string;
    class: string;
    spec: string;
}

// Define specIdMap with numeric keys
export const specIdMap: Record<number, SpecInfo> = {
    250: { name: 'blood_death_knight_cutoff', class: 'Death Knight', spec: 'Blood' },
    251: { name: 'frost_death_knight_cutoff', class: 'Death Knight', spec: 'Frost' },
    252: { name: 'unholy_death_knight_cutoff', class: 'Death Knight', spec: 'Unholy' },
  
    577: { name: 'havoc_demon_hunter_cutoff', class: 'Demon Hunter', spec: 'Havoc' },
    581: { name: 'vengeance_demon_hunter_cutoff', class: 'Demon Hunter', spec: 'Vengeance' },
  
    102: { name: 'balance_druid_cutoff', class: 'Druid', spec: 'Balance' },
    103: { name: 'feral_druid_cutoff', class: 'Druid', spec: 'Feral' },
    104: { name: 'guardian_druid_cutoff', class: 'Druid', spec: 'Guardian' },
    105: { name: 'restoration_druid_cutoff', class: 'Druid', spec: 'Restoration' },
  
    253: { name: 'beast_mastery_hunter_cutoff', class: 'Hunter', spec: 'Beast Mastery' },
    254: { name: 'marksmanship_hunter_cutoff', class: 'Hunter', spec: 'Marksmanship' },
    255: { name: 'survival_hunter_cutoff', class: 'Hunter', spec: 'Survival' },
  
    62: { name: 'arcane_mage_cutoff', class: 'Mage', spec: 'Arcane' },
    63: { name: 'fire_mage_cutoff', class: 'Mage', spec: 'Fire' },
    64: { name: 'frost_mage_cutoff', class: 'Mage', spec: 'Frost' },
  
    268: { name: 'brewmaster_monk_cutoff', class: 'Monk', spec: 'Brewmaster' },
    270: { name: 'mistweaver_monk_cutoff', class: 'Monk', spec: 'Mistweaver' },
    269: { name: 'windwalker_monk_cutoff', class: 'Monk', spec: 'Windwalker' },
  
    65: { name: 'holy_paladin_cutoff', class: 'Paladin', spec: 'Holy' },
    66: { name: 'protection_paladin_cutoff', class: 'Paladin', spec: 'Protection' },
    70: { name: 'retribution_paladin_cutoff', class: 'Paladin', spec: 'Retribution' },
  
    256: { name: 'discipline_priest_cutoff', class: 'Priest', spec: 'Discipline' },
    257: { name: 'holy_priest_cutoff', class: 'Priest', spec: 'Holy' },
    258: { name: 'shadow_priest_cutoff', class: 'Priest', spec: 'Shadow' },
  
    259: { name: 'assassination_rogue_cutoff', class: 'Rogue', spec: 'Assassination' },
    260: { name: 'outlaw_rogue_cutoff', class: 'Rogue', spec: 'Outlaw' },
    261: { name: 'subtlety_rogue_cutoff', class: 'Rogue', spec: 'Subtlety' },
  
    262: { name: 'elemental_shaman_cutoff', class: 'Shaman', spec: 'Elemental' },
    263: { name: 'enhancement_shaman_cutoff', class: 'Shaman', spec: 'Enhancement' },
    264: { name: 'restoration_shaman_cutoff', class: 'Shaman', spec: 'Restoration' },
  
    265: { name: 'affliction_warlock_cutoff', class: 'Warlock', spec: 'Affliction' },
    266: { name: 'demonology_warlock_cutoff', class: 'Warlock', spec: 'Demonology' },
    267: { name: 'destruction_warlock_cutoff', class: 'Warlock', spec: 'Destruction' },
  
    71: { name: 'arms_warrior_cutoff', class: 'Warrior', spec: 'Arms' },
    72: { name: 'fury_warrior_cutoff', class: 'Warrior', spec: 'Fury' },
    73: { name: 'protection_warrior_cutoff', class: 'Warrior', spec: 'Protection' },
  
    1467: { name: 'devastation_evoker_cutoff', class: 'Evoker', spec: 'Devastation' },
    1468: { name: 'preservation_evoker_cutoff', class: 'Evoker', spec: 'Preservation' },
    1473: { name: 'augmentation_evoker_cutoff', class: 'Evoker', spec: 'Augmentation' },
  };
