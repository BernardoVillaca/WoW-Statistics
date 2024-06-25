import Image from 'next/image';
import React from 'react';
import { FiLoader } from 'react-icons/fi';
import {classIconsMap} from '~/utils/helper/classIconsMap';
import specIconsMap from '~/utils/helper/specIconsMap';
const minWidth = 15;

interface BarChartProps {
    highestValue: number;
    sortedArray: [string, number][];
    specificCount: number;
    title: string;
    classChart: boolean;
    loading: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ highestValue, sortedArray, specificCount, title, classChart, loading }) => {
    return (
        <div className='flex flex-col w-1/2 h-full gap-1 pt-2'>
            <div className='flex flex-col h-10 w-full items-center place-content-center bg-gray-800 rounded-xl'>
                <span>{title}</span>
            </div>
            {loading ? (
                <div className='flex items-center h-[356px] justify-center p-4 rounded-lg '>
                    <FiLoader className="animate-spin text-white" size={50} />
                </div>
            ) : (
                <div className='flex flex-col gap-1'>
                    {highestValue && sortedArray
                        ?.slice(0, 7)
                        .filter(([_, count]) => (count / specificCount) * 100 >= 2)
                        .map(([className, count]) => {
                            const width = Math.max((count / highestValue) * 100, minWidth);
                            return (
                                <div key={className} style={{ width: `${width}%` }} className='flex bg-gray-700 h-8 items-center justify-between rounded-r-lg px-2'>
                                    <Image
                                        src={classChart ? classIconsMap[className as keyof typeof classIconsMap] : specIconsMap[className as keyof typeof specIconsMap]}
                                        alt={className}
                                        width={18}
                                        className="rounded-lg overflow-hidden"
                                    />
                                    <span>{Math.trunc(count * 100 / specificCount)}%</span>
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
}

export default BarChart
