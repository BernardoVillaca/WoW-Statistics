import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import specIconsMap from '~/utils/helper/specIconsMap';
import classIconsMap from '~/utils/helper/classIconsMap';
import { useSearch } from '../Context/SearchContext';
import { updateURL } from '~/utils/helper/updateURL';
import useURLChange from '~/utils/hooks/useURLChange';

const classSpecs: Record<string, string[]> = {
    'Evoker': ['Devastation Evoker', 'Augmentation Evoker', 'Preservation Evoker'],
    'Druid': ['Balance Druid', 'Feral Druid', 'Restoration Druid'],
    'Paladin': ['Protection Paladin', 'Retribution Paladin', 'Holy Paladin'],
    'Shaman': ['Elemental Shaman', 'Enhancement Shaman', 'Restoration Shaman'],
    'Monk': ['Brewmaster Monk', 'Windwalker Monk', 'Mistweaver Monk'],
    'Priest': ['Shadow Priest', 'Discipline Priest', 'Holy Priest'],
    'Demon Hunter': ['Havoc Demon Hunter', 'Vengeance Demon Hunter'],
    'Death Knight': ['Blood Death Knight', 'Frost Death Knight', 'Unholy Death Knight'],
    'Hunter': ['Beast Mastery Hunter', 'Marksmanship Hunter', 'Survival Hunter'],
    'Mage': ['Arcane Mage', 'Fire Mage', 'Frost Mage'],
    'Rogue': ['Assassination Rogue', 'Outlaw Rogue', 'Subtlety Rogue'],
    'Warlock': ['Affliction Warlock', 'Demonology Warlock', 'Destruction Warlock'],
    'Warrior': ['Protection Warrior', 'Arms Warrior', 'Fury Warrior'],
};

const grayedOutSpecs = [
    'Preservation Evoker', 'Devastation Evoker', 'Havoc Demon Hunter',
    'Vengeance Demon Hunter', 'Brewmaster Monk', 'Mistweaver Monk', 'Windwalker Monk'
];

const ClassSearch = () => {
    const { setCurrentPage } = useSearch();
    const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
    const queryParams = useURLChange();
    const prevVersionRef = useRef<string | null>(null);

    const getQueryParams = () => {
        const params = new URLSearchParams(queryParams ?? '');
        return {
            version: params.get('version') ?? 'retail',
        };
    };

    const { version } = getQueryParams();

    const toggleClassSelection = (className: string) => {
        if (version === 'classic' && ['Evoker', 'Demon Hunter', 'Monk'].includes(className)) {
            return;
        }
        const specs = classSpecs[className];
        if (specs) {
            const allSelected = specs.every(spec => selectedSpecs.includes(spec));
            if (allSelected) {
                setSelectedSpecs(selectedSpecs.filter(spec => !specs.includes(spec)));
            } else {
                setSelectedSpecs([...selectedSpecs, ...specs.filter(spec => !selectedSpecs.includes(spec))]);
            }
        }
    };

    const toggleSpecSelection = (spec: string) => {
        if (version === 'classic' && grayedOutSpecs.includes(spec)) {
            return;
        }
        if (selectedSpecs.includes(spec)) {
            setSelectedSpecs(selectedSpecs.filter(selected => selected !== spec));
        } else {
            setSelectedSpecs([...selectedSpecs, spec]);
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const initialSearch = urlParams.get('search');
        if (initialSearch) {
            setSelectedSpecs(initialSearch.split(','));
        }
    }, []);

    useEffect(() => {
        if (selectedSpecs) {
            setCurrentPage(1);
            updateURL('search', selectedSpecs.length > 0 ? selectedSpecs.join(',') : null, true);
        }
    }, [selectedSpecs]);

    useEffect(() => {
        if (prevVersionRef.current && prevVersionRef.current !== version) {
            setSelectedSpecs([]);
        }
        prevVersionRef.current = version;
    }, [version]);

    return (
        <div className='flex justify-between w-full bg-gray-800 rounded-lg p-4'>
            {Object.keys(classSpecs).map((className, index) => (
                <div key={index} className='text-center'>
                    <Image
                        src={classIconsMap[className as keyof typeof classIconsMap]}
                        alt={className}
                        width={30}
                        height={30}
                        className={`
                            rounded-lg overflow-hidden cursor-pointer 
                            ${classSpecs[className]?.every(spec => selectedSpecs.includes(spec)) ? 'border-2 border-blue-500' : ''} 
                            ${version === 'classic' && ['Evoker', 'Demon Hunter', 'Monk'].includes(className) ? 'grayed-out' : ''}
                            `}
                        onClick={() => toggleClassSelection(className)}
                    />
                    <div className='flex flex-col gap-4 pt-4'>
                        {classSpecs[className]?.map((spec, idx) => (
                            <Image
                                key={idx}
                                src={specIconsMap[spec as keyof typeof specIconsMap]}
                                alt={spec}
                                width={30}
                                height={30}
                                className={`
                                    rounded-lg overflow-hidden cursor-pointer 
                                    ${selectedSpecs.includes(spec) ? 'border-2 border-blue-500' : ''} 
                                    ${version === 'classic' && ['Evoker', 'Demon Hunter', 'Monk'].includes(className) ? 'grayed-out' : ''}
                                    `}
                                onClick={() => toggleSpecSelection(spec)}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ClassSearch;
