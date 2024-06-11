// SearchContext.tsx
import React, { createContext, useContext, useState} from 'react';

import type { Dispatch, SetStateAction, ReactNode } from 'react';

interface SearchContextType {
 
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  resultsCount: number;
  setResultsCount: Dispatch<SetStateAction<number>>;
 
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [resultsCount, setResultsCount] = useState<number>(0);

  return (
    <SearchContext.Provider value={{
      currentPage, setCurrentPage,
      resultsCount, setResultsCount
      
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
