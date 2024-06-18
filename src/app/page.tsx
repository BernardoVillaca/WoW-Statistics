'use client'

import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { SearchProvider } from '~/components/Context/SearchContext'
import BracketSearch from '~/components/SearchTab/OtherSearch/BracketSearch'
import RegionSearch from '~/components/SearchTab/OtherSearch/RegionSearch'
import VersionSearch from '~/components/SearchTab/VersionSearch'
import { classicEu2v2Leaderboard, classicEu3v3Leaderboard, classicEuRBGLeaderboard, classicUs2v2Leaderboard, classicUs3v3Leaderboard, classicUsRBGLeaderboard, eu3v3Leaderboard, us2v2Leaderboard, us3v3Leaderboard, usRBGLeaderboard } from '~/server/db/schema'
import classIconsMap from '~/utils/helper/classIconsMap'
import type { IClassStatisticsMap } from '~/utils/helper/classStatisticsMap'
import specIconsMap from '~/utils/helper/specIconsMap'
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

const localDataMap = {
  retail: {
    us: {
      '3v3': 'retail_us_3v3',
      '2v2': 'retail_us_2v2',
      'rbg': 'retail_us_rbg',

    },
    eu: {
      '3v3': 'retail_eu_3v3',
      '2v2': 'retail_eu_2v2',
      'rbg': 'retail_eu_rbg',
    },
    
  },
  classic: {
    us: {
      '3v3': 'classic_us_3v3',
      '2v2': 'classic_us_2v2',
      'rbg': 'classic_us_rbg',
    },
    eu: {
      '3v3': 'classic_eu_3v3',
      '2v2': 'classic_eu_2v2',
      'rbg': 'classic_eu_rbg',
    }
  }
}


const healerSpecsArray = ['Restoration Druid', 'Holy Paladin', 'Discipline Priest', 'Restoration Shaman', 'Mistweaver Monk', 'Preservation Evoker', 'Holy Priest']

const Home = () => {
  const [data, setData] = useState<wowStatistics | null>(null)
  const [localData, setLocalData] = useState(null)
  const queryParams = useURLChange()


  let allClassesCount: number = 0
  let healerSpecsCount: number = 0
  let dpsSpecsCount: number = 0

  const getQueryParams = () => {
    const params = new URLSearchParams(queryParams ?? '');
    return {
      version: params.get('version') ?? 'retail',
      region: params.get('region') ?? 'us',
      bracket: params.get('bracket') ?? '3v3',
    };
  };

  const classCountMap = new Map<string, number>()
  const healerCountMap = new Map<string, number>()
  const dpsCountMap = new Map<string, number>()

  for (const className in localData) {
    allClassesCount += Number(localData[className]?.AllSpecs?.totalCount)
    classCountMap.set(className, Number(localData[className]?.AllSpecs?.totalCount))

    for (const specName in localData[className]) {
      if (specName === 'AllSpecs') continue
      if (healerSpecsArray.includes(`${specName} ${className}`)) {
        healerCountMap.set(`${specName} ${className}`, Number((localData[className] as any)[specName]?.totalCount))
        healerSpecsCount += Number((localData[className] as any)[specName]?.totalCount)
        continue
      }
      dpsCountMap.set(`${specName} ${className}`, Number((localData[className] as any)[specName]?.totalCount))
      dpsSpecsCount += Number((localData[className] as any)[specName]?.totalCount)
    }
  }

  const sortedClassCount = [...classCountMap.entries()].sort((a, b) => b[1] - a[1])
  const sortedHealerCount = [...healerCountMap.entries()].sort((a, b) => b[1] - a[1])
  const sortedDpsCount = [...dpsCountMap.entries()].sort((a, b) => b[1] - a[1])

  useEffect(() => {

    const getData = async () => {
      const responde = await axios.get('/api/getWowStatistics')
      const { version, region, bracket } = getQueryParams();
      const dataKey = localDataMap[version][region][bracket];
      setLocalData(responde.data[dataKey])
    }
    getData()

  }, [queryParams])





  const highestClass = sortedClassCount?.[0]?.[1]
  const highestHealer = sortedHealerCount?.[0]?.[1]
  const highestDps = sortedDpsCount?.[0]?.[1]

  const minWidth = 15
  return (

    <main className="flex flex-col min-h-screen bg-gradient-to-b from-[#000080] to-black text-white relative gap-2 py-2">
      <div className=' h-20 bg-gray-800 flex flex-coljustify-between px-20'>
        <RegionSearch partofLeadeboard={false} />
        <VersionSearch />
        <BracketSearch partofLeadeboard={false} />
      </div>
      <div className='flex'>
        <div className='flex flex-col w-1/2 h-full gap-1 pt-2 px-2'>
          <div className='flex flex-col h-10 w-full items-center place-content-center bg-gray-800 rounded-xl'>
            <span>Classes</span>
          </div>
          {highestClass && sortedClassCount.map(([className, count]) => {
            const width = Math.max((count / highestClass) * 100, minWidth);
            return (
              <div key={className} style={{ width: `${width}%` }} className='flex bg-gray-700 h-8 items-center justify-between rounded-r-lg px-2'>
                <Image
                  src={classIconsMap[className as keyof typeof classIconsMap]}
                  alt={className}
                  width={18}
                  className="rounded-lg overflow-hidden"
                />
                <span>{Math.trunc(count * 100 / allClassesCount)}%</span>
              </div>
            );
          })}
        </div>
        <div className='flex flex-col w-1/2 h-full gap-1 pt-2 '>
          <div className='flex flex-col h-10 w-full items-center place-content-center bg-gray-800 rounded-xl'>
            <span>Activity</span>
          </div>
        </div>
      </div>
      <div className='flex'>
        <div className='flex flex-col w-1/2 h-full gap-1 pt-2 '>
          <div className='flex flex-col h-10 w-full items-center place-content-center bg-gray-800 rounded-xl'>
            <span>Dps Specs</span>
          </div>
          <div className='flex flex-col w-full gap-1 py-2 px-1'>
            {highestDps && sortedDpsCount.slice(0, 10).map(([specClassName, count]) => {
              const width = Math.max((count / highestDps) * 100, minWidth);
              return (

                <div key={specClassName} style={{ width: `${width}%` }} className='flex bg-gray-700 h-8 items-center justify-between rounded-r-lg px-2'>
                  <Image
                    src={specIconsMap[specClassName as keyof typeof specIconsMap]}
                    alt={specClassName}
                    width={18}
                    className="rounded-lg overflow-hidden"
                  />
                  <span>{Math.trunc(count * 100 / dpsSpecsCount)}%</span>
                </div>
              )
            })}
          </div>
        </div>
        <div className='flex flex-col w-1/2 h-full  gap-1 pt-2 px-2'>
          <div className='flex h-10 w-full items-center place-content-center bg-gray-800 rounded-xl'>
            <span>Healer Specs</span>
          </div>
          <div className='flex flex-col w-full gap-1 py-2 px-1'>
            {highestHealer && sortedHealerCount.slice(0, 10).map(([specClassName, count]) => {
              const width = Math.max((count / highestHealer) * 100, minWidth);
              return (
                <div key={specClassName} style={{ width: `${width}%` }} className='flex bg-gray-700 h-8 items-center justify-between rounded-r-lg px-2'>
                  <Image
                    src={specIconsMap[specClassName as keyof typeof specIconsMap]}
                    alt={specClassName}
                    width={18}
                    className="rounded-lg overflow-hidden"
                  />
                  <span>{Math.trunc(count * 100 / healerSpecsCount)}%</span>
                </div>
              )
            })}
          </div>
        </div>
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