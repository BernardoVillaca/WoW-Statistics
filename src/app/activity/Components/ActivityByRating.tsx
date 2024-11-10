'use client'

import axios from 'axios';
import { ChartData } from 'chart.js';
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
import { brightColors } from '~/utils/helper/activityMap';


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
        total24h: number;
        ratingBrackets: RatingBrackets;
    } | string;
}

type WowStatisticsResponse = {
    activityHistory: ActivityEntry[];
};

const getRandomColor = () => {
    return brightColors[Math.floor(Math.random() * brightColors.length)];
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

    const key = `${version}_${region}_${bracket}` as keyof ActivityEntry;
    useEffect(() => {

        if (data.length > 0) {

            // Set the possible ratings for search
            const ratingBrackets = typeof data[0]?.[key] === 'object' ? data[0]?.[key].ratingBrackets : undefined;
            const uniqueRatings = [];
            let previousValue = null;


            if (!ratingBrackets) return
            const reversedKeys = Object.keys(ratingBrackets).reverse();


            for (const key of reversedKeys) {
                const ratingValue = ratingBrackets[key];
                const ratingNumber = parseInt(key.replace("above", ""), 10);

                if (ratingValue !== previousValue) {
                    uniqueRatings.push(ratingNumber);
                    previousValue = ratingValue;
                }
            }

            const reversedRatings = uniqueRatings.reverse();

            setSortedRatings(reversedRatings);

            const labels = data.map(entry => new Date(entry.created_at));

            const values = data.map(entry => {
                const key = `${params.version}_${params.region}_${params.bracket}` as keyof ActivityEntry;
                const value = entry[key];
                if (minValue === 0 && maxValue === 0) {
                    if (typeof value === 'object' && 'total24h' in value) {
                        return (value as { total24h: number }).total24h;
                    };
                };
                if (minValue !== 0 && maxValue !== 0) {
                    const minKey = `above${minValue}`;
                    const maxKey = `above${maxValue}`;
                    if (typeof value === 'object' && value.ratingBrackets?.[minKey] !== undefined && value.ratingBrackets?.[maxKey] !== undefined) {
                        return Math.abs(value.ratingBrackets[maxKey] - value.ratingBrackets[minKey]);
                    }
                }
                // If only one value is selected display the graph for that value dinamically
                if (minValue !== 0 && maxValue === 0) {
                    const minKey = `above${minValue}`;
                    if (typeof value === 'object' && value.ratingBrackets?.[minKey] !== undefined) {
                        return value.ratingBrackets[minKey] ?? 0;
                    }
                }
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

    useEffect(() => {
        setMinValue(0);
        setMaxValue(0);
    }, [version, region, bracket]);

    const handleClick = (rating: number) => {
        // Set the first two values
        if (minValue === 0 && maxValue === 0) return setMinValue(rating);
        if (minValue !== 0 && maxValue === 0 && rating !== minValue) {
            if (rating < minValue) {
                setMaxValue(minValue);
                setMinValue(rating);
            } else {
                setMaxValue(rating);
            }
        }
        // Reset if the same value is clicked
        if (minValue === rating) {
            if (maxValue !== 0) {
                setMinValue(maxValue);
                return setMaxValue(0);
            }
            return setMinValue(0);
        }
        if (maxValue === rating) return setMaxValue(0);
        // If both values are set, move the closer value
        if (minValue !== 0 && maxValue !== 0) {
            const minDifference = Math.abs(minValue - rating);
            const maxDifference = Math.abs(maxValue - rating);
            if (minDifference < maxDifference) return setMinValue(rating);
            setMaxValue(rating);
        }
    }

    const capitalizeFirstLetter = (string: string) => {
        return string.replace(/\b\w/g, char => char.toUpperCase());
    };

    const versionText = capitalizeFirstLetter(params.version);
    const regionText = capitalizeFirstLetter(params.region);
    const bracketText = capitalizeFirstLetter(params.bracket);

    const getLastActivity = () => {
        if (!data || typeof data[0]?.[key] !== 'object') return '';

        const ratingBrackets = data[0][key].ratingBrackets;
        const total24h = data[0][key].total24h ?? '';
        const aboveMin = ratingBrackets?.[`above${minValue}`] ?? 0;
        const aboveMax = ratingBrackets?.[`above${maxValue}`] ?? 0;

        if (minValue === 0 && maxValue === 0) {
            return `Last Activity: ${total24h}`;
        } else if (minValue !== 0 && maxValue === 0) {
            return `Last Activity: ${aboveMin}`;
        } else if (minValue !== 0 && maxValue !== 0) {
            return `Last Activity: ${Math.abs(aboveMax - aboveMin)}`;
        }
        return '';
    };

    const lastActivityText = getLastActivity();

    return (
        <div className='flex flex-col rounded-xl gap-4 w-full'>
            <div className='text-center text-xl'>
                {versionText} {regionText} {bracketText} - Active Characters
            </div>
            <div className='text-s w-full h-6'>
                {lastActivityText}
            </div>
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
                        <div className='flex items-center place-content-center w-full h-[300px]'>
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