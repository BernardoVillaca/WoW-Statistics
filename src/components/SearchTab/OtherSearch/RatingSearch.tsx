import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FiLoader } from 'react-icons/fi';
import { useSearch } from '~/components/Context/SearchContext';
import { updateURL } from '~/utils/helper/updateURL';
import useURLChange from '~/utils/hooks/useURLChange';

interface RatingResponse {
  highestRating: number;
  lowestRating: number;
}

const RatingSearch: React.FC = () => {
  const { setCurrentPage } = useSearch();
  const queryParams = useURLChange();

  const getQueryParams = () => {
    const params = new URLSearchParams(queryParams ?? '');
    return {
      version: params.get('version') ?? 'retail',
      region: params.get('region') ?? 'us',
      bracket: params.get('bracket') ?? '3v3',
      minRating: Number(params.get('minRating') ?? 0),
      maxRating: Number(params.get('maxRating') ?? 4000),
    };
  };

  const { version, region, bracket, minRating, maxRating } = getQueryParams();

  const [minSliderValue, setMinSliderValue] = useState<number>(0);
  const [maxSliderValue, setMaxSliderValue] = useState<number>(0);
  const [minInputValue, setMinInputValue] = useState<number>(0);
  const [maxInputValue, setMaxInputValue] = useState<number>(0);
  const [isDataFetched, setIsDataFetched] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchRatings = async () => {
      try {
        const response = await axios.get<RatingResponse>('/api/getMinMaxRating', {
          params: { version, region, bracket },
        });
        const { highestRating, lowestRating } = response.data;
        if (isMounted) {
          setMinSliderValue(lowestRating);
          setMaxSliderValue(highestRating);
          setMinInputValue(Math.max(minRating, lowestRating));
          setMaxInputValue(Math.min(maxRating, highestRating));
          setIsDataFetched(true);
        }
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };

    void fetchRatings();

    return () => {
      isMounted = false;
    };
  }, [version, region, bracket]);

  useEffect(() => {
    setMinInputValue(minSliderValue);
    setMaxInputValue(maxSliderValue);
    updateURL('minRating', '', true);
    updateURL('maxRating', '', true);
  }, [minSliderValue, maxSliderValue]);


  // Debounce the input change to avoid too many URL updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (minInputValue || maxInputValue) {
        updateURL('maxRating', maxInputValue === maxSliderValue ? '' : maxInputValue.toString(), true);
        updateURL('minRating', minInputValue === minSliderValue ? '' : minInputValue.toString(), true);
        setCurrentPage(1);
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [minInputValue, maxInputValue, maxSliderValue, minSliderValue, setCurrentPage]);
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
      <div className="flex flex-col items-center justify-center w-1/5 p-4 rounded-lg border-[1px] border-opacity-30 border-secondary-gray">
        <FiLoader className="animate-spin text-white" size={50} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-1/5 p-4 rounded-lg border-[1px] border-opacity-30 border-secondary-gray">
      <div className="relative w-full h-10">
        <input
          type="range"
          min={minSliderValue}
          max={maxSliderValue}
          value={minInputValue}
          onChange={handleMinChange}
          className="absolute h-10 bg-transparent pointer-events-none z-30 w-full"
          style={{ zIndex: minInputValue > maxSliderValue * 0.5 ? '40' : '30' }}
        />
        <input
          type="range"
          min={minSliderValue}
          max={maxSliderValue}
          value={maxInputValue}
          onChange={handleMaxChange}
          className="absolute h-10 bg-transparent pointer-events-none z-40 w-full"
          style={{ zIndex: maxInputValue <= maxSliderValue * 0.5 ? '40' : '30' }}
        />
        <div className="absolute w-full h-1 bg-secondary-gray rounded-lg top-1/2 transform -translate-y-1/2"></div>
        <div
          className="absolute h-1 bg-primary rounded-lg top-1/2 transform -translate-y-1/2"
          style={{
            left: `${((minInputValue - minSliderValue) / (maxSliderValue - minSliderValue)) * 100}%`,
            width: `${((maxInputValue - minInputValue) / (maxSliderValue - minSliderValue)) * 100}%`,
          }}
        ></div>
      </div>
      <div className="flex justify-between w-full">
        <span className="text-sm">{minInputValue}</span>
        <span className="text-sm">{maxInputValue}</span>
      </div>
    </div>
  );
};

export default RatingSearch;
