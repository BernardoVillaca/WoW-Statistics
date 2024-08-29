import React from 'react';
import LeaderboardCell from './LeaderboardCell';
import Image from 'next/image';
import Rank1 from '~/assets/Other/rankOneIcon.png';
import { LeaderboardRowProps } from './types';
import Link from 'next/link';



const LeaderboardRow: React.FC<LeaderboardRowProps> = ({
  characterData,
  searchTabs,
  rowHeight,
  rowIndex,
  path,
  queryParams,
  ratingCutoffs,
  legacy
}) => {
  const getClassSpecKey = (character_class: string, character_spec: string): string => {
    const lowerCaseClass = character_class.toLowerCase();
    const lowerCaseSpec = character_spec.toLowerCase();

    if (lowerCaseClass === 'hunter' && lowerCaseSpec === 'beast mastery') return 'beast_mastery_hunter_cutoff';
    if (lowerCaseClass === 'demon hunter') return `${lowerCaseSpec}_demon_hunter_cutoff`;
    if (lowerCaseClass === 'death knight') return `${lowerCaseSpec}_death_knight_cutoff`;
    return `${lowerCaseSpec}_${lowerCaseClass}_cutoff`;

  };

  const getHighlightedLines = (): number | null => {
    if (!ratingCutoffs) return null;
    if (queryParams?.bracket === '3v3') {
      return ratingCutoffs.us_cutoffs?.arena_3v3_cutoff.count + 1 || null;
    }
    if (path === '/solo-shuffle') {
      const classSpecKey = getClassSpecKey(characterData.character_class, characterData.character_spec);
      const cutoff = ratingCutoffs.us_cutoffs?.[classSpecKey];
      return cutoff ? cutoff.count + 1 : null;
    }
    return null;
  };

  const isRankHighlighted = (): boolean => {
    const highlightedLines = getHighlightedLines();
    return highlightedLines !== null && characterData.rank < highlightedLines;
  };

  const getBorderClass = (): string => {
    return isRankHighlighted() ? 'border-orange-200 border-opacity-30' : 'border-gray-700';
  };

  const renderRankIcon = () => {
    if (isRankHighlighted() && path !== '/legacy') {
      return (
        <div className='absolute left-3 top-3'>
          <Image src={Rank1} alt={characterData.character_name} height={15} className=' overflow-hidden' />
        </div>
      );
    }
    return null;
  };

  if (legacy) {
    searchTabs = searchTabs.filter((tab) => tab.name !== 'updated_at');
  }

  const params = new URLSearchParams({
    version: queryParams?.version || '',
    region: queryParams?.region || '',
    name: characterData.character_name.toLowerCase(),
    realm: characterData.realm_slug,
    class: characterData.character_class,
    spec: characterData.character_spec
  });

  return (
    <Link href={`/profile?${params.toString()}`}>
      <div className={`relative bg-secondary-light_black flex border-b-[1px] hover:bg-primary-dark cursor-pointer ${getBorderClass()}`} style={{ height: rowHeight }}>
        {renderRankIcon()}
        {searchTabs.map((cell, index) => {
          const cellValue = characterData[cell.name];
          const str = typeof cellValue === 'string' || typeof cellValue === 'number' ? String(cellValue) : '';
          return (
            <LeaderboardCell
              key={`${characterData.character_id}-${cell.name}`}
              height={rowHeight}
              rowIndex={rowIndex}
              characterData={characterData}
              path={path ?? null}
              index={index}
              str={str}
              cell={cell.name}
              characterClass={characterData.character_class}
              characterSpec={characterData.character_spec}
              history={characterData.history} legacy={false}
            />
          );
        })}
      </div>
    </Link>
  );
};

export default LeaderboardRow;
