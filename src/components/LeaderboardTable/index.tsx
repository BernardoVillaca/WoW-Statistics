'use client'

import React, { useEffect, useState } from 'react';
import { FiLoader } from 'react-icons/fi';
import LeaderboardRow from './LeaderboardRow';
import axios from 'axios';
import { useSearch } from '../Context/SearchContext';
import useURLChange from '~/utils/hooks/useURLChange';


const LeaderBoardTable = ({ searchTabs, resultsPerPage, rowHeight }: { searchTabs: any, resultsPerPage: number, rowHeight: number }) => {
    const { setResultsCount } = useSearch();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const queryParams = useURLChange();
  
    const getQueryParams = () => {
        const params = new URLSearchParams(queryParams || '');
        return {
            page: params.get('page') || 1,
            search: params.get('search') || '',
            faction: params.get('faction') || '',
            realm: params.get('realm') || '',
            bracket: params.get('bracket') || '',
            region: params.get('region') || '',
            minRating: parseInt(params.get('minRating') ?? '0'),
            maxRating: parseInt(params.get('maxRating') ?? '4000')
        };
    };

    const getData = async () => {
        setLoading(true);
        const { page, search, faction, realm, minRating, maxRating, bracket, region } = getQueryParams();
        const response = await axios.get(`/api/get50Results`, {
            params: {
                page,
                search,
                faction,
                realm,
                minRating,
                bracket,
                maxRating,
                region
            }
        });
        setResultsCount(response.data.total);
        setData(response.data.results);
        setLoading(false);
    };

    useEffect(() => {
        if (queryParams !== null) {
            getData();
        }
    }, [queryParams]);

    const containerHeight = (resultsPerPage) * rowHeight;

    return (
        <div className="flex flex-col w-full" style={{ height: containerHeight }}>
            {loading && (
                <div className="h-full flex flex-col justify-center items-center bg-black bg-opacity-50">
                    <FiLoader className="animate-spin text-white" size={50} />
                </div>
            )}
            {!loading && data.map((characterData: { [key: string]: any }) => (
                characterData.character_class !== '' ? (
                    <LeaderboardRow
                        key={characterData.id}
                        characterData={characterData}
                        searchTabs={searchTabs}
                        rowHeight={rowHeight}
                    />
                ) : null
            ))}
        </div>
    );
};

export default LeaderBoardTable;
