import "~/styles/globals.css";

// import { Inter } from "next/font/google";
import TopNav from "~/components/TopNav";
import Footer from "~/components/Footer";

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });

export const metadata = {
  title: "Innnate Gaming",
  description: "A hub for your wow statistics",
  icons: [{ rel: "icon", url: "/assets/logos/icon.png" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body >
        <TopNav />
        <div className="flex ">
          {/* left */}
          <div className="flex flex-col w-1/6 bg-primary-dark "> </div>
          {/* middle */}
          <div className="flex flex-col w-2/3 h-full bg-primary-dark ">
            {children}
          </div>
          {/* right */}
          <div className="flex flex-col w-1/6 bg-primary-dark "> </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
