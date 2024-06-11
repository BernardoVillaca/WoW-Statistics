import React, { useEffect } from 'react'
import Image from 'next/image';
import { useSearch } from '../../Context/SearchContext';
import hordeIcon from '../../../assets/WoWFactions/horde.png';
import allyIcon from '../../../assets/WoWFactions/alliance.png';
import { updateURL } from '~/utils/helper/updateURL';

const FactionSearch = () => {
    const { setCurrentPage } = useSearch();

    const [faction, setFaction] = React.useState('none');

    const handleToggle = (newFaction: string) => {
        if (faction === newFaction) return setFaction('none');

        setFaction(newFaction);
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const initialFaction = urlParams.get('faction') ?? '';
        setFaction(initialFaction);
    }, []);

    useEffect(() => {
        if (faction) {
            updateURL('faction', faction === 'none' ? '' : faction, true);
            setCurrentPage(1);
        }
    }, [faction]);


    return (
        <div className='flex text-black items-center justify-center w-1/5 rounded-lg gap-8 border-[1px] border-gray-700'>
            <div
                className={`cursor-pointer rounded-full w-12 h-12 flex items-center justify-center ${faction === 'horde' ? 'border-2 border-blue-500' : ''}`}
                onClick={() => handleToggle('horde')}
            >
                <div className='rounded-full'>
                    <Image
                        src={hordeIcon}
                        alt='faction'
                        width={25}
                        height={25}


                    />
                </div>
            </div>
            <div
                className={`cursor-pointer rounded-full w-12 h-12 flex items-center justify-center ${faction === 'alliance' ? 'border-2 border-blue-500' : ''}`}
                onClick={() => handleToggle('alliance')}
            >
                <div className='rounded-full'>
                    <Image
                        src={allyIcon}
                        alt='faction'
                        width={30}
                        height={30}

                    />
                </div>

            </div>
        </div>
    );
}

export default FactionSearch;