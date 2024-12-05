import "~/styles/globals.css";


import TopNav from "~/components/TopNav";
import Footer from "~/components/Footer";
import Image from "next/image";
import logo from '../assets/logos/darkLogo.png';

export const metadata = {
  title: "Innate Gaming",
  description: "A hub for your wow statistics",
  icons: [{ rel: "icon", url: "/icon.png" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style>{`
          /* Hide the mobile warning by default */
          .mobile-warning {
            display: none;
          }

          /* Show the mobile warning on small screens and hide the app content */
          @media (max-width:1300px) {
            .desktop-content {
              display: none;
            }
            .mobile-warning {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background-color: #1a202c;
              color: white;
              text-align: center;
              font-size: 1.5rem;
              padding: 20px;
            }
          }

          /* On larger screens, ensure the desktop content is shown */
          @media (min-width: 1360px) {
            .desktop-content {
              display: block;
            }
          }
        `}</style>
      </head>
      <body>
        {/* Mobile warning message */}
        <div className="mobile-warning flex flex-col">
          <div className="h-1/2">
            <Image src={logo} alt="Innnate Gaming" width={300} height={300} />
          </div>
          <span className="h-1/2">
            This app is best viewed on a PC. Please open it on a larger screen.
          </span>
        </div>

        {/* Desktop content */}
        <div className="desktop-content">
          <TopNav />
          <div className="flex">
            {/* left */}
            <div className="flex flex-col w-1/6 bg-primary-dark"></div>
            {/* middle */}
            <div className="flex flex-col w-2/3 h-full bg-primary-dark">
              {children}
            </div>
            {/* right */}
            <div className="flex flex-col w-1/6 bg-primary-dark"></div>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}

