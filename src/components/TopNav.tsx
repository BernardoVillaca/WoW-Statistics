// src/components/TopNav.tsx
import Link from 'next/link';

const TopNav = () => {
  return (
    <nav className="bg-black h-16 flex items-center justify-center gap-12">
      <Link href="/">
        <div className="text-white cursor-pointer">Home</div>
      </Link>
      <Link href="/leaderboard">
        <div className="text-white cursor-pointer">Leaderboard</div>
      </Link>
      <Link href="/solo-shuffle">
        <div className="text-white cursor-pointer">Solo Shuffle</div>
      </Link>
      <Link href="/about">
        <div className="text-white cursor-pointer">About</div>
      </Link>
      <Link href="/contact">
        <div className="text-white cursor-pointer">Contact</div>
      </Link>
    </nav>
  );
};

export default TopNav;
