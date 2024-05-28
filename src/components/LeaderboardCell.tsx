import Image from 'next/image';
import specIconsMap from '~/helper/specIconsMap';
import horde from '~/assets/WoWFactions/horde.png';
import alliance from '~/assets/WoWFactions/alliance.png';

const LeaderboardCell = ({ text, height, index }: { text: string, height: number, index: number }) => {
  // Find the corresponding image URL from the specIconsMap
  const specIcon = specIconsMap[text as keyof typeof specIconsMap];
  // Determine the faction icon based on the text
  const factionIcon = text === 'HORDE' ? horde : text === 'ALLIANCE' ? alliance : null;

  return (
    <div className={`flex items-center justify-center h-[${height}px] w-full ${index === 0 ? '' : 'border-l-[1px]'}`}>
      {factionIcon ? (
        <Image src={factionIcon} alt={text} height={height / 1.5} className='rounded-lg overflow-none' />
      ) : specIcon ? (
        <Image src={specIcon} alt={text} height={height / 1.5} className='rounded-lg overflow-none' />
      ) : (
        text
      )}
    </div>
  );
};

export default LeaderboardCell;
