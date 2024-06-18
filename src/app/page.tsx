'use client'

import axios from 'axios'

import React, { useEffect, useState } from 'react'
import BarChart from '~/components/BarChart'
import { SearchProvider } from '~/components/Context/SearchContext'
import BracketSearch from '~/components/SearchTab/OtherSearch/BracketSearch'
import RegionSearch from '~/components/SearchTab/OtherSearch/RegionSearch'
import VersionSearch from '~/components/SearchTab/VersionSearch'
import type { IClassStatisticsMap } from '~/utils/helper/classStatisticsMap'
import useURLChange from '~/utils/hooks/useURLChange'

interface wowStatistics {
  id: number,
  classic_eu_rbg: IClassStatisticsMap,
  classic_eu_2v2: IClassStatisticsMap,
  classic_eu_3v3: IClassStatisticsMap,
  classic_us_rbg: IClassStatisticsMap,
  classic_us_2v2: IClassStatisticsMap,
  classic_us_3v3: IClassStatisticsMap,
  retail_eu_rbg: IClassStatisticsMap,
  retail_eu_2v2: IClassStatisticsMap,
  retail_eu_3v3: IClassStatisticsMap,
  retail_us_rbg: IClassStatisticsMap,
  retail_us_2v2: IClassStatisticsMap,
  retail_us_3v3: IClassStatisticsMap,
}
type DataKey = keyof wowStatistics;
type RegionType = 'us' | 'eu';
type BracketType = '3v3' | '2v2' | 'rbg';
type VersionType = 'retail' | 'classic';

type LocalDataMapType = {
  [version in VersionType]: {
    [region in RegionType]: {
      [bracket in BracketType]: string;
    }
  }
};

const localDataMap: LocalDataMapType = {
  retail: {
    us: { '3v3': 'retail_us_3v3', '2v2': 'retail_us_2v2', 'rbg': 'retail_us_rbg' },
    eu: { '3v3': 'retail_eu_3v3', '2v2': 'retail_eu_2v2', 'rbg': 'retail_eu_rbg' },
  },
  classic: {
    us: { '3v3': 'classic_us_3v3', '2v2': 'classic_us_2v2', 'rbg': 'classic_us_rbg' },
    eu: { '3v3': 'classic_eu_3v3', '2v2': 'classic_eu_2v2', 'rbg': 'classic_eu_rbg' }
  }
};

const healerSpecsArray = ['Restoration Druid', 'Holy Paladin', 'Discipline Priest', 'Restoration Shaman', 'Mistweaver Monk', 'Preservation Evoker', 'Holy Priest']

const Home = () => {
  const [data, setData] = useState<wowStatistics | null>(null)
  const [title, setTitle] = useState<string | null>(null)
  const [ratingFilter, setRatingFilter] = useState<string | null>(null)
  const [uniqueRatings, setUniqueRatings] = useState<{ label: string, key: string, total: number }[] | null>(null)
  const [localData, setLocalData] = useState<{ [key: string]: any } | null>(null)
  const queryParams = useURLChange()

  let allClassesCount: number = 0
  let healerSpecsCount: number = 0
  let dpsSpecsCount: number = 0

  const getQueryParams = (): { version: VersionType, region: RegionType, bracket: BracketType } => {
    const params = new URLSearchParams(queryParams ?? '')
    return {
      version: (params.get('version') ?? 'retail') as VersionType,
      region: (params.get('region') ?? 'us') as RegionType,
      bracket: (params.get('bracket') ?? '3v3') as BracketType,
    }
  }

  const classCountMap = new Map<string, number>()
  const healerCountMap = new Map<string, number>()
  const dpsCountMap = new Map<string, number>()
  let countAbove1600 = 0
  let countAbove1800 = 0
  let countAbove2000 = 0
  let countAbove2200 = 0
  let countAbove2400 = 0

  const getFilteredCount = (item: any, filter: string | null) => {
    if (!filter) return item.totalCount;
    const key = `countAbove${filter.replace('+', '')}`;
    return item[key];
  };

  if (localData) {
    for (const className in localData) {
      const classData = localData[className].AllSpecs;
      const classCount = getFilteredCount(classData, ratingFilter);

      allClassesCount += Number(classCount);
      classCountMap.set(className, Number(classCount));

      for (const specName in localData[className]) {
        if (specName === 'AllSpecs') {
          countAbove1600 += Number(classData.countAbove1600);
          countAbove1800 += Number(classData.countAbove1800);
          countAbove2000 += Number(classData.countAbove2000);
          countAbove2200 += Number(classData.countAbove2200);
          countAbove2400 += Number(classData.countAbove2400);
          continue;
        }

        const specData = (localData[className] as any)[specName];
        const specCount = getFilteredCount(specData, ratingFilter);

        if (healerSpecsArray.includes(`${specName} ${className}`)) {
          healerCountMap.set(`${specName} ${className}`, Number(specCount));
          healerSpecsCount += Number(specCount);
        } else {
          dpsCountMap.set(`${specName} ${className}`, Number(specCount));
          dpsSpecsCount += Number(specCount);
        }
      }
    }
  }



  const sortedClassCount = [...classCountMap.entries()].sort((a, b) => b[1] - a[1])
  const sortedHealerCount = [...healerCountMap.entries()].sort((a, b) => b[1] - a[1])
  const sortedDpsCount = [...dpsCountMap.entries()].sort((a, b) => b[1] - a[1])

  const generateUniqueRatings = () => {
    const ratingLevels = [
      { label: '1600+', key: 'countAbove1600', total: countAbove1600 },
      { label: '1800+', key: 'countAbove1800', total: countAbove1800 },
      { label: '2000+', key: 'countAbove2000', total: countAbove2000 },
      { label: '2200+', key: 'countAbove2200', total: countAbove2200 },
      { label: '2400+', key: 'countAbove2400', total: countAbove2400 },
    ];

    const filteredCounts = ratingLevels.filter(count => count.total > 10);

    const uniqueCounts = filteredCounts.reduce((acc, current) => {
      const existing = acc.find(item => item.total === current.total);
      if (existing) {
        // Replace with higher rating if same total value
        if (ratingLevels.indexOf(current) > ratingLevels.indexOf(existing)) {
          const index = acc.indexOf(existing);
          acc[index] = current;
        }
      } else {
        acc.push(current);
      }
      return acc;
    }, [] as { label: string, key: string, total: number }[]);

    return uniqueCounts;
  };

  const clickHandler = (rating: string) => {
    if (rating === ratingFilter) {
      setRatingFilter(null)
    } else {
      setRatingFilter(rating)
    }



  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/api/getWowStatistics')
      setData(response.data)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (data === null) return;
    const { version, region, bracket } = getQueryParams();
    const dataKey = localDataMap[version][region][bracket] as keyof wowStatistics;
    
    const newData = data?.[dataKey];
    
    if (newData && typeof newData === 'object') {
      setTitle(`${version.toUpperCase()} ${region.toUpperCase()} ${bracket.toUpperCase()}`);
      setLocalData(newData as { [key: string]: any });
    } else {
      setLocalData(null);
    }
    
    setRatingFilter(null);
    setUniqueRatings(generateUniqueRatings());
  }, [queryParams, data]);
  
  
  

  const highestClass = sortedClassCount?.[0]?.[1] ?? 0
  const highestHealer = sortedHealerCount?.[0]?.[1] ?? 0
  const highestDps = sortedDpsCount?.[0]?.[1] ?? 0

  return (

    <main className="flex flex-col min-h-screen bg-gradient-to-b from-[#000080] to-black text-white relative gap-4 py-2">
      <div className=' h-20 bg-gray-800 flex flex-coljustify-between px-20 '>
        <RegionSearch partofLeadeboard={false} />
        <VersionSearch />
        <BracketSearch partofLeadeboard={false} />
      </div>
      <div className=' flex h-10 w-full bg-gray-800 rounded-xl justify-between items-center place-content-center '>
        <span className='pl-16'>{title}   {ratingFilter ? ratingFilter : ''}</span>
        <div className='flex h-full  items-center gap-2 px-2 '>
          {uniqueRatings?.map(rating => (
            <div
              key={rating.key}
              className={`flex w-15 h-8 place-content-center items-center select-none cursor-pointer rounded-xl px-1 ${ratingFilter === rating.label ? 'text-gray-800 bg-gray-300' : 'text-gray-300 bg-gray-800 '}`}
              onClick={() => clickHandler(rating.label)}

            >
              {rating.label}
            </div>
          ))}
        </div>
      </div>
      <div className='flex gap-2'>
        <BarChart highestValue={highestClass} sortedArray={sortedClassCount} specificCount={allClassesCount} classChart={true} title='Classes' />
        <div className='flex flex-col w-1/2 h-full pt-2 '>
          <div className='flex flex-col h-10 w-full items-center place-content-center bg-gray-800 rounded-xl'>
            <span>Activity</span>
          </div>
        </div>
      </div>
      <div className='flex gap-2'>
        <BarChart highestValue={highestDps} sortedArray={sortedDpsCount} specificCount={dpsSpecsCount} classChart={false} title='Dps Specs' />
        <BarChart highestValue={highestHealer} sortedArray={sortedHealerCount} specificCount={healerSpecsCount} classChart={false} title='Healer Specs' />
      </div>
    </main >
  )
}

const Homewrapper = () => (
  <SearchProvider>
    <Home />
  </SearchProvider>
);

export default Homewrapper