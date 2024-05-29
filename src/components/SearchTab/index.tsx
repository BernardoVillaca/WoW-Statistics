'use client'


import React, { Dispatch, SetStateAction } from 'react';
import ClassSearch from './ClassSearch'
import OtherSearch from './OtherSearch'



const SearchTab = ({ selectedSpecs, setSelectedSpecs} : {selectedSpecs: string[], setSelectedSpecs: Dispatch<SetStateAction<string[]>>}) => {
    return (
        <div className='flex flex-col gap-4'>
            <ClassSearch selectedSpecs={selectedSpecs} setSelectedSpecs={setSelectedSpecs} />
            <OtherSearch />
        </div>
    )
}

export default SearchTab