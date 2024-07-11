'use client'

import React from 'react'
import { SearchProvider } from '~/components/Context/SearchContext'
import LeaderBoardTable from '~/components/LeaderboardTable'
import ScrollTab from '~/components/ScrollTab'
import SearchTab from '~/components/SearchTab'
import { searchTabs } from '~/utils/helper/searchTabsMap';

const SoloShuffle = () => {
    const resultsPerPage = 50
    const rowHeight = 40

    return (
        <main className="flex min-h-screen bg-gradient-to-b from-[#000080] to-black text-white relative">
            <div className="flex flex-col w-full gap-4 pt-4">
                <SearchTab isShuffle={true} />
                <ScrollTab resultsPerPage={resultsPerPage} />
                <div className="flex h-8 bg-gray-800 text-gray-300 justify-between ">
                    {searchTabs.map((tab) => (
                        <div key={tab.name} className={`flex items-center justify-center text-white text-center h-full w-full '} `}>{tab.label}</div>
                    ))}
                </div>
                <LeaderBoardTable resultsPerPage={resultsPerPage} rowHeight={rowHeight} searchTabs={searchTabs} legacy={false} />
                <ScrollTab resultsPerPage={resultsPerPage} />
            </div>
        </main>
    )
}

const SoloShuffleWrapper = () => (
    <SearchProvider>
        <SoloShuffle />
    </SearchProvider>
);

export default SoloShuffleWrapper;
