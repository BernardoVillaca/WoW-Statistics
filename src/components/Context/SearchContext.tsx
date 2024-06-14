import React, { createContext, useContext, useState } from 'react';
import type { Dispatch, SetStateAction, ReactNode } from 'react';
import type { Cutoffs } from '~/utils/helper/ratingCutoffsInterface';


interface RatingCutoffs {
  eu_cutoffs: Cutoffs;
  us_cutoffs: Cutoffs;
  classic_us_cutoffs: Cutoffs;
  classic_eu_cutoffs: Cutoffs;
}

interface SearchContextType {
  ratingCutoffs: RatingCutoffs | null;
  setRatingCutoffs: Dispatch<SetStateAction<RatingCutoffs | null>>;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  resultsCount: number;
  setResultsCount: Dispatch<SetStateAction<number>>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [resultsCount, setResultsCount] = useState<number>(0);
  const [ratingCutoffs, setRatingCutoffs] = useState<RatingCutoffs | null>(null);

  return (
    <SearchContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        resultsCount,
        setResultsCount,
        ratingCutoffs,
        setRatingCutoffs,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
