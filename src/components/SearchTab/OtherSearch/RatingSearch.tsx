import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FiLoader } from 'react-icons/fi';
import { useSearch } from '~/components/Context/SearchContext';
import useDebounce from '~/hooks/useDebounce';

const RatingSearch = () => {
  const { minRating, setMinRating, maxRating, setMaxRating, maxInitialRating, setMaxInitialRating, minInitialRating, setMinInitialRating } = useSearch();
  const [minInputValue, setMinInputValue] = useState(minRating);
  const [maxInputValue, setMaxInputValue] = useState(maxRating);
  const [isDataFetched, setIsDataFetched] = useState(false);
  
  const debouncedMinRating = useDebounce(minInputValue, 1000);
  const debouncedMaxRating = useDebounce(maxInputValue, 1000);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get('/api/getMinMaxRating');
        setMaxInitialRating(response.data.highestRating);
        setMinInitialRating(response.data.lowestRating);
        setMinInputValue(response.data.lowestRating);
        setMaxInputValue(response.data.highestRating);
        setIsDataFetched(true);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };
    fetchRatings();
  }, [minInitialRating, maxInitialRating]);

  useEffect(() => {
    if (debouncedMinRating !== minRating) {
      setMinRating(debouncedMinRating);
    }
    if (debouncedMaxRating !== maxRating) {
      setMaxRating(debouncedMaxRating);
    }
  }, [debouncedMinRating, debouncedMaxRating]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxRating - 1);
    setMinInputValue(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minRating + 1);
    setMaxInputValue(value);
  };

  if (!isDataFetched) {
    return <div className='flex flex-col items-center justify-center w-1/5 p-4 rounded-lg border border-gray-700'>
      <FiLoader className="animate-spin text-white" size={50} />
    </div>;
  }

  return (
    <div className='flex flex-col items-center justify-center w-1/5 p-4 rounded-lg border border-gray-700'>
      <div className='relative w-full h-10'>
        <input
          type='range'
          min={minInitialRating}
          max={maxInitialRating}
          value={minInputValue}
          onChange={handleMinChange}
          className='absolute h-10 bg-transparent appearance-none pointer-events-none z-30 w-full'
          style={{ zIndex: minRating > maxInitialRating * 0.5 ? '40' : '30' }}
        />
        <input
          type='range'
          min={minInitialRating}
          max={maxInitialRating}
          value={maxInputValue}
          onChange={handleMaxChange}
          className='absolute h-10 bg-transparent appearance-none pointer-events-none z-40 w-full'
          style={{ zIndex: maxInputValue <= maxInputValue * 0.5 ? '40' : '30' }}
        />
        <div className='absolute w-full h-1 bg-gray-300 rounded-lg top-1/2 transform -translate-y-1/2'></div>
        <div
          className='absolute h-1 bg-blue-500 rounded-lg top-1/2 transform -translate-y-1/2'
          style={{
            left: `${((minInputValue - minInitialRating) / (maxInitialRating - minInitialRating)) * 100}%`,
            width: `${((maxInputValue - minInputValue) / (maxInitialRating - minInitialRating)) * 100}%`,
          }}
        ></div>
      </div>
      <div className='flex justify-between w-full'>
        <span className='text-sm text-gray-300'>{minInputValue}</span>
        <span className='text-sm text-gray-300'>{maxInputValue}</span>
      </div>
    </div>
  );
}

export default RatingSearch;
