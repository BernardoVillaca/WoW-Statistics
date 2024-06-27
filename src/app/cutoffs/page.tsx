'use client'

import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { FiBarChart2 } from 'react-icons/fi';
import { classColors } from '~/utils/helper/classIconsMap';
import usImage from '~/assets/Regions/us.png';
import euImage from '~/assets/Regions/eu.png';
import { set } from 'zod';
type Cutoffs = Record<string, { rating: number; count: number }>;

type AllCutoffs = {
  us_cutoffs: Cutoffs;
  eu_cutoffs: Cutoffs;
}

const formatKey = (key: string): string => {
  return key
    .replace('_cutoff', '')
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const sortCutoffs = (cutoffs: Cutoffs): [string, { rating: number; count: number }][] => {
  const specialOrder = ['arena_3v3_cutoff', 'rbg_alliance_cutoff', 'rbg_horde_cutoff'];
  const specialCutoffs = specialOrder
    .map(key => [key, cutoffs[key]])
    .filter(([key, value]) => value !== undefined) as [string, { rating: number; count: number }][];

  const remainingCutoffs = Object.entries(cutoffs)
    .filter(([key]) => !specialOrder.includes(key))
    .sort(([, valueA], [, valueB]) => valueB.rating - valueA.rating);

  return [...specialCutoffs, ...remainingCutoffs];
}

const RatingCutoffs = () => {
  const [uscutoffs, setUsCutoffs] = useState<Cutoffs | null>(null)
  const [eucutoffs, setEuCutoffs] = useState<Cutoffs | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [historyData, setHistoryData] = useState<Record<string, number> | null>(null)
  const [loading, setLoading] = useState(false)


  const onClickHandler = async (key: string) => {
    document.body.style.overflow = 'hidden';
    setIsOpen(!isOpen);
    setLoading(true);
    if (!historyData) {
      const response = await axios.get<{ history: Record<string, number> }>(`/api/getRatingCutoffs?history=true`)
      setHistoryData(response.data.history)
      console.log(response);
    }
    setLoading(false);

    setSelectedKey(key);

  }

  const onClose = () => {
    setIsOpen(false)
    document.body.style.overflow = '';



  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get<{ cutoffs: AllCutoffs }>('/api/getRatingCutoffs')
      setUsCutoffs(response.data.cutoffs.us_cutoffs)
      setEuCutoffs(response.data.cutoffs.eu_cutoffs)
    }
    void fetchData()
  }, [])

  return (
    <div className='flex flex-col w-full min-h-screen bg-gradient-to-b from-[#000080] to-black text-white gap-4 py-2 relative'>
      {isOpen && selectedKey &&
        <div
          className='absolute flex flex-col w-full h-full bg-black/40 items-center'
          onClick={() => onClose()}
        >
          <div
            className='flex h-[400px] w-[800px] bg-gray-800 items-start place-content-end px-4 mt-72'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className='text-2xl text-black select-none'
              onClick={() => onClose()}
            >
              X
            </button>

          </div>
        </div>
      }
      <div className='flex px-24 gap-24'>
        <div className='flex flex-col w-1/2 place-content-center items-center bg-gray-800 px-2 rounded-xl'>
          <div className='p-4'>
            <Image
              className=''
              src={usImage}
              alt='region'
              width={48}
              height={48}
            />
          </div>
          {uscutoffs && sortCutoffs(uscutoffs).map(([key, value]) => (
            <button
              key={key}
              className='flex justify-between w-full border-y-[1px] border-gray-300 border-opacity-20 hover:bg-gray-700'
              onClick={() => onClickHandler(key)}
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
              alt='region'
              width={48}
              height={48}
            />
          </div>
          {eucutoffs && sortCutoffs(eucutoffs).map(([key, value]) => (
            <button key={key} className='flex justify-between w-full border-y-[1px] border-gray-300 border-opacity-20 hover:bg-gray-700'>
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
  )
}

export default RatingCutoffs
