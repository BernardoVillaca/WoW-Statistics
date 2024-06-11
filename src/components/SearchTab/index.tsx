'use client'
import ClassSearch from './ClassSearch'
import OtherSearch from './OtherSearch'


const SearchTab = ({isShuffle} : {isShuffle: boolean}) => {
    return (
        <div className='flex flex-col gap-4'>
            <ClassSearch />
            <OtherSearch isShuffle={isShuffle}/>           
        </div>
    )
}

export default SearchTab