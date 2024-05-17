import { asc } from "drizzle-orm";
import { db } from "~/server/db";
import { leaderboard } from "~/server/db/schema";
import LeaderboardRow from "~/components/leaderboardRow";

const searchTabs = [
  { tab: 'rank', label: 'Rank', width: 'w-96' },
  { tab: 'character_name', label: 'Name', width: '' },
  { tab: 'rating', label: 'Rating', width: '' },
  { tab: 'realm_slug', label: 'Realm', width: '' },
  { tab: 'character_class', label: 'Class', width: '' },
  { tab: 'character_spec', label: 'Spec', width: '' },
  { tab: 'faction_name', label: 'Faction', width: '' },
  { tab: 'played', label: 'Played', width: '' },
  { tab: 'won', label: 'Won', width: '' },
  { tab: 'lost', label: 'Lost', width: 'w' },
]

export default async function HomePage() {

  const lb = await db.query.leaderboard.findMany({
    limit: 50,
    orderBy: [asc(leaderboard.rank)]
  })
  return (
    <main className="flex min-h-screen bg-gradient-to-b  from-[#2e026d] to-[#15162c] text-white ">
      <div className="flex flex-col  bg-gradient-to-b w-full from-[#2e026d] to-[#15162c]">
        {/* Area for statistics for the chosen pvp bracket */}
        <div className="flex h-96  bg-white"></div>
        <div className="flex h-16 bg-black justify-between">
          {searchTabs.map((tab) => (
            <div className={`flex items-center justify-left text-white text-center h-full w-full p-l-2 ${tab.width}`}>{tab.label}</div>
          ))}
        </div>
        <div className="flex flex-col">
          {lb.map((leaderboard: { [key: string]: any }) => (
            <div key={leaderboard.id} className="bg-gray-800 ">
              <div className="flex justify-between">
                {searchTabs.map((tab) => (
                  <LeaderboardRow keyToBeUsed={tab.tab} width={tab.width}>
                    {leaderboard[tab.tab]}
                  </LeaderboardRow>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main >
  );
}
