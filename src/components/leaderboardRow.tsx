

const LeaderboardRow = ({ text, height, index}: { text: string, height: number, index:number}) => (
  <div className={`flex items-center justify-center h-[${height}px] w-full ${index == 0 ? '' : 'border-l-[1px]'}`}>
    {text}
  </div>

);

export default LeaderboardRow;