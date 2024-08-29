'use client'

import ScrollTab from "~/components/ScrollTab";
import SearchTab from "~/components/SearchTab";
import { SearchProvider } from "~/components/Context/SearchContext";
import LeaderBoardTable from "~/components/LeaderboardTable";
import { searchTabs } from '~/utils/helper/searchTabsMap';
import LegacySearch from "~/components/LegacySearch";


const resultsPerPage = 50
const rowHeight = 40

const LegacyPage = () => {
    const filteredSearchTabs = searchTabs.filter(tab => tab.name !== 'updated_at');

    return (
        <main className="flex min-h-screen text-white relative">
            <div className="flex flex-col w-full gap-4 pt-4">
                <SearchTab isShuffle={false} />
                <LegacySearch />
                <ScrollTab resultsPerPage={resultsPerPage} />
                <div className="flex h-8 bg-secondary-light_black justify-between rounded-xl">
                    {filteredSearchTabs.map((tab) => (
                        <div key={tab.name} className={`flex items-center justify-center text-white text-center h-full w-full '} `}>{tab.label}</div>
                    ))}
                </div>
                <LeaderBoardTable resultsPerPage={resultsPerPage} rowHeight={rowHeight} searchTabs={searchTabs} legacy={true} />
                <ScrollTab resultsPerPage={resultsPerPage} />
            </div>
        </main>
    );
}

const LegacyWrapper = () => (
    <SearchProvider>
        <LegacyPage />
    </SearchProvider>
);

export default LegacyWrapper;
