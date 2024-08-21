// src/types/types.ts

import { Cutoffs } from "~/utils/helper/ratingCutoffsInterface";

export type SearchTab = {
    name: string;
  };
  
 export  type HistoryEntry = {
    updated_at: string;
    rating?: number;
    rank?: number;
    played?: number;
};
  
  export type CharacterData = {
    id: string;
    character_id: string;
    character_name: string;
    character_class: string;
    character_spec: string;
    realm_slug: string;
    rank: number;
    history: HistoryEntry[];
    updated_at: string; 
    [key: string]: string | number | HistoryEntry[] | undefined;
  };
  
  export type LeaderBoardTableProps = {
    searchTabs: SearchTab[];
    resultsPerPage: number;
    rowHeight: number;
    legacy: boolean;
  };
  
  export type RatingCutoffs = {
    id: number;
    eu_cutoffs: Cutoffs;
    us_cutoffs: Cutoffs;
    classic_us_cutoffs: Cutoffs;
    classic_eu_cutoffs: Cutoffs;
  };
  
  export type QueryParams = {
    version: string;
    region: string;
    bracket: string;
    page: string | number;
    search: string | undefined;
    faction: string | undefined;
    realm: string | undefined;
    minRating: number;
    maxRating: number;
  };
  
  export type LeaderboardRowProps = {
    characterData: CharacterData;
    searchTabs: SearchTab[];
    rowHeight: number;
    rowIndex: number;
    path?: string | null; 
    legacy?: boolean; 
    queryParams?: {
      bracket: string;
      region: string;
      version: string;
    }; 
    ratingCutoffs?: RatingCutoffs | null; 
  };
  
  export type LeaderboardCellProps = {
    str: string;
    height: number;
    index: number;
    cell: string;
    characterClass: string;
    characterSpec: string;
    history: HistoryEntry[];
    rowIndex: number;
    path: string | null;
    characterData: CharacterData;
    legacy: boolean;
  };
  