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

    const updateVersionFromURL = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const initialVersion = urlParams.get('version') ?? 'retail';
        setVersion(initialVersion);
    };

    // Initialize version from URL when the component mounts
    useEffect(() => {
        updateVersionFromURL();

        // Add an event listener to detect URL changes
        const handlePopState = () => {
            updateVersionFromURL();
        };

        window.addEventListener('popstate', handlePopState);

        // Cleanup the event listener
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
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
                    className={`rounded-xl h-10 w-32 text-xl ${version === 'retail' ? ' bg-secondary-navy ' : 'border-[1px] border-opacity-30 border-secondary-gray'}`}
                    onClick={() => handleClick('retail')}
                >
                    Retail
                </button>
                <button
                    className={`rounded-xl h-10 w-32 text-xl ${version === 'classic' ? ' bg-secondary-navy' : 'border-[1px] border-opacity-30 border-secondary-gray'}`}
                    onClick={() => handleClick('classic')}
                >
                    Classic
                </button>
            </div>
        </div>
    );
};

export default VersionSearch;
