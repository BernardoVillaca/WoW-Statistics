'use client'
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import logo from '../assets/logos/darkLogo.png';

const TopNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/solo-shuffle', label: 'Solo Shuffle' },
  { href: '/legacy', label: 'Legacy' },
  { href: '/activity', label: 'Activity' },
  { href: '/cutoffs', label: 'Cutoffs' },
  { href: '/about', label: 'About' },
  ];

const TopNav = () => {
  const [selectedLink, setSelectedLink] = useState('');
  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const currentPath = window.location.pathname;
    // If the current path matches the href, prevent navigation
    if (currentPath === href) event.preventDefault();

    setSelectedLink(TopNavLinks.find(link => link.href === href)?.label ?? '');

  };

  return (
    <nav className="bg-primary-dark h-16 flex items-center justify-center gap-12 z-30 border-b-[1px] border-primary">
      <div className='flex w-1/4 items-center place-content-left'>
      <Link
       href={'/'}
       onClick={(event) => handleLinkClick(event, '/')}
      >
      <Image src={logo} alt='logo' width={230} height={230} />
      </Link>
      
      </div>
      {TopNavLinks.map((link) => (
        <Link
          className={`flex h-full items-center hover:text-primary ${link.label === selectedLink ? 'text-primary' : 'text-white'} select-none`}
          key={link.href}
          href={link.href}
          onClick={(event) => handleLinkClick(event, link.href)}
        >
          <span>{link.label}</span>
        </Link>
      ))}
      <div className='flex w-1/4'></div>
    </nav>
  );
};

export default TopNav;
