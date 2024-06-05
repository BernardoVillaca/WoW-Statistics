'use client'

import React from 'react';
import { useRouter } from 'next/router';

const BracketSearch = () => {
    const [bracket, setBracket] = React.useState('3v3');
    // const router = useRouter();
    
    const handleClick = (newBracket: string) => {
        if (newBracket === bracket) return;
        setBracket(newBracket);
        // router.push(`/?bracket=${newBracket}`, undefined, { shallow: true });
    };
    console.log('asdasd')

    return (
        <div className='flex text-black items-center justify-center w-1/5 rounded-lg gap-8 border-[1px] border-gray-700'>
            <button
                className={`flex text-gray-300 border-[1px] ${bracket === '3v3' ? 'border-blue-500' : 'border-gray-300'}  rounded-full w-12 h-12 items-center justify-center`}
                onClick={() => handleClick('3v3')}
            >
                3v3
            </button>
            <button
                className={`flex text-gray-300 border-[1px] ${bracket === '2v2' ? 'border-blue-500' : 'border-gray-300'}  rounded-full w-12 h-12 items-center justify-center`}
                onClick={() => handleClick('2v2')}
            >
                2v2
            </button>
            <button
                className={`flex text-gray-300 border-[1px] ${bracket === 'Rbg' ? 'border-blue-500' : 'border-gray-300'}  rounded-full w-12 h-12 items-center justify-center`}
                onClick={() => handleClick('Rbg')}
            >
                Rbg
            </button>
        </div>
    );
};

export default BracketSearch;
