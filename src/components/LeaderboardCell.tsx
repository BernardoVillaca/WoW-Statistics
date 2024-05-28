import Image from 'next/image';
import specIconsMap from '~/helper/specIconsMap';
import horde from '~/assets/WoWFactions/horde.png';
import alliance from '~/assets/WoWFactions/alliance.png';

const classColors = {
  Death: "#C41E3A",
  Demon: "#A330C9",
  Druid: "#FF7C0A",
  Hunter: "#AAD372",
  Mage: "#3FC7EB",
  Monk: "#00FF98",
  Paladin: "#F48CBA",
  Priest: "#FFFFFF",
  Rogue: "#FFF468",
  Shaman: "#0070DD",
  Warlock: "#8788EE",
  Warrior: "#C69B6D"
};

const LeaderboardCell = ({ text, height, index, tab, characterClass }: { text: string, height: number, index: number, tab: string, characterClass: string }) => {
  // Find the corresponding image URL from the specIconsMap
  const specIcon = specIconsMap[text as keyof typeof specIconsMap];
  // Determine the faction icon based on the text
  const factionIcon = text === 'HORDE' ? horde : text === 'ALLIANCE' ? alliance : null;

  // Process the characterClass string
  const classParts = characterClass.split(' ');
  let baseClass = classParts.length > 2 ? classParts.slice(1, -1).join(' ') : classParts[1];
  baseClass = baseClass?.trim();
  
  // Get the color for the processed class
  const classColor = classColors[baseClass as keyof typeof classColors];

  return (
    <div className={`flex items-center justify-center h-[${height}px] w-full ${index === 0 ? '' : 'border-l-[1px]'}`}>
      {factionIcon ? (
        <Image src={factionIcon} alt={text} height={height / 1.5} className='rounded-lg overflow-none' />
      ) : specIcon ? (
        <Image src={specIcon} alt={text} height={height / 1.5} className='rounded-lg overflow-none' />
      ) : tab === 'character_name' ? (
        <span style={{ color: classColor }}>
          {text}
        </span>
      ) : (
        <span className='text-gray-300'>
          {text}
        </span>
      )}
    </div>
  );
};

export default LeaderboardCell;
