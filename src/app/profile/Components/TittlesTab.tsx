import axios from 'axios';
import React, { useEffect, useState } from 'react';
import rankOneIcon from '../../../assets/Other/rankOneIcon.png';
import gladiatorIcon from '../../../assets/Other/gladiatorIcon.png';
import heroIcon from '../../../assets/Other/heroIcon.png';
import rankOneSolo from '../../../assets/Other/rankOneSolo.png';
import legendIcon from '../../../assets/Other/legendIcon.png';
import Image, { type StaticImageData } from 'next/image';
import { FiLoader } from 'react-icons/fi';

interface TittleTabProps {
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

interface Titles {
    rankOneTitles?: string[];
    gladiatorTitles?: string[];
    heroTitles?: string[];
    rankOneLegendTitles?: string[];
    legendTitles?: string[];
}

const TittlesTab = ({ params }: TittleTabProps) => {
    const [titles, setTitles] = useState<Titles>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAchievementData = async () => {
            setLoading(true);
            if (params.version && params.region && params.name && params.realm) {
                const response = await axios.get('/api/getAchievementData', {
                    params: {
                        name: params.name,
                        realm: params.realm,
                        region: params.region,
                        version: params.version,
                    }
                });

                setTitles(response.data as Titles);
                setLoading(false);
            }
        };
        void getAchievementData();
    }, [params]);

    return (
        <div className="flex flex-col items-center bg-secondary-light_black p-4 h-[200px]">
            <h1 className="text-2xl font-bold">Titles</h1>
            {loading ? (
                <div className="h-full flex flex-col place-content-center items-center bg-secondary-light_black bg-opacity-50">
                    <FiLoader className="animate-spin text-white" size={50} />
                </div>
            ) : (
                <div className="flex gap-4 pt-4">
                    {Object.entries(titles).map(([name, values], index) => (
                        <div key={index} className="relative flex items-center border-[1px] border-secondary-gray border-opacity-30 p-1 rounded-2xl">
                            {tittleIconsObj[name as TitleKey] && (
                                <Image src={tittleIconsObj[name as TitleKey]} alt={name} width={80} />
                            )}
                            <span className="absolute bottom-0 right-0 rounded-full h-6 w-6 bg-gray-700 text-center">
                                {(values as string[]).length}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TittlesTab;
