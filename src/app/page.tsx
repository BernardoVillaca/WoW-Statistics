'use client'

import axios from 'axios'

import React, { useEffect, useState } from 'react'
import ActivityChart from '~/components/ActivityChart'
import BarChart from '~/components/BarChart'
import { SearchProvider } from '~/components/Context/SearchContext'
import BracketSearch from '~/components/SearchTab/OtherSearch/BracketSearch'
import RegionSearch from '~/components/SearchTab/OtherSearch/RegionSearch'
import VersionSearch from '~/components/SearchTab/VersionSearch'
import type { ActivityMap, ActivityStatistics } from '~/utils/helper/activityMap'
import type { ClassStatisticsMap, ISpecStatistics } from '~/utils/helper/classStatisticsMap'
import useURLChange from '~/utils/hooks/useURLChange'

interface ClassSpecData {
  id: number,
  classic_eu_rbg: ClassStatisticsMap,
  classic_eu_2v2: ClassStatisticsMap,
  classic_eu_3v3: ClassStatisticsMap,
  classic_us_rbg: ClassStatisticsMap,
  classic_us_2v2: ClassStatisticsMap,
  classic_us_3v3: ClassStatisticsMap,
  retail_eu_rbg: ClassStatisticsMap,
  retail_eu_2v2: ClassStatisticsMap,
  retail_eu_3v3: ClassStatisticsMap,
  retail_us_rbg: ClassStatisticsMap,
  retail_us_2v2: ClassStatisticsMap,
  retail_us_3v3: ClassStatisticsMap,
}

interface ActivityData {
  id: number;
  classic_eu_rbg: ActivityMap,
  classic_eu_2v2: ActivityMap,
  classic_eu_3v3: ActivityMap,
  classic_us_rbg: ActivityMap,
  classic_us_2v2: ActivityMap,
  classic_us_3v3: ActivityMap,
  retail_eu_rbg: ActivityMap,
  retail_eu_2v2: ActivityMap,
  retail_eu_3v3: ActivityMap,
  retail_us_rbg: ActivityMap,
  retail_us_2v2: ActivityMap,
  retail_us_3v3: ActivityMap,

}


type RegionType = 'us' | 'eu';
type BracketType = '3v3' | '2v2' | 'rbg' | 'shuffle'
type VersionType = 'retail' | 'classic';

type LocalDataMapType = Record<VersionType, Record<RegionType, Record<BracketType, string | null>>>;

const localDataMap: LocalDataMapType = {
  retail: {
    us: { '3v3': 'retail_us_3v3', '2v2': 'retail_us_2v2', 'rbg': 'retail_us_rbg', 'shuffle': 'retail_us_shuffle' },
    eu: { '3v3': 'retail_eu_3v3', '2v2': 'retail_eu_2v2', 'rbg': 'retail_eu_rbg', 'shuffle': 'retail_eu_shuffle' },
  },
  classic: {
    us: { '3v3': 'classic_us_3v3', '2v2': 'classic_us_2v2', 'rbg': 'classic_us_rbg', 'shuffle': null },
    eu: { '3v3': 'classic_eu_3v3', '2v2': 'classic_eu_2v2', 'rbg': 'classic_eu_rbg', 'shuffle': null },
  }
};

const healerSpecsArray = ['Restoration Druid', 'Holy Paladin', 'Discipline Priest', 'Restoration Shaman', 'Mistweaver Monk', 'Preservation Evoker', 'Holy Priest']

const Home = () => {
  const [classSpecData, setClassSpecData] = useState<ClassSpecData | null>(null)
  const [localClassSpecData, setLocalClassSpecData] = useState<ClassStatisticsMap | null>(null)

  const [activityData, setActivityData] = useState<ActivityData | null>(null)
  const [localActivityData, setLocalActivityData] = useState<ActivityStatistics | null>(null)

  const [title, setTitle] = useState<string | null>(null)
  const [ratingFilter, setRatingFilter] = useState<string | null>(null)
  const [uniqueRatings, setUniqueRatings] = useState<{ label: string, key: string, total: number }[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const queryParams = useURLChange()

  let allClassesCount = 0
  let healerSpecsCount = 0
  let dpsSpecsCount = 0

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
  let totalCount = 0
  let countAbove1600 = 0
  let countAbove1800 = 0
  let countAbove2000 = 0
  let countAbove2200 = 0
  let countAbove2400 = 0
  let countAbove2600 = 0
  let countAbove2800 = 0

  const getFilteredCount = (item: ISpecStatistics, filter: string | null): number => {
    if (!filter) return item.totalCount;
    const key = `countAbove${filter.replace('+', '')}` as keyof ISpecStatistics;
    return item[key];
  };

  if (localClassSpecData) {
    for (const className in localClassSpecData) {
      const classData = localClassSpecData?.[className]?.AllSpecs
      if (!classData) continue
      const classCount = getFilteredCount(classData, ratingFilter);

      allClassesCount += Number(classCount);
      classCountMap.set(className, Number(classCount));

      for (const specName in localClassSpecData[className]) {
        if (specName === 'AllSpecs') {
          totalCount += Number(classData?.totalCount);
          countAbove1600 += Number(classData?.countAbove1600);
          countAbove1800 += Number(classData?.countAbove1800);
          countAbove2000 += Number(classData?.countAbove2000);
          countAbove2200 += Number(classData?.countAbove2200);
          countAbove2400 += Number(classData?.countAbove2400);
          countAbove2600 += Number(classData?.countAbove2600);
          countAbove2800 += Number(classData?.countAbove2800);
          continue;
        }

        const specData = localClassSpecData?.[className]?.[specName]
        if (!specData) continue
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
      { label: '2600+', key: 'countAbove2600', total: countAbove2600 },
      { label: '2800+', key: 'countAbove2800', total: countAbove2800 },
    ];

    const filteredCounts = ratingLevels.filter(count => count.total > 5 && count.total !== totalCount);

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



  const onClickHandler = (rating: string) => {
    if (rating === ratingFilter) {
      setRatingFilter(null)
    } else {
      setRatingFilter(rating)
    }
  }
  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      const response = await axios.get<{ classSpecData: ClassSpecData }>('/api/getWowStatistics')
      setClassSpecData(response.data.classSpecData)
      setLoading(false)
    }
    void fetchData()
  }, [])

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      const response = await axios.get<{ classSpecData: ClassSpecData, activityData: ActivityData }>('/api/getWowStatistics')
      setClassSpecData(response.data.classSpecData)
      setActivityData(response.data.activityData)
      setLoading(false)
    }
    void fetchData()
  }, [])

  useEffect(() => {
    if (classSpecData === null) return;
    const { version, region, bracket } = getQueryParams();

    const classSpecdataKey = localDataMap[version][region][bracket] as keyof ClassSpecData;
    const activityDataKey = localDataMap[version][region][bracket] as keyof ActivityData;

    const newActivityData = activityData?.[activityDataKey] as ActivityStatistics | undefined;
    const newClassSpecData = classSpecData?.[classSpecdataKey];

    if (newClassSpecData && typeof newClassSpecData === 'object') {
      setTitle(`${version.toUpperCase()} ${region.toUpperCase()} ${bracket.toUpperCase()}`);
      setLocalClassSpecData(newClassSpecData);
    } else {
      setLocalClassSpecData(null);
    }

    if (newActivityData) {
      setLocalActivityData(newActivityData);
    } else {
      setLocalActivityData(null);
    }

    setRatingFilter(null);
  }, [queryParams, classSpecData, activityData]);


  useEffect(() => {
    setUniqueRatings(generateUniqueRatings());
  }, [localClassSpecData]);

  const highestClass = sortedClassCount?.[0]?.[1] ?? 0
  const highestHealer = sortedHealerCount?.[0]?.[1] ?? 0
  const highestDps = sortedDpsCount?.[0]?.[1] ?? 0

  return (

    <main className="flex flex-col min-h-screen bg-gradient-to-b from-[#000080] to-black text-white relative gap-4 py-2">
      <div className=' h-20 bg-gray-800 flex flex-coljustify-between px-20 rounded-xl'>
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
              onClick={() => onClickHandler(rating.label)}
            >
              {rating.label}
            </div>
          ))}
        </div>
      </div>
      <div className='flex gap-2'>
        <BarChart highestValue={highestClass} sortedArray={sortedClassCount} specificCount={allClassesCount} classChart={true} title='Classes' loading={loading} />
        <BarChart highestValue={highestDps} sortedArray={sortedDpsCount} specificCount={dpsSpecsCount} classChart={false} title='Dps Specs' loading={loading} />
        <BarChart highestValue={highestHealer} sortedArray={sortedHealerCount} specificCount={healerSpecsCount} classChart={false} title='Healer Specs' loading={loading} />
      </div>
      <div className='flex gap-2'>
        {localActivityData && <ActivityChart localActivityData={localActivityData} />}
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