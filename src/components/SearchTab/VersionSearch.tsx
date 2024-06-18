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
    }, [version]);

    return (
        <div className='flex w-full justify-center'>
            <div className='flex  items-center gap-8'>
                <button
                    className={`rounded-xl h-10 w-32 text-xl ${version === 'retail' ? 'text-gray-800 bg-gray-300' : 'text-gray-300 bg-gray-800 border-2 border-white'}`}
                    onClick={() => handleClick('retail')}
                >
                    Retail
                </button>
                <button
                    className={`rounded-xl h-10 w-32 text-xl ${version === 'classic' ? 'text-gray-800 bg-gray-300' : 'text-gray-300 bg-gray-800'}`}
                    onClick={() => handleClick('classic')}
                >
                    Classic
                </button>
            </div>
        </div>
    );
};

export default VersionSearch;
