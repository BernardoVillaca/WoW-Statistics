

const LeaderboardRow = ({ text, width, index}: { text: string, width: string, index:number}) => (
  <div className={`flex items-center justify-center h-full w-full ${index == 0 ? '' : 'border-l-[1px]'}`}>
    {text}
  </div>

);

export default LeaderboardRow;