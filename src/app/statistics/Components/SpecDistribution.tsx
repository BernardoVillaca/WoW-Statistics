import React from 'react';
import { ActivityEntry, ClassSpecEntry, SearchParams } from '../page';
import Image from 'next/image';
import { classColors } from '~/utils/helper/classIconsMap';
import specIconsMap from '~/utils/helper/specIconsMap';
import { FiLoader } from 'react-icons/fi';

const MeleeDps = [

  'Frost Death Knight',
  'Unholy Death Knight',
  'Havoc Demon Hunter',
  'Feral Druid',
  'Feral Combat Druid',
  'Windwalker Monk',
  'Retribution Paladin',
  'Assassination Rogue',
  'Outlaw Rogue',
  'Subtlety Rogue',
  'Enhancement Shaman',
  'Arms Warrior',
  'Fury Warrior',
  'Survival Hunter',
];

const RangedDps = [
  'Balance Druid',
  'Arcane Mage',
  'Fire Mage',
  'Frost Mage',
  'Beast Mastery Hunter',
  'Marksmanship Hunter',
  'Elemental Shaman',
  'Shadow Priest',
  'Affliction Warlock',
  'Demonology Warlock',
  'Destruction Warlock',
  'Devastation Evoker',
  'Augmentation Evoker',
];

const Healer = [
  'Restoration Druid',
  'Mistweaver Monk',
  'Holy Paladin',
  'Discipline Priest',
  'Holy Priest',
  'Restoration Shaman',
  'Preservation Evoker',
];

const SpecDistribution = ({ classSpecData, params, ratingFilter, title, loading }
  : { classSpecData: ClassSpecEntry[], params: SearchParams, ratingFilter: string, title: string, loading: boolean }) => {
  const { version, region, bracket } = params;
  const key = `${version}_${region}_${bracket}`;
  


  const specList = title === 'Melee Dps' ? MeleeDps : title === 'Ranged Dps' ? RangedDps : Healer;


  let maxCount = 1;
  const entry = classSpecData[key as keyof typeof classSpecData] as Record<string, Record<string, Record<string, number>>> | undefined;

  if (entry) {
    Object.entries(entry).forEach(([classKey, classData]) => {
      Object.entries(classData).forEach(([specKey, specData]) => {
        if (specList.includes(`${specKey} ${classKey}`)) {
          const count = specData[ratingFilter] ?? 0;
          if (count > maxCount) maxCount = count;
        }
      });
    });
  }
  

  const mappedSpecs: { classKey: string; specKey: string; count: number; barColor: string; }[] = [];
  if (entry) {
    Object.entries(entry).forEach(([classKey, classData]) => {
      if (version !== 'classic' || !['Evoker', 'Death Knight', 'Demon Hunter', 'Monk'].includes(classKey)) {
        Object.entries(classData).forEach(([specKey, specData]) => {
          if (specList.includes(`${specKey} ${classKey}`)) {
            mappedSpecs.push({
              classKey,
              specKey,
              count: specData[ratingFilter] ?? 0,
              barColor: classColors[classKey] ?? 'gray',
            });
          }
        });

      }
    });
    mappedSpecs.sort((a, b) => b.count - a.count);
  }

  return (
    <div className='flex flex-col rounded-lg h-96 w-1/2 py-4 text-black place-content-center items-center gap-4 border-[1px] border-secondary-gray border-opacity-30'>
      <h2 className='text-xl h-8 text-white'>{title}</h2>
      {loading ? (
        <div className='flex items-center h-full justify-center p-4 rounded-lg '>
          <FiLoader className="animate-spin text-white" size={50} />
        </div>
      ) : (
        <div className='flex items-end gap-2 p-4 w-full h-full place-content-center'>
          {mappedSpecs.map(({ classKey, specKey, count, barColor }) => {
            const barHeight = (count / maxCount) * 200;
            return (
              <div key={`${classKey}-${specKey}`} className='flex flex-col gap-2 justify-end items-center'>
                <div className='w-7 flex place-content-center items-center text-sm text-black' style={{ height: `${barHeight}px`, backgroundColor: barColor }}>
                  <span className={`${count > 999 ? '-rotate-90' : ''}`}>{barHeight < 10 ? '' : count}</span>
                </div>
                <Image
                  src={specIconsMap[`${specKey} ${classKey}` as keyof typeof specIconsMap] || specIconsMap[classKey as keyof typeof specIconsMap]}
                  alt={`${classKey} ${specKey}`}
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

export default SpecDistribution;
