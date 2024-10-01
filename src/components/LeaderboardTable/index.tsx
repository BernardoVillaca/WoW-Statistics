'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FiLoader } from 'react-icons/fi';
import LeaderboardRow from './LeaderboardRow';
import axios from 'axios';
import { useSearch } from '../Context/SearchContext';
import useURLChange from '~/utils/hooks/useURLChange';
import RatingsCutoffTab from '../RatingsCutoffTab';
import type { CharacterData, LeaderBoardTableProps, QueryParams, RatingCutoffs } from './types';



const LeaderBoardTable: React.FC<LeaderBoardTableProps> = ({ searchTabs, resultsPerPage, rowHeight, legacy }) => {
  const { setResultsCount, setRatingCutoffs, setClassSearch, ratingCutoffs } = useSearch();

  const [data, setData] = useState<CharacterData[]>([]);
  const [loading, setLoading] = useState(false);
  const [paramsToUse, setParamsToUse] = useState({} as QueryParams);
  const [path, setPath] = useState<string | null>(null);
  const isInitialRender = useRef(true);

  const queryParams = useURLChange();


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
    if (path?.includes('shuffle')) {
      bracket = 'shuffle';
    }
 

    return {
      path: path,
      pvpSeasonIndex: params.get('pvpSeasonIndex') ?? '37',
      version: params.get('version') ?? 'retail',
      region: params.get('region') ?? 'us',
      bracket: bracket,
      page: params.get('page') ?? 1,
      search: params.get('search') ?? undefined,
      faction: params.get('faction') ?? undefined,
      realm: params.get('realm') ?? undefined,
      minRating: isInitialRender.current ? parseInt(params.get('minRating') ?? '0') : 0,
      maxRating: isInitialRender.current ? parseInt(params.get('maxRating') ?? '4000') : 4000
    };
  };

  const getData = async () => {
    setLoading(true);
    const queryParams = getQueryParams();
    setParamsToUse(queryParams);

    // Filter out empty parameters and default min/max ratings
    const filteredParams = Object.fromEntries(
      Object.entries(queryParams).filter(([key, value]) => {
        if (key === 'pvpSeasonIndex' && value === '37') return false
        if (key === 'path' && value === '/leaderboard') return false
        if (key === 'path' && value === '/shuffle') return false
        // if (key === 'page' && value === 1) return false;
        if (key === 'minRating' && value === 0) return false;
        if (key === 'maxRating' && value === 4000) return false;
        return value !== '' && value !== null && value !== undefined;
      })
    );

    try {
      // prevent initial render from fetching data twice
      if (!isInitialRender.current) {
        const firstResponse = await axios.get(`/api/get50Results`, {
          params: filteredParams
        });
        const firstResponseData = firstResponse.data as { total: number; results: CharacterData[] };
        setResultsCount(firstResponseData.total);
        setData(firstResponseData.results);
      }
      isInitialRender.current = false;

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCutoffs = async () => {
    try {
      const secondResponse = await axios.get(`/api/getRatingCutoffs`);
      const secondResponseData = secondResponse.data as { cutoffs: RatingCutoffs };
      setRatingCutoffs(secondResponseData.cutoffs);
    } catch (error) {
      console.error('Error fetching rating cutoffs:', error);
    }
  };

  useEffect(() => {
    if (queryParams !== null && path !== null) {
      void getData();
    }
  }, [queryParams, path]);

  useEffect(() => {
    void getCutoffs();
  },  []);

  // dont blame yourself for this
  const containerHeight = (resultsPerPage + 0.5) * rowHeight;

  return (
    <div className="flex flex-col w-full" style={{ height: containerHeight }}>
      {!legacy && <RatingsCutoffTab />}
      {loading ? (
        <div className="h-full flex flex-col justify-between items-center bg-secondary-light_black bg-opacity-50 py-24">
          <FiLoader className="animate-spin text-white" size={50} />
          <FiLoader className="animate-spin text-white" size={50} />
          <FiLoader className="animate-spin text-white" size={50} />
          <FiLoader className="animate-spin text-white" size={50} />
        </div>
      ) : (
        <div>
          {data.map((characterData, index) => (
            <LeaderboardRow
              legacy={legacy}
              ratingCutoffs={ratingCutoffs}
              queryParams={paramsToUse}
              path={path}
              rowIndex={index}
              key={`${characterData.character_id}-${index}`}
              characterData={characterData}
              searchTabs={searchTabs}
              rowHeight={rowHeight}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaderBoardTable;
