import React, { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import specIconsMap from '~/helper/specIconsMap';
import classIconsMap from '~/helper/classIconsMap';

const classSpecs: { [key: string]: string[] } = {
    'Evoker': ['Preservation Evoker', 'Devastation Evoker'],
    'Death Knight': ['Blood Death Knight', 'Frost Death Knight', 'Unholy Death Knight'],
    'Druid': ['Balance Druid', 'Feral Druid', 'Restoration Druid'],
    'Hunter': ['Beast Mastery Hunter', 'Marksmanship Hunter', 'Survival Hunter'],
    'Mage': ['Arcane Mage', 'Fire Mage', 'Frost Mage'],
    'Monk': ['Brewmaster Monk', 'Mistweaver Monk', 'Windwalker Monk'],
    'Paladin': ['Holy Paladin', 'Protection Paladin', 'Retribution Paladin'],
    'Priest': ['Discipline Priest', 'Holy Priest', 'Shadow Priest'],
    'Rogue': ['Assassination Rogue', 'Outlaw Rogue', 'Subtlety Rogue'],
    'Shaman': ['Elemental Shaman', 'Enhancement Shaman', 'Restoration Shaman'],
    'Warlock': ['Affliction Warlock', 'Demonology Warlock', 'Destruction Warlock'],
    'Warrior': ['Arms Warrior', 'Fury Warrior', 'Protection Warrior'],
    'Demon Hunter': ['Havoc Demon Hunter', 'Vengeance Demon Hunter'],
};


const ClassSearch = ({ selectedSpecs, setSelectedSpecs }) => {

    const toggleClassSelection = (className: string) => {
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
        if (selectedSpecs.includes(spec)) {
            setSelectedSpecs(selectedSpecs.filter(selected => selected !== spec));
        } else {
            setSelectedSpecs([...selectedSpecs, spec]);
        }
    };

    return (
        <div className='flex justify-between w-full bg-gray-800 rounded-lg p-4'>
            {Object.keys(classSpecs).map((className, index) => (
                <div key={index} className='text-center'>
                    <Image
                        src={classIconsMap[className as keyof typeof classIconsMap]}
                        alt={className}
                        width={30}
                        height={30}
                        className={`rounded-lg overflow-hidden cursor-pointer ${
                            classSpecs[className]?.every(spec => selectedSpecs.includes(spec)) ? 'border-2 border-blue-500' : ''
                        }`}
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
                                className={`rounded-lg overflow-hidden cursor-pointer ${
                                    selectedSpecs.includes(spec) ? 'border-2 border-blue-500' : ''
                                }`}
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
