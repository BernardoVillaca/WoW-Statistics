'use client'

import axios from 'axios'
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { classSpecIconsMap } from '~/utils/helper/specIconsMap';

interface TalentsTabProps {
    params: {
        version: string | null;
        region: string | null;
        name: string | null;
        realm: string | null;
        class: string | null;
    };
}

interface SpecializationDataItem {
    specialization: {
        name: string;
        id: number;
        key: { href: string };
    };
    loadouts: {
        is_active: boolean;
        selected_class_talent_tree: {
            key: { href: string };
            name: string;
        };
        selected_class_talents: {
            id: number;
            rank: number;
            tooltip: {
                spell_tooltip: {
                    cast_time: string;
                    cooldown: string;
                    description: string;
                    power_cost: string;
                };
                talent: {
                    id: number;
                    key: { href: string };
                    name: string;
                };
            };
        }[];
    }[];
}


const TalentsTab = ({ params }: TalentsTabProps) => {
    const [activeSpec, setActiveSpec] = useState({})
    const [characterClass, setCharacterClass] = useState<string>('')
    const [specializationData, setSpecializationData] = useState<SpecializationDataItem[]>([])
    const [loading, setLoading] = useState(true)
    const [displayedSpec, setDisplayedSpec] = useState<string>('')

    useEffect(() => {
        if (params.class) setCharacterClass(params.class)

        const getTalentsData = async () => {
            setLoading(true)
            if (params.version && params.region && params.name && params.realm) {
                const response = await axios.get('/api/getTalentsData', {
                    params: {
                        name: params.name,
                        realm: params.realm,
                        region: params.region,
                        version: params.version
                    }
                })
                setSpecializationData(response.data.specs || []) // Handle potential undefined data
                setActiveSpec(response.data.activeSpec || {})
                setDisplayedSpec(response.data.activeSpec?.name || '') // Handle potential undefined name
            }
            setLoading(false)
        }
        void getTalentsData()
    }, [params])

    const currentTalents = specializationData.find(
        (item) => item?.specialization?.name === displayedSpec
    );

    // Extract talent names from the first loadout if available
    const talentNames = currentTalents?.loadouts?.[0]?.selected_class_talents?.map((talent) => {
        return talent?.tooltip?.talent?.name;
    }) || [];
    
    console.log(currentTalents);
    

    return (
        <div className='flex flex-col place-content-top items-center w-full bg-gray-800 gap-4'>
            <span className='text-2xl font-bold pt-2'>
                Talents
            </span>
            <div className="flex justify-between w-full px-12 ">
                {characterClass && Object.entries(classSpecIconsMap[characterClass as keyof typeof classSpecIconsMap]).map(([specName, specIcon]) => (
                    <button
                        key={specName}
                        className={`flex w-32 place-content-center items-center p-2 border-[1px] border-gray-500 rounded-lg ${displayedSpec === specName ? 'bg-gray-700' : ''}`}
                        onClick={() => setDisplayedSpec(specName)}
                    >
                        <Image alt={specName} src={specIcon} height={40} width={40} className='rounded-lg overflow-hidden' />
                    </button>
                ))}
            </div>
            <div className='w-full px-12'>
                <h3 className='text-xl font-semibold mt-4'>Class Talents:</h3>
                <ul className='list-disc list-inside'>
                    {talentNames.length > 0 ? (
                        talentNames.map((name, index) => (
                            <li key={index} className='text-gray-300'>
                                {name}
                            </li>
                        ))
                    ) : (
                        <li className='text-gray-300'>No talents available.</li>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default TalentsTab
