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
import { SearchProvider, useSearch } from '~/components/Context/SearchContext';
import RegionSearch from '~/components/SearchTab/OtherSearch/RegionSearch';
import VersionSearch from '~/components/SearchTab/VersionSearch';
import BracketSearch from '~/components/SearchTab/OtherSearch/BracketSearch';
import useURLChange from '~/utils/hooks/useURLChange';
import { FiLoader } from 'react-icons/fi';
import { searchTabs } from '~/utils/helper/searchTabsMap';
import LeaderboardRow from '~/components/LeaderboardTable/LeaderboardRow';
import ScrollTab from '~/components/ScrollTab';
import { CharacterData } from '~/components/LeaderboardTable/types';

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

type ActivePlayersResponse = {
  results: CharacterData[];
  total: number;
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
  const { setResultsCount } = useSearch();
  const [path, setPath] = useState<string>('');
  const [data, setData] = useState<ActivityEntry[]>([]);
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);
  const [activePlayers, setActivePlayers] = useState<CharacterData[]>([]);

  const [graphLoading, setGraphLoading] = useState(true);
  const [activePlayersLoading, setActivePlayersLoading] = useState(true);

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

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get<WowStatisticsResponse>('/api/getWowStatistics?history=true');
      setData(response.data.activityHistory);
    };
    void getData();
  }, []);

  useEffect(() => {
    const getActivePlayers = async () => {
      setActivePlayersLoading(true);
      const params = getQueryParams();
      const response = await axios.get<ActivePlayersResponse>('/api/get50Results', {
        params,
      });
      console.log(response)
      setActivePlayers(response.data.results);
      setResultsCount(response.data.total)
      setActivePlayersLoading(false);

    }
    void getActivePlayers();

  }, [queryParams]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPath(window.location.pathname);
      
    }
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const params = getQueryParams();
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
        {graphLoading ? (
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
      <ScrollTab resultsPerPage={10} />
      <div className='flex w-full flex-col h-[400px] bg-gray-800 rounded-xl'>
        {activePlayersLoading ? (
          <div className='flex items-center place-content-center w-full h-[400px]'>
            <FiLoader className="animate-spin text-gray-300" size={50} />
          </div>
        ) : (
          <>
            {activePlayers.length > 0 ? (
              activePlayers.map((player, index) => (
                <LeaderboardRow
                  rowIndex={index}
                  key={`${player.id}-${index}`}
                  characterData={player}
                  searchTabs={searchTabs}
                  rowHeight={40}
                />
              ))
            ) : (
              <div className='flex items-center place-content-center w-full h-[400px]'>
                <p className='text-gray-300'>No one is playing. Dead game :(</p>
              </div>
            )}
          </>
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
