'use client'

import axios from "axios";
import Image from "next/image";
import { useEffect } from "react";
import specIconsMap from "~/utils/helper/specIconsMap";

// Define a type for QueryParams
type QueryParams = {
    version: string | null;
    region: string | null;
    name: string | null;
    realm: string | null;
    class: string | null;
    spec: string | null;
};

// Define a type for BracketStatistics
type BracketStatistics = {
    rating: number;
    season_match_statistics: {
        played: number;
        won: number;
        lost: number;
    };
    weekly_match_statistics: {
        played: number;
        won: number;
        lost: number;
    };
};

// Define a type for the props
type BracketTabProps = {
    params: QueryParams;
    bracket: string;
    data: BracketStatistics;
    setChoosenBracket: (bracket: string) => void;
    choosenBracket: string;
    };

const BracketTab = ({ params, bracket, data, setChoosenBracket, choosenBracket }: BracketTabProps) => {

    const className = params.class || '';
    const specName = params.spec || '';
    const specClassKey = `${specName} ${className}`;
    const specIcon = specIconsMap[specClassKey as keyof typeof specIconsMap];



    return (
        <>
            <button
                className={`flex flex-col  ${choosenBracket === bracket ? 'bg-secondary-navy' : 'bg-secondary-light_black'} w-1/4 pt-2 px-2`}
                onClick={() => setChoosenBracket(bracket)}
            >
                <div className='flex gap-2 place-content-center w-full'>
                    <span className='text-lg font-bold'>
                        {bracket.includes('shuffle') ? 'Shuffle' : bracket}
                    </span>
                    <div className='flex items-center gap-2'>
                        {bracket.includes('shuffle') && (
                            <>
                                <Image src={specIcon} alt={specName} width={20} height={20} />
                            </>
                        )}
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-start">Rating: {data.rating}</span>
                    <div className='flex gap-2'>
                        <span>Season activity:</span>
                        <div className='flex gap-2'>
                            <span>{`${data.season_match_statistics.played}`}</span>
                            <span className='text-sm'>{`(${data.season_match_statistics.won} - ${data.season_match_statistics.lost})`}</span>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <span>Weekly activity:</span>
                        {data.weekly_match_statistics.played === 0 ?
                            <span>-</span>
                            :
                            <div className='flex gap-2'>
                                <span>{`${data.weekly_match_statistics.played}`}</span>
                                <span className='text-sm'>{`(${data.weekly_match_statistics.won} - ${data.weekly_match_statistics.lost})`}</span>
                            </div>
                        }
                    </div>
                </div>
            </button>
        </>
    );
}

export default BracketTab;
