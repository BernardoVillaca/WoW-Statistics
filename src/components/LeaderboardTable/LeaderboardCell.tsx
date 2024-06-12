import Image from 'next/image';
import specIconsMap from '~/utils/helper/specIconsMap';
import horde from '../../assets/Factions/horde.png';
import alliance from '../../assets/Factions/alliance.png'
import { calculateDifference } from '~/utils/helper/calculateDifference';

const classColors = {
  'Death Knight': "#C41E3A",
  'Demon Hunter': "#A330C9",
  'Deathknight': "#C41E3A",
  'Demonhunter': "#A330C9",
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

type HistoryEntry = {
  cell: string;
  value: string | number;
  updated_at: string;
};

type LeaderboardCellProps = {
  text: string;
  height: number;
  index: number;
  cell: string;
  characterClass: string;
  characterSpec: string;
  history: HistoryEntry[];
  rowIndex: number;
  path: string | null;
};

const LeaderboardCell = ({ text, height, index, cell, characterClass, characterSpec, history, rowIndex, path }: LeaderboardCellProps) => {
  const specClass = `${characterSpec} ${characterClass}`;
  const specIcon = specIconsMap[specClass as keyof typeof specIconsMap];
  const factionIcon = text === 'HORDE' ? horde : text === 'ALLIANCE' ? alliance : null;

  const classColor = classColors[characterClass as keyof typeof classColors];

  const formatRealmName = (realmName: string) => {
    let formattedName = realmName.replace('-', ' ').split(' ');
    formattedName = formattedName.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return formattedName.join(' ');
  };

  const getTimeSinceLastPlayed = (dateString: string) => {
    const updatedDate = new Date(dateString);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - updatedDate.getTime());
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
console.log(cell)
    if (diffMinutes < 60) {
      return `${diffMinutes} min`;
    } else if (diffMinutes < 1440) { // Less than 24 hours
      const diffHours = Math.floor(diffMinutes / 60);
      return `${diffHours}h`;
    } else {
      const diffDays = Math.floor(diffMinutes / 1440);
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }
  };

  const difference = calculateDifference(history, cell, text);
  const showDifference = difference !== 0;

  return (
    <div className={`relative flex items-center justify-center text-gray-300 h-[${height}px] w-full ${index === 0 ? '' : 'border-l-[1px] border-gray-700'}`}>
      {factionIcon ? (
        <Image src={factionIcon} alt={text} height={height / 2} width={height / 2} className='rounded-lg overflow-hidden' />
      ) : cell === 'rating' || cell === 'rank' || cell === 'played' ? (
        <div className=''>
          <span>{text}</span>
          {showDifference && (
            <div className={`absolute bottom-3 left-24 text-xs ${difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {difference !== 0 ? `(${difference > 0 ? '+' : ''}${difference})` : ''}
            </div>
          )}
        </div>
      ) : cell === 'character_spec' ? (
        <Image src={specIcon} alt={text} height={height / 1.8} width={height / 1.8} className='rounded-lg overflow-none' />
      ) : cell === 'character_name' ? (
        <span style={{ color: classColor }}>
          {text}
        </span>
      ) : cell === 'win_ratio' ? (
        <span className={` ${Number(text) >= 70 ? 'text-green-300' : Number(text) >= 55 ? 'text-yellow-300' : 'text-red-300'} `}>
          {text}%
        </span>
      ) : cell === 'rank' ? (
        <span>asdasda</span>
      ) : cell === 'realm_slug' ? (
        <span>{formatRealmName(text)}</span>
      ) : cell === 'updated_at' ? (
        <div>
          {getTimeSinceLastPlayed(text)}
        </div>
      ) : (
        <span>
          {text}
        </span>
      )}
    </div>
  );
};

export default LeaderboardCell;
