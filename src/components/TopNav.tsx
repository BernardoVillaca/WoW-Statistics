'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';

const TopNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/solo-shuffle', label: 'Solo Shuffle' },
  { href: '/legacy', label: 'Legacy' },
  { href: '/activity', label: 'Activity' },
  { href: '/cutoffs', label: 'Cutoffs' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];



const TopNav = () => {
  const [selectedLink, setSelectedLink] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const matchingLink = TopNavLinks.find(link => link.href === currentPath);
      if (matchingLink) {
        setSelectedLink(matchingLink.label);
      }
    }
  }, []);

  return (
    <nav className="bg-primary-dark h-16 flex items-center justify-center gap-12 z-30 border-b-[1px] border-primary">
      {TopNavLinks.map((link) => (
        <Link
          className={`flex h-full items-center hover:text-primary ${link.label === selectedLink ? 'text-primary' : 'text-white'} select-none`}
          key={link.href}
          href={link.href}
          onClick={() => setSelectedLink(link.label)}
        >
          <span>{link.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default TopNav;
