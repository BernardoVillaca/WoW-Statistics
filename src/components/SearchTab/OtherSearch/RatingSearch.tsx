import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FiLoader } from 'react-icons/fi';
import { useSearch } from '~/components/Context/SearchContext';
import { updateURLParameter } from '~/utils/helper/updateURL';
import useDebounce from '~/utils/hooks/useDebounce';
import useURLChange from '~/utils/hooks/useURLChange';

const RatingSearch = () => {
    const queryParams = useURLChange();
    const { setCurrentPage } = useSearch();

    const [minRatingSearch, setMinRatingSearch] = useState(0);
    const [maxRatingSearch, setMaxRatingSearch] = useState(4000);
    const [minRating, setMinRating] = useState(0);
    const [maxRating, setMaxRating] = useState(4000);
    const [minInputValue, setMinInputValue] = useState(0);
    const [maxInputValue, setMaxInputValue] = useState(4000);
    const [isDataFetched, setIsDataFetched] = useState(false);

    const debouncedMinInputValue = useDebounce(minInputValue, 1000);
    const debouncedMaxInputValue = useDebounce(maxInputValue, 1000);

    const getQueryParams = () => {
        const params = new URLSearchParams(queryParams || '');
        return {
            version: params.get('version') || 'retail',
            region: params.get('region') || 'us',
            bracket: params.get('bracket') || '3v3',
        };
    };

    const { version, region, bracket } = getQueryParams();

    const fetchRatings = async () => {
        try {
            const { version, region, bracket } = getQueryParams();
            const response = await axios.get(`/api/getMinMaxRating`, {
                params: { version, region, bracket }
            });
            const { highestRating, lowestRating } = response.data;
            setMinRating(lowestRating);
            setMaxRating(highestRating);
            setMinInputValue(lowestRating);
            setMaxInputValue(highestRating);
            setIsDataFetched(true);
        } catch (error) {
            console.error('Error fetching ratings:', error);
        }
    };

    useEffect(() => {
        fetchRatings();
    }, [version, region, bracket]);

    useEffect(() => {
        setMinRatingSearch(debouncedMinInputValue);
        setMaxRatingSearch(debouncedMaxInputValue);
    }, [debouncedMinInputValue, debouncedMaxInputValue]);

    useEffect(() => {
        const isInitialLoad = !queryParams;
        updateURLParameter('minRating', minRatingSearch === minRating ? '' : minRatingSearch.toString(), true, false);
        updateURLParameter('maxRating', maxRatingSearch === maxRating ? '' : maxRatingSearch.toString(), true, false);
        if (!isInitialLoad) {
            setCurrentPage(1);
        }
    }, [minRatingSearch, maxRatingSearch]);

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(Number(e.target.value), maxInputValue - 1);
        setMinInputValue(value);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(Number(e.target.value), minInputValue + 1);
        setMaxInputValue(value);
    };

    if (!isDataFetched) {
        return (
            <div className='flex flex-col items-center justify-center w-1/5 p-4 rounded-lg border border-gray-700'>
                <FiLoader className="animate-spin text-white" size={50} />
            </div>
        );
    }

    return (
        <div className='flex flex-col items-center justify-center w-1/5 p-4 rounded-lg border border-gray-700'>
            <div className='relative w-full h-10'>
                <input
                    type='range'
                    min={minRating}
                    max={maxRating}
                    value={minInputValue}
                    onChange={handleMinChange}
                    className='absolute h-10 bg-transparent appearance-none pointer-events-none z-30 w-full'
                    style={{ zIndex: minInputValue > maxRating * 0.5 ? '40' : '30' }}
                />
                <input
                    type='range'
                    min={minRating}
                    max={maxRating}
                    value={maxInputValue}
                    onChange={handleMaxChange}
                    className='absolute h-10 bg-transparent appearance-none pointer-events-none z-40 w-full'
                    style={{ zIndex: maxInputValue <= maxRating * 0.5 ? '40' : '30' }}
                />
                <div className='absolute w-full h-1 bg-gray-300 rounded-lg top-1/2 transform -translate-y-1/2'></div>
                <div
                    className='absolute h-1 bg-blue-500 rounded-lg top-1/2 transform -translate-y-1/2'
                    style={{
                        left: `${((minInputValue - minRating) / (maxRating - minRating)) * 100}%`,
                        width: `${((maxInputValue - minInputValue) / (maxRating - minRating)) * 100}%`,
                    }}
                ></div>
            </div>
            <div className='flex justify-between w-full'>
                <span className='text-sm text-gray-300'>{minInputValue}</span>
                <span className='text-sm text-gray-300'>{maxInputValue}</span>
            </div>
        </div>
    );
};

export default RatingSearch;
