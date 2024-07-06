'use client'

import axios from 'axios';
import { useEffect, useState } from 'react';
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
import { SearchProvider } from '~/components/Context/SearchContext';
import RegionSearch from '~/components/SearchTab/OtherSearch/RegionSearch';
import VersionSearch from '~/components/SearchTab/VersionSearch';
import BracketSearch from '~/components/SearchTab/OtherSearch/BracketSearch';
import useURLChange from '~/utils/hooks/useURLChange';
import { FiLoader } from 'react-icons/fi';

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

type ApiResponse = {
  activityHistory: HistoryEntry[];
};

type HistoryEntry = {
  created_at: string;
  [key: string]: { total24h: number } | string;
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Activity = () => {
  const [data, setData] = useState<HistoryEntry[]>([]);
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);
  const [loading, setLoading] = useState(true);
  const queryParams = useURLChange();

  const getQueryParams = () => {
    const params = new URLSearchParams(queryParams ?? '');
    return {
      version: params.get('version') ?? 'retail',
      region: params.get('region') ?? 'us',
      bracket: params.get('bracket') ?? '3v3'
    };
  };

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get<ApiResponse>('/api/getWowStatistics?history=true');
      setData(response.data.activityHistory);
    };
    void getData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const params = getQueryParams();
      const labels = data.map(entry => new Date(entry.created_at));

      const values = data.map(entry => {
        const key = `${params.version}_${params.region}_${params.bracket}` as keyof HistoryEntry;
        const value = entry[key];
        if (typeof value === 'object' && 'total24h' in value) {
          return (value as { total24h: number }).total24h;
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
      setLoading(false);
    }
  }, [queryParams, data]);

  const params = getQueryParams();

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-[#000080] to-black text-white relative gap-4 py-2">
      <div className='h-20 bg-gray-800 flex justify-between px-20 rounded-xl'>
        <RegionSearch partofLeadeboard={false} />
        <VersionSearch />
        <BracketSearch partofLeadeboard={false} />
      </div>
      <div className='flex items-center place-content-center'>
        {params.version} {params.region} {params.bracket}
      </div>
      <div className='flex w-full bg-gray-800 rounded-xl justify-between items-center place-content-center'>
        {loading ? (
          <div className='flex items-center place-content-center w-full h-[640px]'>
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
    </main>
  );
};

const ActivityWrapper = () => (
  <SearchProvider>
    <Activity />
  </SearchProvider>
);

export default ActivityWrapper;
