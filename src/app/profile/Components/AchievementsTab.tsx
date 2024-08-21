import axios from 'axios';
import React, { use, useEffect } from 'react'


interface ActitivityTabProps {
    params: {
        version: string | null;
        region: string | null;
        name: string | null;
        realm: string | null;
    };
}

const AchievementsTab = ({ params }: ActitivityTabProps) => {

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

            }
        }
        void getAchievementData()
    }, [params])



    return (
        <div className='flex place-content-center h-[300px]  bg-gray-800'>
            Achievements
        </div>
    )
}

export default AchievementsTab