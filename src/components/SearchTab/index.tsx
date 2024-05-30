'use client'
import ClassSearch from './ClassSearch'
import OtherSearch from './OtherSearch'


const SearchTab = () => {
    return (
        <div className='flex flex-col gap-4'>
            <ClassSearch />
            <OtherSearch/>           
        </div>
    )
}

export default SearchTab