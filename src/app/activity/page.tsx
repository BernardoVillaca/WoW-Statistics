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
} from 'chart.js';

import type { ChartData } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { SearchProvider } from '~/components/Context/SearchContext';
import RegionSearch from '~/components/SearchTab/OtherSearch/RegionSearch';
import VersionSearch from '~/components/SearchTab/VersionSearch';
import BracketSearch from '~/components/SearchTab/OtherSearch/BracketSearch';
import useURLChange from '~/utils/hooks/useURLChange';
import { FiLoader } from 'react-icons/fi';
import MostActivePlayers from '~/app/activity/Components/MostActivePlayers';
import RecentActivity from './Components/RecentActivity';

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

type WowStatisticsResponse = {
  activityHistory: ActivityEntry[];
};

type ActivityEntry = {
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
      const labels = data.map(entry => new Date(entry.created_at));

      const values = data.map(entry => {
        const key = `${params.version}_${params.region}_${params.bracket}` as keyof ActivityEntry;
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
      setGraphLoading(false);
    }
  }, [version, region, bracket, data]);


  const capitalizeFirstLetter = (string: string) => {
    return string.replace(/\b\w/g, char => char.toUpperCase());
  };

  const versionText = capitalizeFirstLetter(params.version);
  const regionText = capitalizeFirstLetter(params.region);
  const bracketText = capitalizeFirstLetter(params.bracket);

  return (
    <main className="flex flex-col text-white min-h-screen relative gap-4 py-2">
      <div className='h-20 bg-secondary-light_black flex justify-between px-20 rounded-xl'>
        <RegionSearch partofLeadeboard={false} />
        <VersionSearch />
        <BracketSearch partofLeadeboard={false} />
      </div>
      <span className='text-center text-xl'>
        {versionText} {regionText} {bracketText} - Active Characters Count
      </span>
      <div className='flex w-full items-center place-content-center'>
        <div className='flex rounded-xl  h-[350px] w-[700px] bg-secondary-light_black'>
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
      <RecentActivity  path={path}/>
      <MostActivePlayers />
    </main>
  );
};

const ActivityWrapper = () => (
  <SearchProvider>
    <Activity />
  </SearchProvider>
);

export default ActivityWrapper;
