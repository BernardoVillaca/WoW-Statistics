'use client'

import axios from 'axios';
import { ChartData } from 'chart.js';
import { min } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';
import { FiLoader } from 'react-icons/fi';
import useURLChange from '~/utils/hooks/useURLChange';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
} from 'chart.js';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
);

type RatingBrackets = Record<string, number>;

type ActivityEntry = {
    created_at: string;
    [key: string]: {
        ratingBrackets: RatingBrackets;
    } | string;
}

type WowStatisticsResponse = {
    activityHistory: ActivityEntry[];
};

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};


const ActivityByRating = () => {

    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(0);
    const [sortedRatings, setSortedRatings] = useState<number[]>([]);

    const [path, setPath] = useState<string>('');
    const [data, setData] = useState<ActivityEntry[]>([]);
    const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);
    const [graphLoading, setGraphLoading] = useState(true);


    const queryParams = useURLChange();

    const getQueryParams = () => {
        const params = new URLSearchParams(queryParams ?? '');
        return {
            resultsPerPage: 10,
            path: path,
            version: params.get('version') ?? 'retail',
            region: params.get('region') ?? 'us',
            bracket: params.get('bracket') ?? '3v3',
            page: params.get('page') ?? 1
        };
    };
    const params = getQueryParams();
    const { version, region, bracket } = params;

    useEffect(() => {
        setPath(window.location.pathname);
        const getData = async () => {
            const response = await axios.get<WowStatisticsResponse>('/api/getWowStatistics?history=true');
            setData(response.data.activityHistory);
        };
        void getData();
    }, []);


    useEffect(() => {

        if (data.length > 0) {

            // Set the possible ratings for search
            // const key = `${version}_${region}_${bracket}` as keyof ActivityEntry;
            // const ratingBrackets = typeof data[0]?.[key] === 'object' ? data[0]?.[key].ratingBrackets : undefined;
            // const uniqueRatings = [];
            // let previousValue = null;


            // if (!ratingBrackets) return
            // const reversedKeys = Object.keys(ratingBrackets).reverse();


            // for (const key of reversedKeys) {
            //     const ratingValue = ratingBrackets[key];
            //     const ratingNumber = parseInt(key.replace("above", ""), 10);

            //     if (ratingValue !== previousValue) {
            //         uniqueRatings.push(ratingNumber);
            //         previousValue = ratingValue;
            //     }
            // }

            // const reversedRatings = uniqueRatings.reverse();

            // setSortedRatings(reversedRatings);

            const labels = data.map(entry => new Date(entry.created_at));
            const values = data.map(entry => {
                const key = `${params.version}_${params.region}_${params.bracket}` as keyof ActivityEntry;
                const value = entry[key];
                if (minValue === 0 && maxValue === 0) {
                    if (typeof value === 'object' && 'total24h' in value) {
                        return (value as { total24h: number }).total24h;
                    };
                };
                // if (minValue !== 0 && maxValue !== 0) {
                //     const minKey = `above${minValue}` as keyof RatingBrackets;
                //     const maxKey = `above${maxValue}` as keyof RatingBrackets;
                //     if (
                //         typeof value === 'object' &&
                //         value.ratingBrackets && // Check if ratingBrackets is defined
                //         minKey in value.ratingBrackets &&
                //         maxKey in value.ratingBrackets
                //     ) {
                //         return value.ratingBrackets && value.ratingBrackets[maxKey] !== undefined && value.ratingBrackets[minKey] !== undefined
                //             ? Math.abs(value.ratingBrackets[maxKey] - value.ratingBrackets[minKey])
                //             : 0;
                //     }   
                // }

                // if (minValue !== 0 || maxValue !== 0) {
                //     if (typeof value === 'object' && 'ratingBrackets' in value && 'above1500' in value.ratingBrackets) {
                //         return (value.ratingBrackets as { above1500: number }).above1500;
                //     };

                // };
                return 0;
            });
            const randomColor = getRandomColor();
            const chartData = {
                labels,
                datasets: [
                    {
                        data: values,
                        fill: false,
                        backgroundColor: randomColor,
                        borderColor: randomColor,
                        borderWidth: 2,
                    },
                ],
            };

            setChartData(chartData);
            setGraphLoading(false);
        }
    }, [version, region, bracket, data, minValue, maxValue]);


    const handleClick = (rating: number) => {

        if (rating === minValue) return setMinValue(0);
        if (rating === maxValue) return setMaxValue(0);
        if (minValue === 0) return setMinValue(rating);
        if (rating < minValue) {
            setMaxValue(minValue);
            return setMinValue(rating);
        }
        if (maxValue === 0) return setMaxValue(rating);


        if (rating > minValue && rating < maxValue) return setMinValue(rating);
        if (rating > maxValue) return setMaxValue(rating);

    }

    const capitalizeFirstLetter = (string: string) => {
        return string.replace(/\b\w/g, char => char.toUpperCase());
    };

    const versionText = capitalizeFirstLetter(params.version);
    const regionText = capitalizeFirstLetter(params.region);
    const bracketText = capitalizeFirstLetter(params.bracket);


    return (
        <div className='flex flex-col rounded-xl gap-4 w-full'>
            <span className='text-center text-xl'>
                {versionText} {regionText} {bracketText} - Active Characters Count
            </span>
            {/* <span>min {minValue}</span>
            <span>max {maxValue}</span> */}
            {/* <button
                onClick={() => {
                    setMinValue(0);
                    setMaxValue(0);
                }}
                className='bg-white h-20 w-20'>

            </button> */}
            <div className='flex w-full items-center place-content-center'>
                <div className='flex flex-col rounded-xl  h-full w-full bg-secondary-light_black'>
                    <div className='flex h-12 w-full justify-between items-center px-4 bg-secondary-light_black rounded-xl'>

                        {sortedRatings.length > 0 && sortedRatings.map((rating, index) =>
                            <button
                                key={index}
                                onClick={() => handleClick(rating)}
                                className={`flex w-16 h-8 rounded-xl place-content-center items-center  
                            border-opacity-30 border-secondary-gray text-white 
                            ${rating === minValue || rating === maxValue ? 'bg-secondary-navy' : 'bg-secondary-light_black border-[1px]'}
                            
                            `}>
                                {rating}
                            </button>
                        )}
                    </div>
                    {graphLoading ? (
                        <div className='flex items-center place-content-center w-full h-[340px]'>
                            <FiLoader className="animate-spin text-gray-300" size={50} />
                        </div>
                    ) : (
                        chartData && (
                            <Line data={chartData} options={{
                                scales: {
                                    x: {
                                        type: 'time',
                                        time: {
                                            unit: 'day',
                                        },
                                    },
                                    y: {
                                        beginAtZero: false,
                                    },
                                },
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                },
                            }} />
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export default ActivityByRating