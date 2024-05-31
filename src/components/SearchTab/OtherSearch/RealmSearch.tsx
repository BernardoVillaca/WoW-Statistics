import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSearch } from '~/components/Context/SearchContext';
import { FiChevronDown } from 'react-icons/fi';

interface Realm {
    id: number;
    realm_name: string;
}

const RealmSearch = () => {
    const [realmList, setRealmList] = useState<Realm[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const { realm, setRealm } = useSearch();

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`/api/getRealms`);
                if (response.data && response.data.realmList) {
                    setRealmList(response.data.realmList[0]); // Adjusting for the nested array
                } else {
                    console.error('Invalid data format', response.data);
                }
            } catch (error) {
                console.error('Error fetching realms:', error);
            }
        };
        getData();
    }, []);

    return (
        <div className='relative flex text-black items-center justify-center w-1/4 rounded-lg border-[1px] border-gray-700'>
            <input
                type="number"
                min={1}
                value={realm}
                onChange={(e) => setRealm(e.target.value)}
                className="w-32 h-8 px-2 text-center text-black bg-gray-300 border-none focus:outline-none"
            />
            <button
                className='bg-gray-400 w-8 h-8 items-center justify-center flex'
                onClick={() => setIsOpen(!isOpen)}
            >
                <FiChevronDown className={`${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className='absolute top-12 w-40 h-24 bg-gray-600 border-[1px] border-gray-700 overflow-auto snap-mandatory snap-y'>
                    {realmList.length > 0 ? (
                        realmList.map((realm) => (
                            <div
                                key={realm.id}
                                onClick={() => {
                                    setRealm(realm.realm_name);
                                    setIsOpen(false);
                                }}
                                className='flex cursor-pointer hover:bg-gray-400 snap-start items-center justify-center'
                            >
                                {realm.realm_name}
                            </div>
                        ))
                    ) : (
                        <div className='p-2'>No realms available</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RealmSearch;
