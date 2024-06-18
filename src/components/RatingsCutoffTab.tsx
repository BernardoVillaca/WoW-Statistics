'use client'

import React, { useEffect, useState } from 'react'
import { useSearch } from './Context/SearchContext';
import useURLChange from '~/utils/hooks/useURLChange';

interface RatingCountObj {
  count: number;
  rating: number;
}

interface Cutoffs {
  arena_3v3_cutoff?: RatingCountObj;
  rbg_alliance_cutoff?: RatingCountObj;
  rbg_horde_cutoff?: RatingCountObj;
  [key: string]: RatingCountObj | undefined;
}

interface RatingCutoffs {
  us_cutoffs: Cutoffs;
  eu_cutoffs: Cutoffs;
}

const RatingsCutoffTab = () => {
  const queryParams = useURLChange()

  const [cutoff, setCutoff] = useState<RatingCountObj | null>(null)
  const { ratingCutoffs } = useSearch() as { ratingCutoffs: RatingCutoffs | null }
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
    const { region, bracket, faction, version, search } = queryParams;

    let specificCutoff: RatingCountObj | null = null;

    if (version === 'retail' && !path?.includes('solo-shuffle')) {
      if (bracket === '3v3') {
        specificCutoff = (region === 'us' ? ratingCutoffs.us_cutoffs.arena_3v3_cutoff : ratingCutoffs.eu_cutoffs.arena_3v3_cutoff) ?? null;
      }
      if (bracket === 'rbg' && faction === 'alliance') {
        specificCutoff = (region === 'us' ? ratingCutoffs.us_cutoffs.rbg_alliance_cutoff : ratingCutoffs.eu_cutoffs.rbg_alliance_cutoff) ?? null;
      }
      if (bracket === 'rbg' && faction === 'horde') {
        specificCutoff = (region === 'us' ? ratingCutoffs.us_cutoffs.rbg_horde_cutoff : ratingCutoffs.eu_cutoffs.rbg_horde_cutoff) ?? null;
      }
    }

    if (path?.includes('solo-shuffle')) {
      const classSearch: string[] = search?.split(',') ?? [];

      if (classSearch.length === 1) {
        const spec = classSearch.join(' ').toLowerCase().replace(/\s+/g, '_');
        const specKey = `${spec}_cutoff` as keyof Cutoffs;

        specificCutoff = (region === 'us' ? ratingCutoffs.us_cutoffs[specKey] : ratingCutoffs.eu_cutoffs[specKey]) ?? null;
      }
    }
    setCutoff(specificCutoff);
  }

  return (
    <div className={`flex w-48 h-5 ${cutoff ? 'bg-gray-800' : 'bg-transparent'} rounded-md justify-between text-sm px-2 mb-1`}>
      {cutoff && (
        <>
          <div>
            <span>Rank1 cut: </span>
            <span>{cutoff?.rating}</span>
          </div>
          <div>
            <span>Spots: </span>
            <span>{cutoff?.count}</span>
          </div>
        </>
      )}
    </div>
  )
}

export default RatingsCutoffTab
