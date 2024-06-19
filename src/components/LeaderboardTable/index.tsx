'use client';

import React, { useEffect, useState } from 'react';
import { FiLoader } from 'react-icons/fi';
import LeaderboardRow from './LeaderboardRow';
import axios from 'axios';
import { useSearch } from '../Context/SearchContext';
import useURLChange from '~/utils/hooks/useURLChange';
import { Cutoffs } from '~/utils/helper/ratingCutoffsInterface';
import RatingsCutoffTab from '../RatingsCutoffTab';

type SearchTab = {
  name: string;
};

type CharacterData = {
  id: string;
  name: string;
  character_class: string;
  character_spec: string;
  rank: number;
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

type RatingCutoffs = {
  id: number;
  eu_cutoffs: Cutoffs;
  us_cutoffs: Cutoffs
  classic_us_cutoffs: Cutoffs;
  classic_eu_cutoffs: Cutoffs;

};


type QueryParams = {
  version: string;
  region: string;
  bracket: string;
  page: string | number;
  search: string | undefined;
  faction: string | undefined;
  realm: string | undefined;
  minRating: number;
  maxRating: number;
}

const LeaderBoardTable: React.FC<LeaderBoardTableProps> = ({ searchTabs, resultsPerPage, rowHeight }) => {
  const { setResultsCount, setRatingCutoffs, setClassSearch, ratingCutoffs } = useSearch();

  const [data, setData] = useState<CharacterData[]>([]);
  const [loading, setLoading] = useState(false);
  const [paramsToUse, setParamsToUse] = useState({} as QueryParams);
  const queryParams = useURLChange();
  const [path, setPath] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPath(window.location.pathname);
    }
  }, []);


  const getQueryParams = () => {
    const params = new URLSearchParams(queryParams ?? '');
    const classSearchParam = params.get('search');
    let bracket = params.get('bracket') ?? '3v3';
    if (classSearchParam) {
      setClassSearch(classSearchParam.split(',') ?? null);
    }
    if (path?.includes('solo-shuffle')) {
      bracket = 'shuffle';
    }

    return {
      version: params.get('version') ?? 'retail',
      region: params.get('region') ?? 'us',
      bracket: bracket,
      page: params.get('page') ?? 1,
      search: params.get('search') ?? undefined,
      faction: params.get('faction') ?? undefined,
      realm: params.get('realm') ?? undefined,
      minRating: parseInt(params.get('minRating') ?? '0'),
      maxRating: parseInt(params.get('maxRating') ?? '4000')
    };
  };

  const getData = async () => {
    setLoading(true);
    const queryParams = getQueryParams();
    setParamsToUse(queryParams);

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
      const firstResponse = await axios.get(`/api/get50Results`, {
        params: filteredParams
      });
      const firstResponseData = firstResponse.data as { total: number; results: CharacterData[] };
      setResultsCount(firstResponseData.total);
      setData(firstResponseData.results);

      const secondResponse = await axios.get(`/api/getRatingCutoffs`);
      const secondResponseData = secondResponse.data as { cutoffs: RatingCutoffs };
      setRatingCutoffs(secondResponseData.cutoffs);


    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryParams !== null && path !== null) {
      void getData();
    }
  }, [queryParams, path]);

  // dont blame yourself for this
  const containerHeight = (resultsPerPage + 0.5) * rowHeight;

  return (
    <div className="flex flex-col w-full" style={{ height: containerHeight }}>
      <RatingsCutoffTab />
      {loading ? (
        <div className="h-full flex flex-col justify-between items-center bg-gray-800 bg-opacity-50 py-24">
          <FiLoader className="animate-spin text-white" size={50} />
          <FiLoader className="animate-spin text-white" size={50} />
          <FiLoader className="animate-spin text-white" size={50} />
          <FiLoader className="animate-spin text-white" size={50} />
        </div>
      ) : (
        <div className=''>
          {data.map((characterData, index) => (
            characterData.character_class !== '' ? (
              <LeaderboardRow
                ratingCutoffs={ratingCutoffs}
                queryParams={paramsToUse}
                path={path}
                rowIndex={index}
                key={`${characterData.id}-${index}`}
                characterData={characterData}
                searchTabs={searchTabs}
                rowHeight={rowHeight}
              />
            ) : null
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaderBoardTable;
