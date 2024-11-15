import Image from 'next/image';
import specIconsMap from '~/utils/helper/specIconsMap';
import horde from '../../assets/Factions/horde.png';
import alliance from '../../assets/Factions/alliance.png'
import { calculateDifference } from '~/utils/helper/calculateDifference';
import { useSearch } from '../Context/SearchContext';
import { classColors } from '~/utils/helper/classIconsMap';
import type { LeaderboardCellProps } from './types';


const LeaderboardCell = ({ str, height, index, cell, characterClass, characterSpec, history, rowIndex, path, characterData }: LeaderboardCellProps) => {
  const { currentPage, classSearch } = useSearch();  // Added resultsPerPage to calculate the correct rank
  const resultsPerPage = 50;  // Added resultsPerPage to calculate the correct rank
  const specClass = `${characterSpec} ${characterClass}`;
  const specIcon = specIconsMap[specClass as keyof typeof specIconsMap];
  const factionIcon = str === 'HORDE' ? horde : str === 'ALLIANCE' ? alliance : null;

  const classColor = classColors[characterClass];

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
      className = 'text-secondary-red';
    }

    return { timeString, className };
  };

  const difference = calculateDifference(history, characterData, cell, str);
  const showDifference = difference !== 0;

  const overallRank = (currentPage - 1) * resultsPerPage + rowIndex + 1;

  const { timeString, className } = getTimeSinceLastPlayed(str);


  return (
    <div className={`flex items-center text-xs 2xl:text-base justify-center text-gray-300 w-full ${index === 0 ? '' : 'border-l-[1px] border-opacity-30 border-secondary-gray'}`}>
      {factionIcon ? (
        <Image src={factionIcon} alt={str} height={height / 2} width={height / 2} className='rounded-lg overflow-hidden' />
      ) : cell === 'rating' ? (
        <div className='flex justify-between items-center  w-full px-2'>
          <div className='w-4 flex items-end'>
            {classSearch?.length !== 1 && path === '/shuffle' && (
              <div className=''>
                <span style={{ color: classColor }} className='text-xs '>{characterData.rank < 99 ? characterData.rank : ''}</span>
              </div>
            )}
          </div>
          <span>{str}</span>
          <div className='w-7'>
            {showDifference && (
              <div className={`text-xs  ${difference > 0 ? 'text-green-600' : 'text-secondary-red'}`}>
                {difference !== 0 ? `(${difference > 0 ? '+' : ''}${difference})` : ''}
              </div>
            )}
          </div>
        </div>
      ) : cell === 'played' ? (
        <div className='flex justify-between items-center  w-full px-2'>
          <div className='w-7'></div>
          <span>{str}</span>
          <div className='w-7'>
            {showDifference && (
              <div className={`text-xs  ${difference > 0 ? 'text-green-600' : 'text-secondary-red'}`}>
                {difference !== 0 ? `(${difference > 0 ? '+' : ''}${difference})` : ''}
              </div>
            )}
          </div>
        </div>
      ) : cell === 'rank' && path === '/shuffle' ? (
        <div className='flex place-content-center items-center  w-full px-2'>
          <span>{overallRank}</span>
        </div>
      ) : cell === 'character_spec' ? (
        <Image src={specIcon} alt={str} height={height / 1.8} width={height / 1.8} className='rounded-lg overflow-none' />
      ) : cell === 'character_name' ? (
        <div className='flex '>
          <span style={{ color: classColor }}>
            {str}
          </span>

        </div>
      ) : cell === 'win_ratio' ? (
        <span className={` ${Number(str) >= 70 ? 'text-green-300' : Number(str) >= 55 ? 'text-yellow-300' : 'text-secondary-red'} `}>
          {str}%
        </span>
      ) : cell === 'realm_slug' ? (
        <span className='text-xs 2xl:text-base'>{formatRealmName(str)}</span>
      ) : cell === 'updated_at' ? (
        <div className={className}>
          {timeString}
        </div>
      ) : (
        <span>{str}</span>
      )}
    </div>
  );
};

export default LeaderboardCell;
