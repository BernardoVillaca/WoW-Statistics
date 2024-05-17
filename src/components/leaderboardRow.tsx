import React from 'react';

const LeaderboardRow = ({ children, width, keyToBeUsed }: { children: React.ReactNode, width: string, keyToBeUsed: string }) => (
  <div key={keyToBeUsed} className={`flex items-center justify-left h-full w-full ${width}`}>
    {children}
  </div>
);

export default LeaderboardRow;