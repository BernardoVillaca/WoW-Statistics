'use client'

import React, { useEffect, useState } from 'react'
import { SearchProvider } from '~/components/Context/SearchContext'
import ClassDistribution from './Components/classDistribution'
import axios from 'axios'
import RegionSearch from '~/components/SearchTab/OtherSearch/RegionSearch'
import VersionSearch from '~/components/SearchTab/VersionSearch'
import BracketSearch from '~/components/SearchTab/OtherSearch/BracketSearch'
import useURLChange from '~/utils/hooks/useURLChange'
import type { ClassStatisticsMap } from '~/utils/helper/classStatisticsMap'
import SpecDistribution from './Components/SpecDistribution'

export type SearchParams = {
    version: string;
    region: string;
    bracket: string;
}

type MostActiveSpecs = {
    character_class: string;
    character_spec: string;
    played: number;
}

export type ActivityEntry = {
    created_at: string;
} & Record<string, { mostActiveSpecs24h: Record<string, MostActiveSpecs> } | string>;

export type ClassSpecEntry = {
    created_at: string;
} & Record<string, Record<string, ClassStatisticsMap> | string>;

type WowStatisticsResponse = {
    activityData: ActivityEntry[];
    classSpecData: ClassSpecEntry[];
};


type EntryType = {
    AllSpecs: Record<string, number>;
};

const Statistics = () => {
    const [loading, setLoading] = useState(true);
    const [classSpecData, setClassSpecData] = useState<ClassSpecEntry[]>([]);
    const [ratingFilter, setRatingFilter] = useState("totalCount");

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
    const { version, region, bracket } = params;
    const key = `${version}_${region}_${bracket}`;
    const entry = classSpecData[key as keyof typeof classSpecData];

    useEffect(() => {
        setRatingFilter("totalCount");
    }, [queryParams]);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            const response = await axios.get<WowStatisticsResponse>('/api/getWowStatistics');
            setClassSpecData(response.data.classSpecData);
            setLoading(false);
        };
        void getData();
    }, []);

    
    const ratingKeys = entry
        ? Object.keys((Object.values(entry)[0] as EntryType).AllSpecs).filter((key: string) => {
            if (key === "totalCount") return false;

            const totalSum = (Object.values(entry) as EntryType[]).reduce((sum: number, spec: EntryType) => {
                const allSpecs = spec.AllSpecs;
                return sum + (allSpecs[key] ?? 0);
            }, 0);

            return totalSum > 20;
        })
        : [];


    const handleClick = (filter: string) => {
        if (ratingFilter !== filter) return setRatingFilter(filter);
        setRatingFilter("totalCount");
    }

    return (
        <main className="flex min-h-screen text-white relative py-2">
            <div className="flex flex-col w-full gap-4 pt-4">
                <div className='h-20 bg-secondary-light_black flex justify-between px-20 rounded-xl'>
                    <RegionSearch partofLeadeboard={false} />
                    <VersionSearch />
                    <BracketSearch partofLeadeboard={false} />
                </div>
                <div className='flex w-full justify-left gap-2 items-center bg-secondary-light_black h-12 p-2 rounded-lg'>
                    <span>Filter by rating :</span>
                    {ratingKeys.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => handleClick(filter)}
                            className={`w-16 h-8 text-white rounded-lg ${ratingFilter === filter ? 'bg-secondary-navy' : 'border-[1px] border-secondary-gray border-opacity-30'}`}
                        >
                            {filter.replace("countAbove", "") + "+"}
                        </button>
                    ))}
                </div>
                <div className='flex gap-4'>
                    <ClassDistribution params={params} classSpecData={classSpecData} ratingFilter={ratingFilter} loading={loading} />
                    <SpecDistribution params={params} classSpecData={classSpecData} ratingFilter={ratingFilter} title='Ranged Dps' loading={loading} />
                </div>
                <div className='flex gap-4'>
                    <SpecDistribution params={params} classSpecData={classSpecData} ratingFilter={ratingFilter} title='Melee Dps' loading={loading} />
                    <SpecDistribution params={params} classSpecData={classSpecData} ratingFilter={ratingFilter} title='Healer' loading={loading} />
                </div>
            </div>
        </main>
    )
}

const StatisticsWrapper = () => (
    <SearchProvider>
        <Statistics />
    </SearchProvider>
);

export default StatisticsWrapper;
