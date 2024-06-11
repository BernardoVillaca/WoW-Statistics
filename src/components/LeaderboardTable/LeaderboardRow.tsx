import React from 'react';
import LeaderboardCell from './LeaderboardCell';

type CharacterData = {
  id: string;
  name: string;
  character_class: string;
  character_spec: string;
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
};

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ characterData, searchTabs, rowHeight }) => {
  return (
    <div className="bg-gray-800 flex border-b-[2px] border-gray-700" style={{ height: rowHeight }}>
      {searchTabs.map((cell, index) => {
        const cellValue = characterData[cell.name];
        const text = typeof cellValue === 'string' || typeof cellValue === 'number' ? String(cellValue) : '';

        return (
          <LeaderboardCell
            key={`${characterData.id}-${cell.name}`}
            height={rowHeight}
            index={index}
            text={text}
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
