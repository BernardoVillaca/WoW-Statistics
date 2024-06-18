import Image from 'next/image';
import React from 'react'
import classIconsMap from '~/utils/helper/classIconsMap';
import specIconsMap from '~/utils/helper/specIconsMap';
const minWidth = 15;

interface BarChartProps {
    highestValue: number;
    sortedArray: [string, number][];
    specificCount: number;
    title: string;
    classChart: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ highestValue, sortedArray, specificCount, title, classChart }) => {
    return (
        <div className='flex flex-col w-1/2 h-full gap-1 pt-2'>
            <div className='flex flex-col h-10 w-full items-center place-content-center bg-gray-800 rounded-xl'>
                <span>{title}</span>
            </div>
            {highestValue && sortedArray
            ?.slice(0, 10)
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
    )
}

export default BarChart