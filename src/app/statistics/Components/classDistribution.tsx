import React, { useState } from 'react';
import { ActivityEntry, ClassSpecEntry, SearchParams } from '../page';
import Image from 'next/image';
import { classColors, classIconsMap } from '~/utils/helper/classIconsMap';
import { FiLoader } from 'react-icons/fi';



const ClassDistribution = ({ classSpecData, params, ratingFilter, loading }: { classSpecData: ClassSpecEntry[], params: SearchParams, ratingFilter: string, loading: boolean }) => {

  const { version, region, bracket } = params;
  const key = `${version}_${region}_${bracket}` ;
  const entry = classSpecData[key as keyof typeof classSpecData];

  const maxCount = entry
  ? Math.max(
      ...Object.values(entry).map((value) => {
        const allSpecs = (value as { AllSpecs: Record<string, number> }).AllSpecs;
        return allSpecs?.[ratingFilter] ?? 0;
      })
    )
  : 1;


  return (
    <div className='flex flex-col justify-between text-black w-1/2 place-content-center items-center gap-4  rounded-lg py-4 border-[1px] border-secondary-gray border-opacity-30'>
      <h2 className='text-xl h-8 text-white'>Class Distribution</h2>
      {loading ? (
        <div className='flex items-center h-full justify-center p-4 rounded-lg '>
          <FiLoader className="animate-spin text-white" size={50} />
        </div>
      ) : (
        <div className='flex items-end gap-2  w-full place-content-center'>
          {entry && Object.entries(entry)
            .filter(([key]) => {
              // Exclude Evoker, Death Knight, and Demon Hunter if version is classic
              return version !== 'classic' || !['Evoker', 'Death Knight', 'Demon Hunter', 'Monk'].includes(key);
            })
            .sort(([, a], [, b]) => {
              const aSpecs = (a as { AllSpecs: Record<string, number> }).AllSpecs;
              const bSpecs = (b as { AllSpecs: Record<string, number> }).AllSpecs;
              return (bSpecs[ratingFilter] ?? 0) - (aSpecs[ratingFilter] ?? 0);
            })
            .map(([key, value]) => {
              const typedValue = value as { AllSpecs?: Record<string, number> };
              const count = typedValue.AllSpecs?.[ratingFilter] ?? 0;
             
              const barHeight = (count / maxCount) * 200;
              const barColor = classColors[key] ?? 'gray';

              return (
                <div key={key} className='flex flex-col gap-2 justify-end items-center'>
                  <div className='w-7 flex place-content-center items-center text-sm text-black' style={{ height: `${barHeight}px`, backgroundColor: barColor }}>
                    <span className={`${count > 999 ? '-rotate-90' : ''}`}>{count}</span>
                  </div>
                  <Image
                    src={classIconsMap[key as keyof typeof classIconsMap]}
                    alt={key}
                    width={30}
                    height={30}
                    className='rounded-lg'
                  />
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default ClassDistribution;
