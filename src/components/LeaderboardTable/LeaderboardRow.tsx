import React from 'react';
import LeaderboardCell from './LeaderboardCell';
import Image from 'next/image';
import Rank1 from '~/assets/Other/rankOneIcon.png';
import { Cutoffs } from '~/utils/helper/ratingCutoffsInterface';

type CharacterData = {
  id: string;
  name: string;
  character_class: string;
  character_spec: string;
  rank: number;
  history: HistoryEntry[];
  updated_at: string;
  [key: string]: string | number | HistoryEntry[] | undefined;
};

type SearchTab = {
  name: string;
};

type HistoryEntry = {
  cell: string;
  value: string | number;
  updated_at: string;
};

type ratingCutoffs = {
  id: number;
  eu_cutoffs: Cutoffs;
  us_cutoffs: Cutoffs;
  classic_us_cutoffs: Cutoffs;
  classic_eu_cutoffs: Cutoffs;
};

type LeaderboardRowProps = {
  characterData: CharacterData;
  searchTabs: SearchTab[];
  rowHeight: number;
  path: string | null;
  rowIndex: number;
  legacy: boolean;
  queryParams: {
    bracket: string;
  };
  ratingCutoffs: ratingCutoffs | null;
};

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
    if (queryParams.bracket === '3v3') {
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
          <Image src={Rank1} alt={characterData.name} height={15} className=' overflow-hidden' />
        </div>
      );
    }
    return null;
  };

  if (legacy) {
    searchTabs = searchTabs.filter((tab) => tab.name !== 'updated_at');
  }


  return (
    <div className={`relative bg-gray-800 flex border-b-[1px] ${getBorderClass()}`} style={{ height: rowHeight }}>
      {renderRankIcon()}
      {searchTabs.map((cell, index) => {
        const cellValue = characterData[cell.name];
        const str = typeof cellValue === 'string' || typeof cellValue === 'number' ? String(cellValue) : '';
        return (
          <LeaderboardCell
            key={`${characterData.id}-${cell.name}`}
            height={rowHeight}
            rowIndex={rowIndex}
            characterData={characterData}
            path={path}
            index={index}
            str={str}
            cell={cell.name}
            characterClass={characterData.character_class}
            characterSpec={characterData.character_spec}
            history={characterData.history} legacy={false}          />
        );
      })}
    </div>
  );
};

export default LeaderboardRow;
