import React from 'react';
import LeaderboardCell from './LeaderboardCell';
import Image from 'next/image';
import Rank1 from '~/assets/Other/rankOneIcon.png';

type CharacterData = {
  id: string;
  name: string;
  character_class: string;
  character_spec: string;
  rank: number;
  history: HistoryEntry[];
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

type LeaderboardRowProps = {
  characterData: CharacterData;
  searchTabs: SearchTab[];
  rowHeight: number;
  path: string | null;
  rowIndex: number;
  highlightedLines: number | null
  queryParams: {
    bracket: string
  }

};

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ characterData, searchTabs, rowHeight, rowIndex, path, highlightedLines, queryParams }) => {

  return (
    <div className={`
      relative bg-gray-800 flex border-b-[1px] 
      ${highlightedLines && characterData?.rank && queryParams?.bracket === '3v3' && Number(characterData.rank) < highlightedLines
      ? 'border-orange-200 border-opacity-50' : 'border-gray-700'}`} style={{ height: rowHeight }}
    >
      {highlightedLines && characterData?.rank && queryParams?.bracket === '3v3' && Number(characterData.rank) < highlightedLines && (
        <div className='absolute  left-3 top-3'>
          <Image
            src={Rank1}
            alt={characterData.name}
            height={15}

            className='rounded-lg overflow-hidden' />
        </div>
      )}


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
            history={characterData.history}
          />
        );
      })}
    </div>
  );
};

export default LeaderboardRow;
