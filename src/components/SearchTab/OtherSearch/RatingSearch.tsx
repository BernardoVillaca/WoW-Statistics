import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FiLoader } from 'react-icons/fi';

const RatingSearch = () => {
  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(100);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get('/api/getMinMaxRating');
        setMaxRating(response.data.highestRating);
        setMinRating(response.data.lowestRating);
        setMinValue(response.data.lowestRating);
        setMaxValue(response.data.highestRating);
        setIsDataFetched(true);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };
    fetchRatings();
  }, []);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxValue - 1);
    setMinValue(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minValue + 1);
    setMaxValue(value);
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
          min={minRating}
          max={maxRating}
          value={minValue}
          onChange={handleMinChange}
          className='absolute h-10 bg-transparent appearance-none pointer-events-none z-30 w-full'
          style={{ zIndex: minValue > maxRating * 0.5 ? '40' : '30' }}
        />
        <input
          type='range'
          min={minRating}
          max={maxRating}
          value={maxValue}
          onChange={handleMaxChange}
          className='absolute h-10 bg-transparent appearance-none pointer-events-none z-40 w-full'
          style={{ zIndex: maxValue <= maxRating * 0.5 ? '40' : '30' }}
        />
        <div className='absolute w-full h-1 bg-gray-300 rounded-lg top-1/2 transform -translate-y-1/2'></div>
        <div
          className='absolute h-1 bg-blue-500 rounded-lg top-1/2 transform -translate-y-1/2'
          style={{
            left: `${((minValue - minRating) / (maxRating - minRating)) * 100}%`,
            width: `${((maxValue - minValue) / (maxRating - minRating)) * 100}%`,
          }}
        ></div>
      </div>
      <div className='flex justify-between w-full'>
        <span className='text-sm text-gray-300'>{minValue}</span>
        <span className='text-sm text-gray-300'>{maxValue}</span>
      </div>
    </div>
  );
}

export default RatingSearch;
