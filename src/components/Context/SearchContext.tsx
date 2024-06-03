// SearchContext.tsx
import axios from 'axios';
import { get } from 'node_modules/axios/index.cjs';
import React, { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode, useEffect } from 'react';

interface SearchContextType {
  minRating: string;
  setMinRating: Dispatch<SetStateAction<string>>;
  maxRating: string;
  setMaxRating: Dispatch<SetStateAction<string>>;
  minRatingSearch: string;
  setMinRatingSearch: Dispatch<SetStateAction<string>>;
  maxRatingSearch: string;
  setMaxRatingSearch: Dispatch<SetStateAction<string>>;
  bracket: string,
  setBracket: Dispatch<SetStateAction<string>>,
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  resultsCount: number;
  setResultsCount: Dispatch<SetStateAction<number>>;
  selectedSpecs: string[];
  setSelectedSpecs: Dispatch<SetStateAction<string[]>>;
  region: string;
  setRegion: Dispatch<SetStateAction<string>>;
  faction: string;
  setFaction: Dispatch<SetStateAction<string>>;
  realm: string;
  setRealm: Dispatch<SetStateAction<string>>;
  rating: number[];
  setRating: Dispatch<SetStateAction<number[]>>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
 
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [resultsCount, setResultsCount] = useState<number>(0);
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);

  const [minRatingSearch, setMinRatingSearch] = useState('');
  const [maxRatingSearch, setMaxRatingSearch] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');

  const [region, setRegion] = useState<string>('us');

  const [faction, setFaction] = useState<string>('');

  const [realm, setRealm] = useState<string>('');

  const [bracket, setBracket] = useState<string>('3v3');

  const [rating, setRating] = useState<number[]>([0, Infinity]);

  return (
    <SearchContext.Provider value={{
      currentPage, setCurrentPage,
      minRating, setMinRating,
      maxRating, setMaxRating,
      minRatingSearch, setMinRatingSearch,
      maxRatingSearch, setMaxRatingSearch,
      resultsCount, setResultsCount,
      selectedSpecs, setSelectedSpecs,
      region, setRegion,
      faction, setFaction,
      realm, setRealm,
      bracket, setBracket,
      rating, setRating
    }}>
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
