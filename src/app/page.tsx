import { db } from "~/server/db";


export default async function HomePage() {



  const lb = await db.query.leaderboard.findMany()
 
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      {lb.map((leaderboard) => (
        <div key={leaderboard.id} className="bg-gray-800 p-4 rounded-lg my-4">
          <h2 className="text-xl font-bold">{leaderboard.character_name}</h2>

        </div>
      ))}
    </main>
  );
}
