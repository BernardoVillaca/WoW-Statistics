import React, { useEffect, useState } from 'react';
import { updateURL } from '~/utils/helper/updateURL';
import { useSearch } from '../Context/SearchContext';

const VersionSearch = () => {
    const [version, setVersion] = useState('');
    const { setCurrentPage } = useSearch(); 

    const handleClick = (newVersion: string) => {
        if (newVersion === version) return;
        setVersion(newVersion);
    };
    

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const initialVersion = urlParams.get('version') ?? 'retail';
        setVersion(initialVersion);
    }, []);

    useEffect(() => {
        if (version) {
            updateURL('version', version === 'retail' ? '' : version, true);
            setCurrentPage(1);
        }
    }, [version, setCurrentPage]);

    return (
        <div className='flex h-16 '>
            <div className='w-1/3 h-full' />
            <div className='flex w-1/3 justify-center items-center gap-8'>
                <button
                    className={`rounded-xl h-16 w-32 text-xl ${version === 'retail' ? 'text-gray-800 bg-gray-300' : 'text-gray-300 bg-gray-800'}`}
                    onClick={() => handleClick('retail')}
                >
                    Retail
                </button>
                <button
                    className={`rounded-xl h-16 w-32 text-xl ${version === 'classic' ? 'text-gray-800 bg-gray-300' : 'text-gray-300 bg-gray-800'}`}
                    onClick={() => handleClick('classic')}
                >
                    Classic
                </button>
            </div>
            <div className='w-1/3 h-full' />
        </div>
    );
};

export default VersionSearch;
