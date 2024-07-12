'use client'

import React, { useEffect, useState } from 'react';
import { updateURL } from '~/utils/helper/updateURL';
import { useSearch } from '~/components/Context/SearchContext';
import useURLChange from '~/utils/hooks/useURLChange';

const BracketSearch = ({ partofLeadeboard }: { partofLeadeboard: boolean }) => {
    const { setCurrentPage } = useSearch();
    const [bracket, setBracket] = useState('');
    const queryParams = useURLChange();
  
    const getQueryParams = () => {
        const params = new URLSearchParams(queryParams ?? '');
        return {
            version: params.get('version') ?? 'retail',
            region: params.get('region') ?? 'us',
            bracket: params.get('bracket') ?? '3v3',
        };
    };

    const params = getQueryParams();
    const { version} = params;

    const handleClick = (newBracket: string) => {
        if (newBracket === bracket) return;
        setBracket(newBracket);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const initialBracket = urlParams.get('bracket') ?? '3v3';
        setBracket(initialBracket);
    }, []);

    useEffect(() => {
          if (version === 'classic' && bracket === 'shuffle') setBracket('3v3');
       
    }, [version]);

    useEffect(() => {
        if (bracket) {
            updateURL('bracket', bracket === '3v3' ? '' : bracket, true);
            setCurrentPage(1);
        }
    }, [bracket]);

    return (
        <div className={`flex text-black items-center justify-center ${partofLeadeboard ? 'w-1/5 border-[1px]' : 'w-[400px]'}  rounded-lg gap-8  border-gray-700`}>
            <button
                className={`flex text-gray-300 border-[1px] ${bracket === '3v3' ? 'border-blue-500' : 'border-gray-300'}  rounded-full w-12 h-12 items-center justify-center`}
                onClick={() => handleClick('3v3')}
            >
                3v3
            </button>
            <button
                className={`flex text-gray-300 border-[1px] ${bracket === '2v2' ? 'border-blue-500' : 'border-gray-300'}  rounded-full w-12 h-12 items-center justify-center`}
                onClick={() => handleClick('2v2')}
            >
                2v2
            </button>
            <button
                className={`flex text-gray-300 border-[1px] ${bracket === 'rbg' ? 'border-blue-500' : 'border-gray-300'}  rounded-full w-12 h-12 items-center justify-center`}
                onClick={() => handleClick('rbg')}
            >
                RBG
            </button>
            {!partofLeadeboard  && (
                <button
                    className={`flex text-gray-300 border-[1px] ${bracket === 'shuffle' ? 'border-blue-500' : 'border-gray-300'}  rounded-full w-12 h-12 items-center justify-center`}
                    disabled={version === 'classic'}
                    onClick={() => handleClick('shuffle')}
                >
                    SFL
                </button>

            )}
        </div>
    );
};

export default BracketSearch;
