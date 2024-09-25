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
    }, [bracket, setCurrentPage]);

    return (
        <div className={`flex items-center  px-4 justify-between ${partofLeadeboard ? 'w-1/5 border-[1px] border-opacity-30 border-secondary-gray' : 'w-[400px]'}  rounded-lg  select-none`}>
            <button
                className={`flex ${bracket === '3v3' ? ' bg-secondary-navy ' : 'border-[1px] border-opacity-30 border-secondary-gray'}  rounded-full w-8 h-8 text-sm 2xl:w-12 2xl:h-12 2xl:text-base items-center justify-center`}
                onClick={() => handleClick('3v3')}
            >
                3v3
            </button>
            <button
                className={`flex ${bracket === '2v2' ? ' bg-secondary-navy ' : 'border-[1px] border-opacity-30 border-secondary-gray'}  rounded-full w-8 h-8 text-sm 2xl:w-12 2xl:h-12 2xl:text-base items-center justify-center`}
                onClick={() => handleClick('2v2')}
            >
                2v2
            </button>
            <button
                className={`flex ${bracket === 'rbg' ? ' bg-secondary-navy ' : 'border-[1px] border-opacity-30 border-secondary-gray'}  rounded-full w-8 h-8 text-sm 2xl:w-12 2xl:h-12 2xl:text-base items-center justify-center`}
                onClick={() => handleClick('rbg')}
            >
                Rbg
            </button>
            {!partofLeadeboard  && (
                <button
                    className={`flex ${bracket === 'shuffle' ? ' bg-secondary-navy ' : 'border-[1px] border-opacity-30 border-secondary-gray'} rounded-full w-8 h-8 text-sm 2xl:w-12 2xl:h-12 2xl:text-base items-center justify-center`}
                    disabled={version === 'classic'}
                    onClick={() => handleClick('shuffle')}
                >
                    Sfl
                </button>

            )}
        </div>
    );
};

export default BracketSearch;
