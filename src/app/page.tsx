'use client'
import { useState, useEffect } from "react";
import ScrollTab from "~/components/ScrollTab";
import axios from "axios";
import { FiLoader } from "react-icons/fi";  // Import spinner icon from react-icons
import LeaderboardRow from "~/components/LeaderBoardRow";


const searchTabs = [
  { name: 'rank', label: 'Rank' },
  { name: 'character_spec', label: 'Spec' },
  { name: 'character_name', label: 'Name' },
  { name: 'rating', label: 'Rating' },
  { name: 'realm_slug', label: 'Realm' },
  { name: 'faction_name', label: 'Faction' },
  { name: 'played', label: 'Played' },
  { name: 'won', label: 'Won' },
  { name: 'lost', label: 'Lost' },
  { name: 'updated_at', label: 'Last Played' },
];

export default function HomePage() {

  const resultsPerPage = 50;
  const rowHeight = 40;
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsCount, setResultsCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/get50Results?page=${currentPage}`);
        setResultsCount(response.data.total);
        setData(response.data.results);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [currentPage]);

  return (
    <main className="flex min-h-screen bg-gradient-to-b from-[#000080] to-black text-white relative">
      <div className="flex flex-col w-full gap-4">
        {/* Area for statistics for the chosen pvp bracket */}
        <div className="flex h-96 bg-white rounded-xl"></div>
        <ScrollTab setCurrentPage={setCurrentPage} currentPage={currentPage} resultsCount={resultsCount} resultsPerPage={resultsPerPage} />
        <div className="flex h-16 bg-black justify-between rounded-xl">
          {searchTabs.map((tab, index) => (
            <div key={tab.name} className={`flex items-center justify-center text-white text-center h-full w-full '} `}>{tab.label}</div>
          ))}
        </div>
        <div className={`relative flex flex-col w-full  h-[2000px]`}>
          {loading && (
            <div className="absolute inset-0 flex flex-col py-48 justify-between items-center bg-black bg-opacity-50 z-50">
              <FiLoader className="animate-spin text-white" size={50} />
              <FiLoader className="animate-spin text-white" size={50} />
              <FiLoader className="animate-spin text-white" size={50} />
            </div>
          )}
          {!loading && data.map((characterData: {[key: string]: any }) => (
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
        <ScrollTab setCurrentPage={setCurrentPage} currentPage={currentPage} resultsCount={resultsCount} resultsPerPage={resultsPerPage} />
      </div>

    </main>
  );
}
