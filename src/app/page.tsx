'use client'
import { useState, useEffect, useRef } from "react";
import ScrollTab from "~/components/ScrollTab";
import axios from "axios";
import SearchTab from "~/components/SearchTab";
import { useRouter } from 'next/navigation'
import { SearchProvider, useSearch } from "~/components/Context/SearchContext";
import LeaderBoardTable from "~/components/LeaderboardTable";


const searchTabs = [
  { name: 'rank', label: 'Rank' },
  { name: 'character_name', label: 'Name' },
  { name: 'rating', label: 'Rating' },
  { name: 'character_spec', label: 'Spec' },
  { name: 'realm_slug', label: 'Realm' },
  { name: 'faction_name', label: 'Faction' },
  { name: 'played', label: 'Played' },
  { name: 'win_ratio', label: 'Win Ratio' },
  { name: 'updated_at', label: 'Last Played' },
];

const resultsPerPage = 50
const rowHeight = 40

const HomePage = () => {


  return (
    <main className="flex min-h-screen bg-gradient-to-b from-[#000080] to-black text-white relative">
      <div className="flex flex-col w-full gap-4 pt-4">
        <SearchTab />
        <ScrollTab resultsPerPage={resultsPerPage} />
        <div className="flex h-16 bg-black justify-between rounded-xl">
          {searchTabs.map((tab, index) => (
            <div key={tab.name} className={`flex items-center justify-center text-white text-center h-full w-full '} `}>{tab.label}</div>
          ))}
        </div>
        <LeaderBoardTable
          resultsPerPage={resultsPerPage}
          rowHeight={rowHeight}
          searchTabs={searchTabs}
        />
        <ScrollTab resultsPerPage={resultsPerPage}/>
      </div>
    </main>
  );
}

const HomePageWrapper = () => (
  <SearchProvider>
    <HomePage />
  </SearchProvider>
);

export default HomePageWrapper;
