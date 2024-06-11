'use client'

import React, { useEffect, useState, useCallback } from 'react';
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
      page: parseInt(params.get('page') ?? '1'),
      search: params.get('search') ?? undefined,
      faction: params.get('faction') ?? undefined,
      realm: params.get('realm') ?? undefined,
      minRating: parseInt(params.get('minRating') ?? '0'),
      maxRating: parseInt(params.get('maxRating') ?? '4000')
    };
  };

  const getData = useCallback(async () => {
    setLoading(true);
    const queryParams = getQueryParams();

    // Filter out empty parameters and default min/max ratings
    const filteredParams = Object.fromEntries(
      Object.entries(queryParams).filter(([key, value]) => {
        if (key === 'page' && value === 1) return false;
        if (key === 'minRating' && value === 0) return false;
        if (key === 'maxRating' && value === 4000) return false;
        return value !== '' && value !== null && value !== undefined;
      })
    );

    try {
      const response = await axios.get('/api/get50Results', {
        params: filteredParams
      });
      const responseData = response.data as { total: number; results: CharacterData[] };
      setResultsCount(responseData.total);
      setData(responseData.results);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [queryParams, setResultsCount]);

  useEffect(() => {
    if (queryParams !== null) {
      void getData();
    }
  }, [queryParams, getData]);

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
