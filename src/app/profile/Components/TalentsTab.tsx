'use client'

import axios from 'axios'
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { FiCheck, FiLoader } from 'react-icons/fi';
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
        talent_loadout_code: string;
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
        selected_spec_talents: {
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
        selected_hero_talents: {
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
    const [copied, setCopied] = useState(false);

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
                setSpecializationData(response.data.specs || [])
                setActiveSpec(response.data.activeSpec || {})
                setDisplayedSpec(response.data.activeSpec?.name || '')
            }
            setLoading(false)
        }
        void getTalentsData()
    }, [params])

    const currentTalents = specializationData.find(
        (item) => item?.specialization?.name === displayedSpec
    );

    const handleClick = () => {
        // Copy the loadout code to the clipboard
        navigator.clipboard.writeText(currentTalents?.loadouts?.[0]?.talent_loadout_code || '');

        // Show the copied animation
        setCopied(true);

        // Revert back to the original state after 2 seconds
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };



    // Extract talent names from the first loadout if available
    const classTalents = currentTalents?.loadouts?.[0]?.selected_class_talents
        ?.filter((talent) => talent?.tooltip) // Only include talents that have a tooltip
        ?.map((talent) => talent?.tooltip?.talent?.name) || [];

    const specTalents = currentTalents?.loadouts?.[0]?.selected_spec_talents
        ?.filter((talent) => talent?.tooltip) // Only include talents that have a tooltip
        ?.map((talent) => talent?.tooltip?.talent?.name) || [];

    const heroTalents = currentTalents?.loadouts?.[0]?.selected_hero_talents
        ?.filter((talent) => talent?.tooltip) // Only include talents that have a tooltip
        ?.map((talent) => talent?.tooltip?.talent?.name) || [];





    return (
        <div className='flex flex-col place-content-top items-center w-full bg-secondary-light_black gap-4 h-[1330px]'>
            <span className='text-2xl font-bold pt-2'>
                Talents
            </span>
            <div className="flex justify-between w-full px-12 h-14">
                {characterClass && Object.entries(classSpecIconsMap[characterClass as keyof typeof classSpecIconsMap]).map(([specName, specIcon]) => (
                    <button
                        key={specName}
                        className={`flex w-32 place-content-center items-center p-2 border-[1px] border-gray-500 hover:bg-secondary-navy rounded-lg ${displayedSpec === specName ? 'bg-secondary-navy' : ''}`}
                        onClick={() => setDisplayedSpec(specName)}
                    >
                        <Image alt={specName} src={specIcon} height={40} width={40} className='rounded-lg overflow-hidden' />
                    </button>
                ))}
            </div>
            <div className='w-full h-full px-12'>
                {loading ? (
                    <div className="h-full flex flex-col justify-between items-center bg-secondary-light_black py-16">
                        <FiLoader className="animate-spin text-white" size={50} />
                        <FiLoader className="animate-spin text-white" size={50} />
                        <FiLoader className="animate-spin text-white" size={50} />
                    </div>

                ) : (
                    <div className='flex flex-col gap-4'>
                        <button
                            className={`border-[1px] rounded-lg py-2 flex items-center place-content-center gap-2 transition-all duration-300 hover:bg-secondary-navy ${copied ? 'border-green-500' : 'border-gray-500'
                                }`}
                            onClick={handleClick}
                        >
                            {copied ? (
                                <>
                                    <FiCheck className="text-green-500" />
                                    <span>Copied!</span>
                                </>
                            ) : (
                                <span>Copy loadout code</span>
                            )}
                        </button>
                        <div className='flex justify-between gap-4'>
                            <div className='flex flex-col gap-4 border-[1px] p-3 border-gray-500 rounded-lg w-1/2'>
                                <h3 className='text-xl font-semibold text-center'>Class Talents:</h3>
                                <ul className='list-disc list-inside'>
                                    {classTalents.length > 0 ? (
                                        classTalents.map((name, index) => (
                                            <li key={index} className='text-gray-300'>
                                                {name}
                                            </li>
                                        ))
                                    ) : (
                                        <li className='text-gray-300'>No talents available.</li>
                                    )}
                                </ul>
                            </div>
                            <div className='flex flex-col gap-4 border-[1px] p-3 border-gray-500 rounded-lg w-1/2'>
                                <h3 className='text-xl font-semibold text-center'>Spec Talents:</h3>
                                <ul className='list-disc list-inside'>
                                    {specTalents.length > 0 ? (
                                        specTalents.map((name, index) => (
                                            <li key={index} className='text-gray-300'>
                                                {name}
                                            </li>
                                        ))
                                    ) : (
                                        <li className='text-gray-300'>No talents available.</li>
                                    )}
                                </ul>
                            </div>
                        </div >
                        <div className='flex flex-col gap-4 items-center '>
                            <div className='border-[1px] p-3 border-gray-500 rounded-lg w-1/2'>
                                <h3 className='text-xl font-semibold text-center'>Hero Talents:</h3>
                                <ul className='list-disc list-inside'>
                                    {heroTalents.length > 0 ? (
                                        heroTalents.map((name, index) => (
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
                    </div>
                )}
            </div>
        </div>
    )
}

export default TalentsTab
