'use client'
import { useState, useEffect } from "react";
import LeaderboardRow from "~/components/LeaderboardRow";
import ScrollTab from "~/components/ScrollTab";
import axios from "axios";
import { FiLoader } from "react-icons/fi";  // Import spinner icon from react-icons


const searchTabs = [
  { name: 'rank', label: 'Rank', width: '' },
  { name: 'character_name', label: 'Name', width: '' },
  { name: 'rating', label: 'Rating', width: '' },
  { name: 'realm_slug', label: 'Realm', width: '' },
  { name: 'character_class', label: 'Class', width: '' },
  { name: 'character_spec', label: 'Spec', width: '' },
  { name: 'faction_name', label: 'Faction', width: '' },
  { name: 'played', label: 'Played', width: '' },
  { name: 'won', label: 'Won', width: '' },
  { name: 'lost', label: 'Lost', width: 'w' },
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
    <main className="flex min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white relative">
      <div className="flex flex-col w-full gap-4">
        {/* Area for statistics for the chosen pvp bracket */}
        <div className="flex h-96 bg-white"></div>
        <ScrollTab setCurrentPage={setCurrentPage} currentPage={currentPage} resultsCount={resultsCount} resultsPerPage={resultsPerPage} />
        <div className="flex h-16 bg-black justify-between">
          {searchTabs.map((tab, index) => (
            <div key={tab.name} className={`flex items-center justify-center text-white text-center h-full w-full ${index === 0 ? '' : 'border-l-[1px]'} ${tab.width}`}>{tab.label}</div>
          ))}
        </div>
        <div className={`relative flex flex-col w-full h-[2000px]`}>
          {loading && (
            <div className="absolute inset-0 flex flex-col py-48 justify-between items-center bg-black bg-opacity-50 z-50">
              <FiLoader className="animate-spin text-white" size={50} />
              <FiLoader className="animate-spin text-white" size={50} />
              <FiLoader className="animate-spin text-white" size={50} />
            </div>
          )}
          {!loading && data.map((leaderboardRow: { [key: string]: any }) => (
            <div key={leaderboardRow.id} className="bg-gray-800 flex justify-between w-full" style={{ height: `${rowHeight}px` }}> {/* Set a fixed height for each row */}
              {searchTabs.map((tab, index) => (
                <LeaderboardRow key={`${leaderboardRow.id}-${tab.name}`} height={rowHeight} index={index} text={leaderboardRow[tab.name]} />
              ))}
            </div>
          ))}
        </div>
        <ScrollTab setCurrentPage={setCurrentPage} currentPage={currentPage} resultsCount={resultsCount} resultsPerPage={resultsPerPage} />
      </div>

    </main>
  );
}
