import React, { useState } from 'react';
import { ActivityStatistics } from '~/utils/helper/activityMap';
import MostActivePlayers from './MostActivePlayers';
import MostActiveSpecs from './MostActiveSpecs';

const ActivityChart = ({ localActivityData }: { localActivityData: ActivityStatistics }) => {
  const [timeFrame, setTimeFrame] = useState<'24h' | '48h' | '72h'>('24h');
  const timeFrames: Array<'24h' | '48h' | '72h'> = ['24h', '48h', '72h'];

  const mostActivePlayersColumns = [
    { label: 'Name', width: 'w-1/3' },
    { label: 'Spec', width: 'w-1/6' },
    { label: 'Rating', width: 'w-1/6' },
    { label: 'Played', width: 'w-1/6' },
    { label: 'W/L', width: 'w-1/6' },
  ];

  const mostActiveSpecsColumns = [
    { label: 'Spec', width: 'w-1/3' },
    { label: 'Count', width: 'w-1/3' },
    { label: '%', width: 'w-1/3' },

  ]

  const {
    total24h, mostActivePlayers24h, mostActiveSpecs24h,
    total48h, mostActivePlayers48h, mostActiveSpecs48h,
    total72h, mostActivePlayers72h, mostActiveSpecs72h
  } = localActivityData;

  const timeFrameMap = {
    '24h': {
      total: total24h,
      mostActivePlayers: mostActivePlayers24h,
      mostActiveSpecs: mostActiveSpecs24h,
    },
    '48h': {
      total: total48h,
      mostActivePlayers: mostActivePlayers48h,
      mostActiveSpecs: mostActiveSpecs48h,
    },
    '72h': {
      total: total72h,
      mostActivePlayers: mostActivePlayers72h,
      mostActiveSpecs: mostActiveSpecs72h,
    }
  };

  const total = timeFrameMap[timeFrame].total;
  const mostActivePlayers = timeFrameMap[timeFrame].mostActivePlayers;
  const mostActiveSpecs = timeFrameMap[timeFrame].mostActiveSpecs;

  return (
    <div className='flex flex-col w-full h-full pt-2 gap-4'>
      <div className='flex h-10 w-full items-center place-content-center bg-gray-800 rounded-xl'>
        <div className='flex w-1/3'></div>
        <div className='flex w-1/3 items-center place-content-center'>
          <span>Activity</span>
        </div>
        <div className='flex w-1/3 items-end place-content-end'>
          <div className='flex gap-2 h-16 items-center'>
            {timeFrames.map(tf => (
              <button
                key={tf}
                className={`h-10 w-10 rounded-full ${timeFrame === tf ? 'text-gray-800 bg-gray-300' : 'text-gray-300 bg-gray-800 border-[1px] border-white'}`}
                onClick={() => setTimeFrame(tf)}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className='flex flex-col  text-gray-300 gap-2 px-2'>
        <span>Total Active Players: {total}</span>
        <div className='flex w-full gap-4'>
          <div className='flex flex-col w-1/2 bg-gray-800 rounded-xl px-2'>
            <h3 className='font-bold text-center'>Most Active Players</h3>
            <div className='flex w-full border-y-[1px] border-gray-300 border-opacity-20'>
              {mostActivePlayersColumns.map((column, index) => (
                <span key={index} className={`${column.width} text-xs text-center`}>{column.label}</span>
              ))}
            </div>
            {Object.entries(mostActivePlayers).sort(([, a], [, b]) => b.played - a.played).map(([name, player]) => (
              <MostActivePlayers
                key={name}
                name={name}
                player={player}
                mostActivePlayersColumns={mostActivePlayersColumns}
              />
            ))}
          </div>
          <div className='w-1/2 flex flex-col bg-gray-800 rounderd-xl px-2'>
            <h3 className='font-bold text-center'>Most Active Specs</h3>
            <div className='flex w-full border-y-[1px] border-gray-300 border-opacity-20'>
              {mostActiveSpecsColumns.map((column, index) => (
                <span key={index} className={`${column.width} text-xs text-center`}>{column.label}</span>
              ))}
            </div>
            {Object.entries(mostActiveSpecs).sort(([, a], [, b]) => b.played - a.played).map(([name, spec]) => (
              <MostActiveSpecs
                key={name}
                name={name}
                spec={spec}
                total={total}
                mostActiveSpecsColumns={mostActiveSpecsColumns}

              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityChart;
