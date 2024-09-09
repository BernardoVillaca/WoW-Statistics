import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiLoader } from 'react-icons/fi';
import specIconsMap from '~/utils/helper/specIconsMap';
import { capitalizeFirstLetter } from '~/utils/helper/capitalizeFirstLetter';


interface ClassicTalentsTabProps {
    params: {
        version: string | null;
        region: string | null;
        name: string | null;
        realm: string | null;
        class: string | null;
        spec: string  | null;
    };
}

interface ClassicTalent {
    talent: { id: number };
    spell_tooltip: {
        description: string;
        cast_time: string;
        cooldown?: string;
        power_cost?: string;
        spell: {
            name: string
        }
    };
    talent_rank: number;
}

interface SpecializationDataItem {
    specialization_name: string;
    talents: ClassicTalent[];
}

const ClassicTalentsTab = ({ params }: ClassicTalentsTabProps) => {
    const [specializationData, setSpecializationData] = useState<SpecializationDataItem[]>([]);
    
    const [loading, setLoading] = useState(true);
    console.log(specializationData)
    useEffect(() => {        
        
        const getTalentsData = async () => {
            setLoading(true);
            if (params.version && params.region && params.name && params.realm) {
                const response = await axios.get<{specs : SpecializationDataItem[]}>('/api/getTalentsData', {
                    params: {
                        name: params.name,
                        realm: params.realm,
                        region: params.region,
                        version: params.version
                    }
                });
                setSpecializationData(response.data.specs ?? []);
            }
            setLoading(false);
        };
        void getTalentsData();
    }, [params]);

    return (
        <div className='flex flex-col items-center w-full bg-secondary-light_black gap-4 min-h-[850px] pt-4'>
            <span className='text-2xl font-bold pt-2'>Talents</span>

            {loading ? (
                <div className="h-full flex justify-center items-center">
                    <FiLoader className="animate-spin text-white" size={50} />
                </div>
            ) : (
                <div className='w-full h-full px-12'>
                    {specializationData.map((spec, specIndex) => (
                        <div key={specIndex} className='flex flex-col gap-4 mb-6'>
                            {/* Spec icon and name */}
                            <div className="flex items-center gap-2">
                                <Image
                                    alt={spec.specialization_name}
                                    src={specIconsMap[ `${capitalizeFirstLetter(spec.specialization_name)} ${params.class && capitalizeFirstLetter(params.class)}` as keyof typeof specIconsMap]}  
                                    height={40}
                                    width={40}
                                    className='rounded-lg'
                                />
                                
                            </div>                         
                            <ul className='list-disc list-inside p-3 border-[1px] border-gray-500 rounded-lg'>
                                {spec.talents?.map((talent, index) => (
                                    <li key={index} className='text-gray-300'>
                                        <strong>{talent.spell_tooltip?.spell?.name}</strong> (Rank {talent.talent_rank}): 
                                       
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClassicTalentsTab;
