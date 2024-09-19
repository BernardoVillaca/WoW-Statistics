import axios from "axios";
import { useEffect, useState } from "react";
import useURLChange from "~/utils/hooks/useURLChange";
import { CharacterData, QueryParams } from "./LeaderboardTable/types";
import { FiLoader } from "react-icons/fi";
import LeaderboardRow from "./LeaderboardTable/LeaderboardRow";
import { searchTabs } from "~/utils/helper/searchTabsMap";
import { set } from "zod";



type MostActivePlayersResponse = {
    results: CharacterData[];
    total: number;
};

type Params = {
    resultsPerPage: number;
    version: string;
    region: string;
    bracket: string;
    orderBy: string;
};


const MostActivePlayers = () => {
    const [data, setData] = useState<CharacterData[]>([]);
    const [loading, setLoading] = useState(true);
    const [paramsToUse, setParamsToUse] = useState({} as Params);

    const queryParams = useURLChange();

    const getQueryParams = () => {
        const params = new URLSearchParams(queryParams ?? '');
        return {
            resultsPerPage: 10,
            version: params.get('version') ?? 'retail',
            region: params.get('region') ?? 'us',
            bracket: params.get('bracket') ?? '3v3',
            orderBy: 'played',

        };
    };
      
    const getData = async () => {
        setLoading(true);
        const params = getQueryParams();
        setParamsToUse(params);
        const response = await axios.get<MostActivePlayersResponse>('/api/get50Results', {
            params,
        });
        setData(response.data.results);
        setLoading(false);
    }

    useEffect(() => {
        if (queryParams !== null) {
          void getData();
        }
      }, [queryParams]);
    

    return (
        <div className="flex flex-col gap-4 p-4 border-24 border-[1px] rounded border-opacity-30 border-secondary-gray items">
            <span className="text-center text-xl">Biggest Nerds</span>
            <div className="flex h-8 bg-secondary-light_black text-gray-300 justify-between ">
                {searchTabs.map((tab) => (
                    <div key={tab.name} className={`flex items-center justify-center text-white text-center h-full w-full '} `}>{tab.label}</div>
                ))}
            </div>
            <div className="bg-secondary-light_black rounded-xl">
                {loading ? (
                    <div className='flex items-center place-content-center w-full h-[400px]'>
                        <FiLoader className="animate-spin text-gray-300" size={50} />
                    </div>
                ) : (
                    <>
                        {data.length > 0 ? (
                            data.map((characterData, index) => (
                                <LeaderboardRow
                                    rowIndex={index}
                                    queryParams={paramsToUse}
                                    key={`${characterData.id}-${index}`}
                                    characterData={characterData}
                                    searchTabs={searchTabs}
                                    rowHeight={40}
                                />
                            ))
                        ) : (
                            <div className='flex items-center place-content-center w-full h-[400px]'>
                                <p>No data available.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>


    )
}

export default MostActivePlayers