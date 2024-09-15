import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import specIconsMap from '~/utils/helper/specIconsMap';
import { classIconsMap } from '~/utils/helper/classIconsMap';
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
    const { setCurrentPage, classSearch, setClassSearch } = useSearch();
    const [hoveredClassSpec, setHoveredClassSpec] = useState<string | null>(null);
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
            const allSelected = specs.every(spec => classSearch.includes(spec));
            if (allSelected) {
                const updatedSearch = classSearch.filter(spec => !specs.includes(spec));
                setClassSearch(updatedSearch);
            } else {
                setClassSearch([...classSearch, ...specs.filter(spec => !classSearch.includes(spec))]);
            }
        }
    };

    const toggleSpecSelection = (spec: string) => {
        if (version === 'classic' && grayedOutSpecs.includes(spec)) {
            return;
        }
        if (classSearch.includes(spec)) {
            const updatedSearch = classSearch.filter(selected => selected !== spec);
            setClassSearch(updatedSearch);
        } else {
            setClassSearch([...classSearch, spec]);
        }
    };


    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const initialSearch = urlParams.get('search');
        if (initialSearch) {
            setClassSearch(initialSearch.split(','));
        }
    }, []);

    useEffect(() => {
        if (classSearch) {
            setCurrentPage(1);
            updateURL('search', classSearch.length > 0 ? classSearch.join(',') : null, true);
        }
    }, [classSearch, setCurrentPage]);

    useEffect(() => {
        if (prevVersionRef.current && prevVersionRef.current !== version) {
            setClassSearch([]);
        }
        prevVersionRef.current = version;
    }, [version]);


    return (
        <div className='flex justify-between w-full bg-secondary-light_black rounded-lg p-4'>
            {Object.keys(classSpecs).map((className, index) => (
                <div key={index} className='flex flex-col gap-4'>
                    <div className='relative'>
                        <Image
                            src={classIconsMap[className as keyof typeof classIconsMap]}
                            alt={className}
                            width={30}
                            height={30}
                            className={`
                            rounded-lg overflow-hidden cursor-pointer 
                            ${classSpecs[className]?.every(spec => classSearch.includes(spec)) ? 'border-2 border-primary' : ''} 
                            ${version === 'classic' && ['Evoker', 'Demon Hunter', 'Monk'].includes(className) ? 'grayed-out' : ''}
                            `}
                            onClick={() => toggleClassSelection(className)}
                            onMouseOver={() => setHoveredClassSpec(className)}
                            onMouseLeave={() => setHoveredClassSpec(null)}
                        />
                        {hoveredClassSpec === className && (
                            <div className='z-2 absolute bottom-7 whitespace-nowrap left-7 text-xs text-secondary-gray '>{className}</div>
                        )}
                    </div>
                    {classSpecs[className]?.map((spec, idx) => (
                        <div key={idx} className='relative'>
                            <Image
                                src={specIconsMap[spec as keyof typeof specIconsMap]}
                                alt={spec}
                                width={30}
                                height={30}
                                className={`
                                rounded-lg overflow-hidden cursor-pointer 
                                ${classSearch.includes(spec) ? 'border-2 border-primary' : ''} 
                                ${version === 'classic' && ['Evoker', 'Demon Hunter', 'Monk'].includes(className) ? 'grayed-out' : ''}
                                `}
                                onClick={() => toggleSpecSelection(spec)}
                                onMouseOver={() => setHoveredClassSpec(spec)}
                                onMouseLeave={() => setHoveredClassSpec(null)}
                            />
                            {hoveredClassSpec === spec && (
                                <div className='z-2 absolute bottom-7 whitespace-nowrap left-7 text-xs text-secondary-gray'>{spec.split(' ')[0]}</div>
                            )}
                        </div>
                    ))}

                </div>
            ))}
        </div>
    );
};

export default ClassSearch;
