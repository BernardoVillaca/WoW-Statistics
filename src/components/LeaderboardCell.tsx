import Image from 'next/image';
import specIconsMap from '~/helper/specIconsMap';
import horde from '~/assets/WoWFactions/horde.png';
import alliance from '~/assets/WoWFactions/alliance.png';

const classColors = {
  'Death Knight': "#C41E3A",
  'Demon Hunter': "#A330C9",
  'Druid': "#FF7C0A",
  'Hunter': "#AAD372",
  'Mage': "#3FC7EB",
  'Monk': "#00FF98",
  'Paladin': "#F48CBA",
  'Priest': "#FFFFFF",
  'Rogue': "#FFF468",
  'Shaman': "#0070DD",
  'Warlock': "#8788EE",
  'Warrior': "#C69B6D",
  'Evoker': "#33937F",
};

const LeaderboardCell = ({ text, height, index, tab, characterClass, characterSpec }
  : { text: string, height: number, index: number, tab: string, characterClass: string, characterSpec: string }) => {
  
  
  const specClass = `${characterSpec} ${characterClass}`;
  const specIcon = specIconsMap[specClass as keyof typeof specIconsMap];
  
  const factionIcon = text === 'HORDE' ? horde : text === 'ALLIANCE' ? alliance : null;

  
  const classColor = classColors[characterClass as keyof typeof classColors];

  const getDaysSinceUpdate = (dateString: string) => {
    const updatedDate = new Date(dateString);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - updatedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    return diffDays;
  };

  const daysSinceUpdate = tab === 'updated_at' ? getDaysSinceUpdate(text) : null;

  return (
    <div className={`flex items-center justify-center h-[${height}px] w-full ${index === 0 ? '' : 'border-l-[1px] border-gray-700'}`}>
      {factionIcon ? (
        <Image src={factionIcon} alt={text} height={height / 1.5} className='rounded-lg overflow-hidden' />
      ) : tab === 'character_spec' ? (
        <Image src={specIcon} alt={text} height={height / 1.8} className='rounded-lg overflow-none' />
      ) : tab === 'character_name' ? (
        <span style={{ color: classColor }}>
          {text}
        </span>
      ) : tab === 'updated_at' ? (
        <div className='text-gray-300'>
          {daysSinceUpdate} days ago
        </div>
      ) : (
        <span className='text-gray-300'>
          {text}
        </span>
      )}
    </div>
  );
};

export default LeaderboardCell;
