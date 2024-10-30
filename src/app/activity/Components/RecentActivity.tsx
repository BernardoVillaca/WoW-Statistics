'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FiLoader } from 'react-icons/fi'
import { useSearch } from '~/components/Context/SearchContext'
import LeaderboardRow from '~/components/LeaderboardTable/LeaderboardRow'
import type { CharacterData } from '~/components/LeaderboardTable/types'
import ScrollTab from '~/components/ScrollTab'
import { searchTabs } from '~/utils/helper/searchTabsMap'
import useURLChange from '~/utils/hooks/useURLChange'

type ActivePlayersResponse = {
    results: CharacterData[];
    total: number;
};
type Params = {
    resultsPerPage: number;
    version: string;
    region: string;
    bracket: string;

};
const RecentActivity = ({path} : {path: string}) => {
    const { setResultsCount } = useSearch();
    const [activePlayers, setActivePlayers] = useState<CharacterData[]>([]);
    const [activePlayersLoading, setActivePlayersLoading] = useState(true);
    const [paramsToUse, setParamsToUse] = useState({} as Params);

    const queryParams = useURLChange();
    
    const getQueryParams = () => {
        const params = new URLSearchParams(queryParams ?? '');
        return {
            resultsPerPage: 10,
            path: path,
            version: params.get('version') ?? 'retail',
            region: params.get('region') ?? 'us',
            bracket: params.get('bracket') ?? '3v3',
            page: params.get('page') ?? 1
        };
    };


    const getActivePlayers = async () => {
        setActivePlayersLoading(true);
        const params = getQueryParams();
        setParamsToUse(params)
        const response = await axios.get<ActivePlayersResponse>('/api/get50Results', {
            params,
        });

        setActivePlayers(response.data.results);
        setResultsCount(response.data.total)
        setActivePlayersLoading(false);
    };

    useEffect(() => {
        if (queryParams !== null) {
            void getActivePlayers();
        }
    }, [queryParams]);


    return (
        <div className='flex flex-col gap-4 p-4 border-24 border-[1px] rounded border-opacity-30 border-secondary-gray '>
            <span className="text-center text-xl">Recent Activity</span>
            <ScrollTab resultsPerPage={10} />
            <div className="flex h-8 bg-secondary-light_black text-gray-300 justify-between ">
                {searchTabs.map((tab) => (
                    <div key={tab.name} className={`flex items-center justify-center text-white text-center h-full w-full '} `}>{tab.label}</div>
                ))}
            </div>
            <div className='flex w-full flex-col h-[400px] bg-secondary-light_black rounded-xl'>
                {activePlayersLoading ? (
                    <div className='flex items-center place-content-center w-full h-[400px]'>
                        <FiLoader className="animate-spin text-gray-300" size={50} />
                    </div>
                ) : (
                    <>
                        {activePlayers.length > 0 ? (
                            activePlayers.map((characterData, index) => (
                                <LeaderboardRow
                                    rowIndex={index}
                                    queryParams={paramsToUse}
                                    key={`${characterData.id}-${index}`}
                                    characterData={characterData}
                                    searchTabs={searchTabs}
                                    rowHeight={40}
                                />
                            ))
                        ) : (
                            <div className='flex items-center place-content-center w-full h-[400px]'>
                                <p className='text-gray-300'>No one is playing. Dead game :(</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default RecentActivity