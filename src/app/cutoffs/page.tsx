'use client'

import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FiBarChart2, FiLoader, FiX } from 'react-icons/fi';
import { classColors } from '~/utils/helper/classIconsMap';
import usImage from '~/assets/Regions/us.png';
import euImage from '~/assets/Regions/eu.png';
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
import { set } from 'zod';

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

type HistoryEntry = {
  created_at: string;
  us_cutoffs: Cutoffs;
  eu_cutoffs: Cutoffs;
};

type Cutoffs = Record<string, { rating: number; count: number }>;

type AllCutoffs = {
  us_cutoffs: Cutoffs;
  eu_cutoffs: Cutoffs;
};

const formatKey = (key: string): string => {
  return key
    .replace('_cutoff', '')
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const sortCutoffs = (cutoffs: Cutoffs): [string, { rating: number; count: number }][] => {
  const specialOrder = ['arena_3v3_cutoff', 'rbg_alliance_cutoff', 'rbg_horde_cutoff'];
  const specialCutoffs = specialOrder
    .map(key => [key, cutoffs[key]])
    .filter(([key, value]) => value !== undefined) as [string, { rating: number; count: number }][];

  const remainingCutoffs = Object.entries(cutoffs)
    .filter(([key]) => !specialOrder.includes(key))
    .sort(([, valueA], [, valueB]) => valueB.rating - valueA.rating);

  return [...specialCutoffs, ...remainingCutoffs];
};

const RatingCutoffs = () => {
  const [uscutoffs, setUsCutoffs] = useState<Cutoffs | null>(null);
  const [eucutoffs, setEuCutoffs] = useState<Cutoffs | null>(null);

  const [historyData, setHistoryData] = useState<{ created_at: string, us_cutoffs: Cutoffs, eu_cutoffs: Cutoffs }[]>([]);

  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const getChartData = (key: string, region: string | null) => {
    const filteredData = historyData.filter(entry => {
      if (region === 'us') return entry.us_cutoffs?.[key];
      if (region === 'eu') return entry.eu_cutoffs?.[key];
      return false;
    });

    const labels = filteredData.map(entry => new Date(entry.created_at));
    const values = filteredData.map(entry => {
      const rating = region === 'us'
        ? entry.us_cutoffs[key]?.rating
        : entry.eu_cutoffs[key]?.rating;

      return rating ?? 0;
    });

    return {
      labels,
      datasets: [
        {
          data: values,
          fill: false,
          backgroundColor: classColors[formatKey(key)] ?? 'blue',
          borderColor: classColors[formatKey(key)] ?? 'blue',
          borderWidth: 2,
        },
      ],
    };
  };

  const onClickHandler = async (key: string, region: string) => {
    setSelectedKey(key);
    setIsOpen(true);
    setLoading(true);
    setSelectedRegion(region);
    setChartData(null);

    if (historyData.length === 0) {
      const response = await axios.get<{ history: HistoryEntry[] }>(`/api/getRatingCutoffs?history=true`);
      setHistoryData(response.data.history);
    }

  };

  const oncloseHandler = () => {
    setIsOpen(false);
    setSelectedKey(null);
    setSelectedRegion(null);
  }

  useEffect(() => {
    if (selectedKey && historyData.length > 0) {
      const data = getChartData(selectedKey, selectedRegion);
      console.log(data);
      setChartData(data);
      setLoading(false);
    }
  }, [selectedKey, historyData, selectedRegion]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get<{ cutoffs: AllCutoffs }>('/api/getRatingCutoffs');
      setUsCutoffs(response.data.cutoffs.us_cutoffs);
      setEuCutoffs(response.data.cutoffs.eu_cutoffs);
    };
    void fetchData();
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setSelectedKey(null);
        setSelectedRegion(null);
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    } else {
      window.removeEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);


  return (
    <div className='flex flex-col w-full min-h-screen bg-gradient-to-b from-[#000080] to-black text-white gap-4 py-2 relative'>
      {isOpen && selectedKey && (
        <div
          className='fixed flex top-0 right-0 flex-col w-full h-full bg-black/40 items-center place-content-center'
          onClick={() => oncloseHandler()}
        >
          <div
            className='flex flex-col  bg-gray-800 p-2 rounded-xl '
            onClick={(e) => e.stopPropagation()}
          >
            <div className='h-full w-full  flex items-center justify-center'>
              <div className='flex flex-col  bg-gray-800 p-2 rounded-xl ' onClick={(e) => e.stopPropagation()}>
                <div className='flex h-10 items-center justify-between px-2' >
                  <div className='flex gap-4'>
                    <span style={{ color: classColors[formatKey(selectedKey)] }}>{formatKey(selectedKey)}</span>
                    {selectedRegion === 'us' ?
                      <Image src={usImage} alt='usRegion' width={24} height={24} /> :
                      <Image src={euImage} alt='euRegion' width={24} height={24} />
                    }
                  </div>
                  <button
                    className='text-2xl text-gray-300 select-none'
                    onClick={() => oncloseHandler()}
                  >
                    <FiX />
                  </button>
                </div>
                <div className='flex h-[400px] w-[800px] border-[1px] items-center place-content-center  border-gray-300 rounded-xl  border-opacity-30 p-4'>
                  {loading ? (
                    <div className='flex items-center justify-center '>
                      <FiLoader className="animate-spin text-gray-300" size={50} />
                    </div>
                  ) : (
                    <>
                      {chartData &&
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
                              ticks: {
                                stepSize: 5,
                                maxTicksLimit: 50,
                              },

                            },
                          },
                          plugins: {
                            legend: {
                              display: false,
                            },
                          }

                        }} />}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className='flex px-24 gap-24'>
        <div className='flex flex-col w-1/2 place-content-center items-center bg-gray-800 px-2 rounded-xl'>
          <div className='p-4'>
            <Image
              className=''
              src={usImage}
              alt='usRegion'
              width={48}
              height={48}
            />
          </div>
          {uscutoffs && sortCutoffs(uscutoffs).map(([key, value]) => (
            <button
              key={key}
              className='flex justify-between w-full border-y-[1px] border-gray-300 border-opacity-20 hover:bg-gray-700 outline-none'
              onClick={() => onClickHandler(key, 'us')}
            >
              <span className='w-1/2' key={key} style={{ color: classColors[formatKey(key)] }}>{formatKey(key)}</span>
              <span >{value.rating}</span>
              <FiBarChart2 />
            </button>
          ))}
        </div>
        <div className='flex flex-col w-1/2 place-content-center items-center bg-gray-800 px-2 rounded-xl'>
          <div className='p-4'>
            <Image
              className=''
              src={euImage}
              alt='euRegion'
              width={48}
              height={48}
            />
          </div>
          {eucutoffs && sortCutoffs(eucutoffs).map(([key, value]) => (
            <button
              key={key}
              className='flex justify-between w-full border-y-[1px] border-gray-300 border-opacity-20 hover:bg-gray-700 outline-none'
              onClick={() => onClickHandler(key, 'eu')}
            >
              <span
                className='w-1/2'
                key={key}
                style={{ color: classColors[formatKey(key)] }}>{formatKey(key)}</span>
              <span className=''>{value.rating}</span>
              <FiBarChart2 />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingCutoffs;
