'use client'

import React, { useEffect, useState } from 'react';
import { FiLoader } from 'react-icons/fi';
import LeaderboardRow from './LeaderboardRow';
import axios from 'axios';
import { useSearch } from '../Context/SearchContext';
import useURLChange from '~/utils/hooks/useURLChange';

type SearchTab = {
  name: string;
};

type CharacterData = {
  id: string;
  name: string;
  character_class: string;
  character_spec: string;
  history: HistoryEntry[];
  [key: string]: any; // To handle dynamic keys for cell names
};

type HistoryEntry = {
  cell: string;
  value: string | number;
  updated_at: string;
};

type LeaderBoardTableProps = {
  searchTabs: SearchTab[];
  resultsPerPage: number;
  rowHeight: number;
};

const LeaderBoardTable: React.FC<LeaderBoardTableProps> = ({ searchTabs, resultsPerPage, rowHeight }) => {
  const { setResultsCount } = useSearch();
  const [data, setData] = useState<CharacterData[]>([]);
  const [loading, setLoading] = useState(false);
  const queryParams = useURLChange();

  const getQueryParams = () => {
    const params = new URLSearchParams(queryParams ?? '');
    return {
      version: params.get('version') ?? 'retail',
      region: params.get('region') ?? 'us',
      bracket: params.get('bracket') ?? '3v3',
      page: params.get('page') ?? 1,
      search: params.get('search') ?? params.delete('search'),
      faction: params.get('faction') ?? params.delete('faction'),
      realm: params.get('realm') ?? params.delete('realm'),
      minRating: parseInt(params.get('minRating') ?? '0'),
      maxRating: parseInt(params.get('maxRating') ?? '4000')
    };
  };

  const getData = async () => {
    setLoading(true);
    const queryParams = getQueryParams();

    // Filter out empty parameters and default min/max ratings
    const filteredParams = Object.fromEntries(
      Object.entries(queryParams).filter(([key, value]) => {
        if (key === 'page' && value === 1) return false;
        if (key === 'minRating' && value === 0) return false;
        if (key === 'maxRating' && value === 4000) return false;
        return value !== '' && value !== null;
      })
    );

    try {
      const response = await axios.get(`/api/get50Results`, {
        params: filteredParams
      });
      setResultsCount(response.data.total);
      setData(response.data.results);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryParams !== null) {
      getData();
    }
  }, [queryParams]);

  const containerHeight = resultsPerPage * rowHeight;

  return (
    <div className="flex flex-col w-full" style={{ height: containerHeight }}>
      {loading && (
        <div className="h-full flex flex-col justify-center items-center bg-black bg-opacity-50">
          <FiLoader className="animate-spin text-white" size={50} />
        </div>
      )}
      {!loading && data.map((characterData, index) => (
        characterData.character_class !== '' ? (
          <LeaderboardRow
            key={`${characterData.id}-${index}`}
            characterData={characterData}
            searchTabs={searchTabs}
            rowHeight={rowHeight}
          />
        ) : null
      ))}
    </div>
  );
};

export default LeaderBoardTable;
