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
import ActivityByRating from './Components/ActivityByRating';






const Activity = () => {

 

  return (
    <main className="flex flex-col text-white min-h-screen relative gap-4 py-2">
      <div className='h-20 bg-secondary-light_black flex justify-between px-20 rounded-xl'>
        <RegionSearch partofLeadeboard={false} />
        <VersionSearch />
        <BracketSearch partofLeadeboard={false} />
      </div>            
      <ActivityByRating />
      <RecentActivity />
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
