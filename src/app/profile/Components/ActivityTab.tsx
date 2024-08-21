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

                // Assuming response.data.history contains the history entries
                const history = response.data.history || [];
                console.log(response.data)
                setHistoryData(history);
                
            } catch (error) {
                console.error('Error fetching bracket activity data:', error);
            } finally {
                setLoading(false);
            }
        } else {
            console.warn('Missing parameters, cannot fetch data');
        }
    };

    useEffect(() => {
        if (historyData.length > 0) {
            const labels = historyData.map((entry) => new Date(entry.updated_at));
            const ratings = historyData.map((entry) => entry.rating);
            console.log(ratings)
            const data = {
                labels,
                datasets: [
                    {
                        label: 'Rating',
                        data: ratings,
                        fill: false,
                        borderColor: 'rgba(75,192,192,1)',
                        backgroundColor: 'rgba(75,192,192,0.2)',
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
        <div className='flex flex-col items-center justify-center h-full bg-gray-800 p-4'>
            <span className='text-white text-lg mb-4'>
                {`Activity - ${choosenBracket.includes('shuffle') ? 'Shuffle' : choosenBracket}`}
            </span>
            <div className='w-full h-full'>
                {loading ? (
                    <div className='flex items-center justify-center'>
                        <p className='text-white'>Loading...</p>
                    </div>
                ) : (
                    chartData && (
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
                                            text: 'Date',
                                        },
                                    },
                                    y: {
                                        beginAtZero: false,
                                        title: {
                                            display: true,
                                            text: 'Rating',
                                        },
                                    },
                                },
                            }}
                        />
                    )
                )}
            </div>
        </div>
    );
};

export default ActitivityTab;
