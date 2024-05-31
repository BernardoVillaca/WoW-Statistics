// SearchContext.tsx
import React, { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode } from 'react';

interface SearchContextType {
  minValue: number,
   setMinValue: Dispatch<SetStateAction<number>>,
  maxValue: number, 
  setMaxValue: Dispatch<SetStateAction<number>>,
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

  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(2000);
  
  const [region, setRegion] = useState<string>('us');
  
  const [faction, setFaction] = useState<string>('');
  
  const [realm, setRealm] = useState<string>('');
  
  const [bracket, setBracket] = useState<string>('3v3');
  
  const [rating, setRating] = useState<number[]>([0, Infinity]);

  return (
    <SearchContext.Provider value={{
      currentPage, setCurrentPage,
      minValue, setMinValue,
      maxValue, setMaxValue,
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
