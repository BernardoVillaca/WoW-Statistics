'use client'
import { useState, useEffect, useRef } from "react";
import ScrollTab from "~/components/ScrollTab";
import axios from "axios";
import { FiLoader } from "react-icons/fi";  // Import spinner icon from react-icons
import LeaderboardRow from "~/components/LeaderBoardRow";
import SearchTab from "~/components/SearchTab";
import { useRouter } from 'next/navigation'
import { SearchProvider, useSearch } from "~/components/Context/SearchContext";


const searchTabs = [
  { name: 'rank', label: 'Rank' },
  { name: 'character_name', label: 'Name' },
  { name: 'rating', label: 'Rating' },
  { name: 'character_spec', label: 'Spec' },
  { name: 'realm_slug', label: 'Realm' },
  { name: 'faction_name', label: 'Faction' },
  { name: 'played', label: 'Played' },
  { name: 'win_ratio', label: 'Win Ratio' },
  { name: 'updated_at', label: 'Last Played' },
];

const HomePage = () => {

  const { currentPage, resultsCount, setResultsCount, selectedSpecs, faction, region, bracket, realm, minRatingSearch, maxRatingSearch, minRating, maxRating } = useSearch();

  const resultsPerPage = 50;
  const rowHeight = 40;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const router = useRouter();
  const queryParams: string[] = [];
  const [refreshCount, setRefreshCount] = useState(0); // Ugly workaround. Used to prevent the useEffect from running on the second render

  useEffect(() => {
    const getData = async () => {
      setRefreshCount(refreshCount + 1);
      if (refreshCount === 1) return
      setLoading(true);
      if (currentPage > 1) queryParams.push(`page=${currentPage}`)
      if (bracket !== '3v3') queryParams.push(`bracket=${bracket}`);
      if (selectedSpecs.length > 0) queryParams.push(`search=${encodeURIComponent(selectedSpecs.join(','))}`)
      if (faction !== '') queryParams.push(`faction=${faction}`);
      if (region === 'eu') queryParams.push(`region=${region}`);
      if (realm !== '') queryParams.push(`realm=${realm.toLocaleLowerCase()}`);
      if (minRatingSearch !== minRating) queryParams.push(`minRating=${minRatingSearch}`);
      if (maxRatingSearch !== maxRating) queryParams.push(`maxRating=${maxRatingSearch}`);

      if (queryParams.length > 0) {
        router.push(`?${queryParams.join('&')}`);
        const response = await axios.get(`/api/get50Results/?${queryParams.join('&')}`);
        setResultsCount(response.data.total);
        setData(response.data.results);
        setLoading(false);
      } else {
        setLoading(true);
        router.push('/')
        const response = await axios.get(`/api/get50Results`);
        setResultsCount(response.data.total);
        setData(response.data.results);
        setLoading(false);
      }

    };

    getData();
  }, [currentPage, faction, selectedSpecs, region, bracket, realm, minRatingSearch, maxRatingSearch]);

  return (
    <main className="flex min-h-screen bg-gradient-to-b from-[#000080] to-black text-white relative">
      <div className="flex flex-col w-full gap-4 pt-4">
        <SearchTab />
        <ScrollTab resultsPerPage={resultsPerPage} />
        <div className="flex h-16 bg-black justify-between rounded-xl">
          {searchTabs.map((tab, index) => (
            <div key={tab.name} className={`flex items-center justify-center text-white text-center h-full w-full '} `}>{tab.label}</div>
          ))}
        </div>
        <div className={`relative flex flex-col w-full ${resultsCount === 0 ? 'h-[2000px]' : ''}`}>
          {loading && (
            <div className="absolute h-[2000px] inset-0 flex flex-col py-48 justify-between items-center bg-black bg-opacity-50 z-50">
              <FiLoader className="animate-spin text-white" size={50} />
              <FiLoader className="animate-spin text-white" size={50} />
              <FiLoader className="animate-spin text-white" size={50} />
            </div>
          )}
          {!loading && data.map((characterData: { [key: string]: any }) => (
            characterData.character_class !== '' ? (
              <LeaderboardRow
                key={characterData.id}
                characterData={characterData}
                searchTabs={searchTabs}
                rowHeight={rowHeight}
              />
            ) : null
          ))}
        </div>
        {!loading &&
          <ScrollTab resultsPerPage={resultsPerPage} />
        }
      </div>
    </main>
  );
}

const HomePageWrapper = () => (
  <SearchProvider>
    <HomePage />
  </SearchProvider>
);

export default HomePageWrapper;
