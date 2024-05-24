import LeaderboardRow from "~/components/LeaderboardRow";
import ScrollTab from "~/components/ScrollTab";
import { asc } from "drizzle-orm";
import { db } from "~/server/db";
import { leaderboard } from "~/server/db/schema";

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

export default async function HomePage() {
  
  const results = await db.query.leaderboard.findMany({
    limit: 50,
    orderBy: [asc(leaderboard.rank)]
  });


  return (
    <main className="flex min-h-screen bg-gradient-to-b  from-[#2e026d] to-[#15162c] text-white ">
      <div className="flex flex-col  bg-gradient-to-b w-full from-[#2e026d] to-[#15162c]">
        {/* Area for statistics for the chosen pvp bracket */}
        <div className="flex h-96  bg-white"></div>
        <ScrollTab />
        <div className="flex h-16 bg-black justify-between ">
          {searchTabs.map((tab, index) => (
            <div key={tab.name} className={`flex items-center justify-center text-white text-center h-full w-full ${index === 0 ? '' : 'border-l-[1px]'} ${tab.width}`}>{tab.label}</div>
          ))}
        </div>
        {results.map((leaderboardRow: { [key: string]: any }) => (
          <div key={leaderboardRow.id} className="bg-gray-800 flex justify-between w-full">
            {searchTabs.map((tab, index) => (
              <LeaderboardRow key={`${leaderboardRow.id}-${tab.name}`} width={tab.width} index={index} text={leaderboardRow[tab.name]} />
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
