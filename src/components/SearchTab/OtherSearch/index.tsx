import RegionSearch from './RegionSearch';
import FactionSearch from './FactionSearch';
import RealmSearch from './RealmSearch';
import RatingSearch from './RatingSearch';
import BracketSearch from './BracketSearch';

const OtherSearch = () => {

    return (
        <div className='flex h-20 w-full bg-gray-800 rounded-lg justify-between gap-4 px-1 py-1'>
            <RegionSearch />
            <FactionSearch />
            <BracketSearch />
            <RealmSearch />
            <RatingSearch />

        </div>
    );
};

export default OtherSearch;
