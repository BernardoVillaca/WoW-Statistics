import React from 'react';

const LeaderboardRow = ({ text, width, index, keyToBeUsed }: { text: string, width: string, index:number, keyToBeUsed: string }) => (
  <div key={keyToBeUsed} className={`flex items-center justify-center h-full w-full ${index == 0 ? '' : 'border-l-[1px]'}`}>
    {text}
  </div>

);

export default LeaderboardRow;