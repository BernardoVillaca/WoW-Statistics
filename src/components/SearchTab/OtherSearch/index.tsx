import Image from 'next/image';
import { useSearch } from '../../Context/SearchContext';
import usImage from '../../../assets/Regions/us.png';
import euImage from '../../../assets/Regions/eu.png';
import RegionSearch from './RegionSearch';
import FactionSearch from './FactionSearch';
import RealmSearch from './RealmSearch';
import RatingSearch from './RatingSearch';

const OtherSearch = () => {
    const { region, setRegion, faction, setFaction, realm, setRealm, rating, setRating } = useSearch();

    return (
        <div className='flex h-20 w-full bg-gray-800 rounded-lg justify-between gap-4 px-1 py-1'>
            <RegionSearch />
            <FactionSearch />
            <RealmSearch />
            <RatingSearch />
            
        </div>
    );
};

export default OtherSearch;
