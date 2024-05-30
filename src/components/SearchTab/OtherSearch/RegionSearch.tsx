import React from 'react'
import Image from 'next/image';
import { useSearch } from '../../Context/SearchContext';
import usImage from '../../../assets/Regions/us.png';
import euImage from '../../../assets/Regions/eu.png';

const RegionSearch = () => {

    const { region, setRegion, faction, setFaction, realm, setRealm, rating, setRating } = useSearch();

    return (
        <div className='flex text-black items-center justify-center w-1/4 rounded-lg gap-8 border-[1px] border-gray-700'>
            <div
                className={`cursor-pointer rounded-full flex items-center justify-center ${region === 'us' ? 'border-2 border-blue-500' : ''}`}
                onClick={() => setRegion('us')}
                style={{ width: 54, height: 54 }}
            >
                <Image
                    className='rounded-full'
                    src={usImage}
                    alt='region'
                    width={50}
                    height={50}
                />
            </div>
            <div
                className={`cursor-pointer rounded-full flex items-center justify-center ${region === 'eu' ? 'border-2 border-blue-500' : ''}`}
                onClick={() => setRegion('eu')}
                style={{ width: 54, height: 54 }}
            >
                <Image
                    className='rounded-full'
                    src={euImage}
                    alt='region'
                    width={50}
                    height={50}
                />
            </div>
        </div>
    )
}

export default RegionSearch