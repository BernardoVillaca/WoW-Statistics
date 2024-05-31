import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useSearch } from '~/components/Context/SearchContext';
import { FiChevronDown, FiLoader } from 'react-icons/fi';

interface Realm {
    id: number;
    realm_name: string;
}

const RealmSearch = () => {
    const [realmList, setRealmList] = useState<Realm[]>([]);
    const [filteredRealmList, setFilteredRealmList] = useState<Realm[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const [isDataFetched, setIsDataFetched] = useState(false);
    const { realm, setRealm } = useSearch();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`/api/getRealms`);
                if (response.data && response.data.realmList) {
                    setRealmList(response.data.realmList);
                    setFilteredRealmList(response.data.realmList);
                    setIsDataFetched(true);
                } else {
                    console.error('Invalid data format', response.data);
                }
            } catch (error) {
                console.error('Error fetching realms:', error);
            }
        };
        getData();
    }, []);

    const handleFocus = () => {
        setRealm('');
        setIsOpen(true);
        setHighlightedIndex(-1);
    }

    const handleChange = (value: string) => {
        setRealm(value);
        setIsOpen(true);
        const filtered = realmList.filter((realm) =>
            realm.realm_name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredRealmList(filtered);
        setHighlightedIndex(-1); // Reset highlighted index on input change
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) setIsOpen(true);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex((prevIndex) => {
                    const newIndex = prevIndex < filteredRealmList.length - 1 ? prevIndex + 1 : prevIndex;
                    return newIndex;
                });
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex((prevIndex) => {
                    const newIndex = prevIndex > 0 ? prevIndex - 1 : prevIndex;
                    return newIndex;
                });
                break;
            case 'Enter':
                if (highlightedIndex >= 0 && highlightedIndex < filteredRealmList.length) {
                    e.preventDefault();
                    const selectedRealm = filteredRealmList[highlightedIndex];
                    if (selectedRealm) {
                        setRealm(selectedRealm.realm_name);
                        if (inputRef.current) {
                            inputRef.current.blur();
                        }
                    }
                    setIsOpen(false);
                }
                break;
            default:
                break;
        }
    };

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
        setHighlightedIndex(-1);
        if (!isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    };

    useEffect(() => {
        if (isOpen && highlightedIndex !== -1) {
            const item = document.getElementById(`realm-${highlightedIndex}`);
            if (item) {
                item.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [highlightedIndex, isOpen]);


    if (!isDataFetched) {
        return <div className='flex flex-col items-center justify-center w-1/5 p-4 rounded-lg border border-gray-700'>
          <FiLoader className="animate-spin text-white" size={50} />
        </div>;
      }

    return (
        <div className='relative flex text-black items-center justify-center w-1/5 rounded-lg border-[1px] border-gray-700'>
            <input
                ref={inputRef}
                placeholder='Search Realm'
                value={realm}
                onFocus={() => handleFocus()}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-32 h-8 px-2 text-center text-black bg-gray-300 border-none focus:outline-none"
            />
            <button
                className='bg-gray-400 w-8 h-8 items-center justify-center flex'
                onClick={toggleDropdown}
            >
                <FiChevronDown className={`${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div 
                    className='absolute top-12 w-40 max-h-24 bg-gray-600 border-[1px] border-gray-700 overflow-auto snap-mandatory snap-y'
                >
                    {filteredRealmList.length > 0 ? (
                        filteredRealmList.map((realm, index) => (
                            <div
                                id={`realm-${index}`}
                                key={realm.id}
                                onClick={() => {
                                    setRealm(realm.realm_name);
                                    setIsOpen(false);
                                }}
                                className={`flex cursor-pointer hover:bg-gray-400 snap-start items-center justify-center ${highlightedIndex === index ? 'bg-gray-500' : ''}`}
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
