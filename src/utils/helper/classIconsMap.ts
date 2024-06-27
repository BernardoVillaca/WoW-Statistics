import deathKnight from '../../assets/Classes/DeathKnight/death_knight_class.jpg';
import demonHunter from '../../assets/Classes/DemonHunter/demon_hunter_class.jpg';
import druid from '../../assets/Classes/Druid/druid_class.jpg';
import hunter from '../../assets/Classes/Hunter/hunter_class.jpg';
import mage from '../../assets/Classes/Mage/mage_class.jpg';
import monk from '../../assets/Classes/Monk/monk_class.jpg';
import paladin from '../../assets/Classes/Paladin/paladin_class.jpg';
import priest from '../../assets/Classes/Priest/priest_class.jpg';
import rogue from '../../assets/Classes/Rogue/rogue_class.jpg';
import shaman from '../../assets/Classes/Shaman/shaman_class.jpg';
import warlock from '../../assets/Classes/Warlock/warlock_class.jpg';
import warrior from '../../assets/Classes/Warrior/warrior_class.jpg';
import evoker from '../../assets/Classes/Evoker/evoker_class.jpg';
import questionMark from '../../assets/Other/questionMark.jpg';

export const classColors: Record<string, string> = {
  'Death Knight': '#C41E3A',
  'Blood Death Knight': '#C41E3A',
  'Frost Death Knight': '#C41E3A',
  'Unholy Death Knight': '#C41E3A',

  'Demon Hunter': '#A330C9',
  'Havoc Demon Hunter': '#A330C9',
  'Vengeance Demon Hunter': '#A330C9',

  'Druid': '#FF7C0A',
  'Balance Druid': '#FF7C0A',
  'Feral Druid': '#FF7C0A',
  'Guardian Druid': '#FF7C0A',
  'Restoration Druid': '#FF7C0A',

  'Hunter': '#AAD372',
  'Beast Mastery Hunter': '#AAD372',
  'Marksmanship Hunter': '#AAD372',
  'Survival Hunter': '#AAD372',

  'Mage': '#3FC7EB',
  'Arcane Mage': '#3FC7EB',
  'Fire Mage': '#3FC7EB',
  'Frost Mage': '#3FC7EB',

  'Monk': '#00FF98',
  'Brewmaster Monk': '#00FF98',
  'Mistweaver Monk': '#00FF98',
  'Windwalker Monk': '#00FF98',

  'Paladin': '#F48CBA',
  'Holy Paladin': '#F48CBA',
  'Protection Paladin': '#F48CBA',
  'Retribution Paladin': '#F48CBA',

  'Priest': '#FFFFFF',
  'Discipline Priest': '#FFFFFF',
  'Holy Priest': '#FFFFFF',
  'Shadow Priest': '#FFFFFF',

  'Rogue': '#FFF468',
  'Assassination Rogue': '#FFF468',
  'Outlaw Rogue': '#FFF468',
  'Subtlety Rogue': '#FFF468',

  'Shaman': '#0070DD',
  'Elemental Shaman': '#0070DD',
  'Enhancement Shaman': '#0070DD',
  'Restoration Shaman': '#0070DD',

  'Warlock': '#8788EE',
  'Affliction Warlock': '#8788EE',
  'Demonology Warlock': '#8788EE',
  'Destruction Warlock': '#8788EE',

  'Warrior': '#C69B6D',
  'Arms Warrior': '#C69B6D',
  'Fury Warrior': '#C69B6D',
  'Protection Warrior': '#C69B6D',

  'Evoker': '#33937F',
  'Augmentation Evoker': '#33937F',
  'Preservation Evoker': '#33937F',

  'Arena 3v3': '#CD7F32',
  'Rbg Alliance': '#0057B7',
  'Rbg Horde': '#C41E3A',
  '': 'gray'
};

export const classIconsMap = {
  'Death Knight': deathKnight,
  'Demon Hunter': demonHunter,
  'Druid': druid,
  'Hunter': hunter,
  'Mage': mage,
  'Monk': monk,
  'Paladin': paladin,
  'Priest': priest,
  'Rogue': rogue,
  'Shaman': shaman,
  'Warlock': warlock,
  'Warrior': warrior,
  'Evoker': evoker,
  ' ': questionMark,
};


