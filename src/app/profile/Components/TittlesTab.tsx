import axios from 'axios';
import React, { useEffect, useState } from 'react'
import rankOneIcon from '../../../assets/Other/rankOneIcon.png'
import gladiatorIcon from '../../../assets/Other/gladiatorIcon.png'
import heroIcon from '../../../assets/Other/heroIcon.png'
import rankOneSolo from '../../../assets/Other/rankOneSolo.png'
import legendIcon from '../../../assets/Other/legendIcon.png'
import Image, { StaticImageData } from 'next/image';

interface ActitivityTabProps {
    params: {
        version: string | null;
        region: string | null;
        name: string | null;
        realm: string | null;
    };
}

type TitleKey = 'rankOneTitles' | 'gladiatorTitles' | 'heroTitles' | 'rankOneLegendTitles' | 'legendTitles';

const tittleIconsObj: Record<TitleKey, StaticImageData> = {
    rankOneTitles: rankOneIcon,
    gladiatorTitles: gladiatorIcon,
    rankOneLegendTitles: rankOneSolo,
    legendTitles: legendIcon,
    heroTitles: heroIcon,
};


const TittlesTab = ({ params }: ActitivityTabProps) => {
    const [titles, setTitles] = useState({})


    useEffect(() => {
        const getAchievementData = async () => {
            if (params.version && params.region && params.name && params.realm) {
                const response = await axios.get('/api/getAchievementData',
                    {
                        params: {
                            name: params.name,
                            realm: params.realm,

                        }
                    })

                setTitles(response.data)

            }
        }
        void getAchievementData()
    }, [params])


    console.log(titles)
    return (
        <div className="flex flex-col  items-center bg-gray-800 p-4">
            <h1 className="text-2xl font-bold">Titles</h1>
            <div className='flex gap-4 py-4'>
                {Object.entries(titles).map(([name, values], index) => (
                    <div key={index} className=" relative flex items-center border-[1px] border-gray-500 p-1 rounded-2xl">
                        {tittleIconsObj[name as TitleKey] && (
                            <Image src={tittleIconsObj[name as TitleKey]} alt={name} width={80} height={80} />
                        )}
                        <span className='absolute bottom-0 right-0 rounded-full h-6 w-6 bg-gray-700 text-center'>{(values as any[]).length}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TittlesTab