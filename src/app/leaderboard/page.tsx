'use client'

import ScrollTab from "~/components/ScrollTab";
import SearchTab from "~/components/SearchTab";
import { SearchProvider } from "~/components/Context/SearchContext";
import LeaderBoardTable from "~/components/LeaderboardTable";
import VersionSearch from "~/components/SearchTab/VersionSearch";
import { searchTabs } from '~/utils/helper/searchTabsMap';

const resultsPerPage = 50
const rowHeight = 40

const LeaderboardPage = () => {

  return (
    <main className="flex min-h-screen  text-white relative">
      <div className="flex flex-col w-full gap-4 py-4">
        <VersionSearch />
        <SearchTab isShuffle={false} />
        <ScrollTab resultsPerPage={resultsPerPage} />
        <div className="flex h-8 bg-secondary-light_black text-gray-300 justify-between ">
          {searchTabs.map((tab) => (
            <div key={tab.name} className={`flex items-center justify-center text-white text-center h-full w-full '} `}>{tab.label}</div>
          ))}
        </div>
        <LeaderBoardTable resultsPerPage={resultsPerPage} rowHeight={rowHeight} searchTabs={searchTabs} legacy={false}/>
        <ScrollTab resultsPerPage={resultsPerPage} />
      </div>
    </main>
  );
}

const LeaderboardWrapper = () => (
  <SearchProvider>
    <LeaderboardPage />
  </SearchProvider>
);

export default LeaderboardWrapper;
