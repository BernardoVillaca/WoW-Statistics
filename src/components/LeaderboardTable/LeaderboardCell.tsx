import Image from 'next/image';
import specIconsMap from '~/utils/helper/specIconsMap';
import horde from '../../assets/Factions/horde.png';
import alliance from '../../assets/Factions/alliance.png'
import { calculateDifference } from '~/utils/helper/calculateDifference';
import { useSearch } from '../Context/SearchContext';
import { last } from 'node_modules/cheerio/lib/esm/api/traversing';


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
  '': 'gray',
};

type HistoryEntry = {
  cell: string;
  value: string | number;
  updated_at: string;
};

type CharacterData = {
  id: string;
  name: string;
  character_class: string;
  character_spec: string;
  rank: number;
  history: HistoryEntry[];
  [key: string]: string | number | HistoryEntry[] | undefined;
};

type LeaderboardCellProps = {
  str: string;
  height: number;
  index: number;
  cell: string;
  characterClass: string;
  characterSpec: string;
  history: HistoryEntry[];
  rowIndex: number;
  path: string | null;
  characterData: CharacterData
  legacy: boolean;

};

const LeaderboardCell = ({ str, height, index, cell, characterClass, characterSpec, history, rowIndex, path, characterData, legacy }: LeaderboardCellProps) => {
  const { currentPage, classSearch } = useSearch();  // Added resultsPerPage to calculate the correct rank
  const resultsPerPage = 50;  // Added resultsPerPage to calculate the correct rank
  const specClass = `${characterSpec} ${characterClass}`;
  const specIcon = specIconsMap[specClass as keyof typeof specIconsMap];
  const factionIcon = str === 'HORDE' ? horde : str === 'ALLIANCE' ? alliance : null;

  const classColor = classColors[characterClass as keyof typeof classColors];

  const formatRealmName = (formattedText: string) => {
    if (formattedText.length > 13) {
      formattedText = formattedText.slice(0, 13);
    }
    const wordsArray = formattedText.replace(/-/g, ' ').split(' ');
    formattedText = wordsArray.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return formattedText;
  };

  const getTimeSinceLastPlayed = (dateString: string) => {
    const updatedDate = new Date(dateString);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - updatedDate.getTime());
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    let timeString = '';
    let className = '';

    if (diffMinutes < 60) {
      timeString = `${diffMinutes} min`;
      className = 'text-green-500';
    } else if (diffMinutes < 1440) { // Less than 24 hours
      const diffHours = Math.floor(diffMinutes / 60);
      timeString = `${diffHours}h`;
      className = 'text-green-600';
    } else if (diffMinutes < 2880) { // Less than 2 days
      const diffDays = Math.floor(diffMinutes / 1440);
      timeString = `${diffDays} day${diffDays > 1 ? 's' : ''}`;
      className = 'text-green-700';
    } else if (diffMinutes < 4320) { // Less than 3 days
      const diffDays = Math.floor(diffMinutes / 1440);
      timeString = `${diffDays} day${diffDays > 1 ? 's' : ''}`;
      className = 'text-yellow-400';
    } else if (diffMinutes < 5760) { // Less than 4 days
      const diffDays = Math.floor(diffMinutes / 1440);
      timeString = `${diffDays} day${diffDays > 1 ? 's' : ''}`;
      className = 'text-yellow-500'
    } else {
      const diffDays = Math.floor(diffMinutes / 1440);
      timeString = `${diffDays} day${diffDays > 1 ? 's' : ''}`;
      className = 'text-red-500';
    }

    return { timeString, className };
  };

  const difference = calculateDifference(history, characterData, cell, str);
  const showDifference = difference !== 0;

  const overallRank = (currentPage - 1) * resultsPerPage + rowIndex + 1;

  const { timeString, className } = getTimeSinceLastPlayed(str);


  return (
    <div className={`relative flex items-center justify-center text-gray-300 w-full ${index === 0 ? '' : 'border-l-[1px] border-gray-700'}`}>
      {factionIcon ? (
        <Image src={factionIcon} alt={str} height={height / 2} width={height / 2} className='rounded-lg overflow-hidden' />
      ) : cell === 'rating' || cell === 'played' ? (
        <div className=''>
          <span>{str}</span>
          {showDifference && (
            <div className={`absolute bottom-3 left-24 text-xs ${difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {difference !== 0 ? `(${difference > 0 ? '+' : ''}${difference})` : ''}
            </div>
          )}
        </div>
      ) : cell === 'character_spec' ? (
        <Image src={specIcon} alt={str} height={height / 1.8} width={height / 1.8} className='rounded-lg overflow-none' />
      ) : cell === 'character_name' ? (
        <div>
          <span style={{ color: classColor }}>
            {str}
          </span>
          {classSearch?.length !== 1 && path === '/solo-shuffle' && (
            <div className='flex absolute top-[24px] right-[123px] w-4 h-4 place-content-star items-end'>
              <span style={{ color: classColor }} className='text-xs text-gray-500'>{characterData.rank < 99 ? characterData.rank : ''}</span>
            </div>
          )}
        </div>
      ) : cell === 'win_ratio' ? (
        <span className={` ${Number(str) >= 70 ? 'text-green-300' : Number(str) >= 55 ? 'text-yellow-300' : 'text-red-300'} `}>
          {str}%
        </span>
      ) : cell === 'rank' && path === '/solo-shuffle' ? (
        <div className='flex'>
          <span>{overallRank}</span>
          {showDifference && (
            <div className={`absolute bottom-3 left-24 text-xs ${difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {difference !== 0 ? `(${difference > 0 ? '+' : ''}${difference})` : ''}
            </div>
          )}

        </div>
      ) : cell === 'realm_slug' ? (
        <span>{formatRealmName(str)}</span>
      ) : cell === 'updated_at' ? (
        <div className={className}>
          {timeString}
        </div>
      ) : (
        <div >
          {str}
          {showDifference && (
            <div className={`absolute bottom-3 left-24 text-xs ${difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {difference !== 0 ? `(${difference > 0 ? '+' : ''}${difference})` : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LeaderboardCell;
