import "~/styles/globals.css";

// import { Inter } from "next/font/google";
import TopNav from "~/components/TopNav";

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });

export const metadata = {
  title: "Wow Stats",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className=''>
        <TopNav />
        <div className="flex">
          {/* left */}
          <div className="flex flex-col w-1/6 bg-gradient-to-b from-[#000080] to-black "> </div>
          {/* middle */}
          <div className="flex flex-col w-2/3 bg-gradient-to-b from-[#000080] to-black ">
            {children}
          </div>
          {/* right */}
          <div className="flex flex-col w-1/6 bg-gradient-to-b from-[#000080] to-black "> </div>
        </div>
      </body>
    </html>
  );
}
