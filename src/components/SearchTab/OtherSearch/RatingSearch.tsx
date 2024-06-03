import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { FiLoader } from 'react-icons/fi';

import { useSearch } from '~/components/Context/SearchContext';
import useDebounce from '~/hooks/useDebounce';

const RatingSearch = () => {
  const {
    minRatingSearch,
    setMinRatingSearch,
    maxRatingSearch,
    setMaxRatingSearch,
    minRating,
    setMinRating,
    maxRating,
    setMaxRating
  } = useSearch();

  const [minInputValue, setMinInputValue] = useState(minRatingSearch);
  const [maxInputValue, setMaxInputValue] = useState(maxRatingSearch);

  const [isDataFetched, setIsDataFetched] = useState(false);

  const initialLoad = useRef(true);

  const debouncedMinInputValue = useDebounce(minInputValue, 1000);
  const debouncedMaxInputValue = useDebounce(maxInputValue, 1000);

  useEffect(() => {
    if (!initialLoad.current) {
      setMinRatingSearch(debouncedMinInputValue.toString());
    }
  }, [debouncedMinInputValue]);

  useEffect(() => {
    if (!initialLoad.current) {
      setMaxRatingSearch(debouncedMaxInputValue.toString());
    }
  }, [debouncedMaxInputValue]);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get('/api/getMinMaxRating');
        setMaxRating(response.data.highestRating);
        setMinRating(response.data.lowestRating);
        setMinInputValue(response.data.lowestRating);
        setMaxInputValue(response.data.highestRating);
        setIsDataFetched(true);
        initialLoad.current = false;
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };
    if (initialLoad.current) {
      fetchRatings();
    }
  }, []);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), Number(maxInputValue) - 1);
    setMinInputValue(value.toString());
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), Number(minInputValue) + 1);
    setMaxInputValue(value.toString());
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
          style={{ zIndex: Number(minInputValue) > Number(maxRating) * 0.5 ? '40' : '30' }}
        />
        <input
          type='range'
          min={minRating}
          max={maxRating}
          value={maxInputValue}
          onChange={handleMaxChange}
          className='absolute h-10 bg-transparent appearance-none pointer-events-none z-40 w-full'
          style={{ zIndex: Number(maxInputValue) <= Number(maxRating) * 0.5 ? '40' : '30' }}
        />
        <div className='absolute w-full h-1 bg-gray-300 rounded-lg top-1/2 transform -translate-y-1/2'></div>
        <div
          className='absolute h-1 bg-blue-500 rounded-lg top-1/2 transform -translate-y-1/2'
          style={{
            left: `${((Number(minInputValue) - Number(minRating)) / (Number(maxRating) - Number(minRating))) * 100}%`,
            width: `${((Number(maxInputValue) - Number(minInputValue)) / (Number(maxRating) - Number(minRating))) * 100}%`,
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
