'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
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
    ChartData,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { FiLoader } from 'react-icons/fi';
import { classColors } from '~/utils/helper/classIconsMap';
import { capitalizeFirstLetter } from '~/utils/helper/capitalizeFirstLetter';

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

interface ActitivityTabProps {
    choosenBracket: string;
    params: {
        version: string | null;
        region: string | null;
        name: string | null;
        realm: string | null;
        class: string | null;
    };
}

type HistoryEntry = {
    won: number;
    lost: number;
    rank: number;
    played: number;
    rating: number;
    updated_at: string;
};

const ActitivityTab = ({ choosenBracket, params }: ActitivityTabProps) => {
    const [historyData, setHistoryData] = useState<HistoryEntry[]>([]);
    const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);
    const [loading, setLoading] = useState(false);

    const lineColor = params.class ? classColors[capitalizeFirstLetter(params.class)] : undefined;

    // Fetch bracket activity data
    const getBracketActivityData = async (bracket: string) => {
        if (params.version && params.region && params.name && params.realm) {
            try {
                setLoading(true);
                const response = await axios.get('/api/getBracketActivityData', {
                    params: {
                        ...params,
                        bracket,
                    },
                });
               
                if (response.data.message === 'Character not found') {                                      
                    setChartData(null);
                    setLoading(false);
                    return
                }

                const history = response.data.history;
                setHistoryData(history);
                setLoading(false);

            } catch (error) {
                console.error('Error fetching bracket activity data:', error);
            }

        }
    };

    useEffect(() => {
        if (historyData.length > 0) {
            const labels = historyData.map((entry) => new Date(entry.updated_at));
            const ratings = historyData.map((entry) => entry.rating);
            const data = {
                labels,
                datasets: [
                    {
                        label: 'Rating',
                        data: ratings,
                        fill: false,
                        borderColor: lineColor,
                        backgroundColor: lineColor,
                        tension: 0.1,
                    },
                ],
            };

            setChartData(data);
        }
    }, [historyData]);

    // Fetch data on choosenBracket change or initial params
    useEffect(() => {
        if (params.version && params.region && params.name && params.realm) {
            void getBracketActivityData(choosenBracket);
        }
    }, [choosenBracket, params]);

    return (
        <div className='flex flex-col items-center place-content-center h-[375px] bg-secondary-light_black p-4 gap-4'>
            <span className='text-2xl font-bold'>
                {`Activity - ${choosenBracket.includes('shuffle') ? 'Shuffle' : choosenBracket}`}
            </span>
            <div className='w-full h-full'>
                {loading ? (
                    <div className="h-full flex flex-col place-content-center items-center bg-secondary-light_black ">
                        <FiLoader className="animate-spin text-white" size={50} />
                    </div>
                ) : (
                    chartData ? (
                        <Line
                            data={chartData}
                            options={{
                                scales: {
                                    x: {
                                        type: 'time',
                                        time: {
                                            unit: 'day',
                                        },
                                        title: {
                                            display: true,

                                        },
                                    },
                                    y: {
                                        beginAtZero: false,
                                        title: {
                                            display: true,

                                        },
                                    },
                                    
                                },
                                plugins: {
                                    legend: {
                                      display: false,
                                    },
                                  }
                            }}
                        />
                    ) : (
                        <div className='flex items-center justify-center h-full'>
                            <p className='text-gray-300'>No data available :(</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default ActitivityTab;
