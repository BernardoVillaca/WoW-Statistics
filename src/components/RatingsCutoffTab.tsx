'use client'

import React, { useEffect, useState } from 'react'
import { useSearch } from './Context/SearchContext';
import useURLChange from '~/utils/hooks/useURLChange';

interface RatingCountObj {
  count: number;
  rating: number;
}

const RatingsCutoffTab = () => {
  const queryParams = useURLChange()

  const [cutoff, setCutoff] = useState<RatingCountObj | null>(null)
  const { ratingCutoffs } = useSearch()
  const [path, setPath] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPath(window.location.pathname);
    }
  }, []);

  useEffect(() => {
    getSpecificCutoff();
  }, [ratingCutoffs, path, queryParams]);

  const getQueryParams = () => {
    const params = new URLSearchParams(queryParams ?? '');
    let bracket = params.get('bracket') ?? '3v3';

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

  const getSpecificCutoff = () => {
    if (!ratingCutoffs) return;

    const queryParams = getQueryParams();
    const { region, bracket } = queryParams;

    let specificCutoff: RatingCountObj | null = null;

    if (bracket === '3v3') {
      specificCutoff = region === 'us' ? ratingCutoffs.us_cutoffs.arena_3v3_cutoff : ratingCutoffs.eu_cutoffs.arena_3v3_cutoff;
    }
    // Add additional logic for other brackets if needed

    setCutoff(specificCutoff);
  }

  return (
    <div className='flex h-10 bg-gray-800 rounded-xl justify-center items-center gap-48 '>
      <div>
        <span>Rank one cut: </span>
        <span>{cutoff?.rating}</span>
      </div>
      <div>
        <span>Spots: </span>
        <span>{cutoff?.count}</span>
      </div>
    </div>
  )
}

export default RatingsCutoffTab
