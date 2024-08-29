import RegionSearch from './RegionSearch';
import FactionSearch from './FactionSearch';
import RealmSearch from './RealmSearch';
import RatingSearch from './RatingSearch';
import BracketSearch from './BracketSearch';

const OtherSearch = ({ isShuffle }: { isShuffle: boolean }) => {

    return (
        <div className='flex h-20 w-full bg-secondary-light_black rounded-lg justify-between gap-4 p-1'>
            <RegionSearch partofLeadeboard={true}/>
            <FactionSearch />
            {!isShuffle ? <BracketSearch partofLeadeboard={true}/>: null}
            <RealmSearch />
            <RatingSearch />

        </div>
    );
};

export default OtherSearch;
