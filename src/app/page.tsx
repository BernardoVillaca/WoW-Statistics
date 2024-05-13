import Link from "next/link";
import { db } from "~/server/db";


export default async function HomePage() {

  const posts = await db.query.posts.findMany()
  
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      {posts.map((post) => (
        <div key={post.id} className="bg-gray-800 p-4 rounded-lg my-4">
          <h2 className="text-xl font-bold">{post.name}</h2>
         
        </div>
      ))}
    </main>
  );
}
