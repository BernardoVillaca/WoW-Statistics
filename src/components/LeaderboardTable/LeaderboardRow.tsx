import React from 'react'
import LeaderboardCell from './LeaderboardCell'

const LeaderboardRow = ({ characterData, searchTabs, rowHeight}: { characterData: any, searchTabs: any, rowHeight: number}) => {
    return (
        <div className="bg-gray-800 flex  border-b-[2px] border-gray-700 " style={{ height: rowHeight }}>
            {searchTabs.map((cell: any, index: number) => (
                <LeaderboardCell
                    key={`${characterData.id}-${cell.name}`}
                    height={rowHeight} index={index}
                    text={characterData[cell.name]}
                    cell={cell.name}
                    characterClass={characterData.character_class}
                    characterSpec={characterData.character_spec}
                    history={characterData.history}               
                />
            ))}
        </div>
    )
}

export default LeaderboardRow