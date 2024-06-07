import React from 'react'
import LeaderboardCell from './LeaderboardCell'

const LeaderboardRow = ({ characterData, searchTabs, rowHeight}: { characterData: any, searchTabs: any, rowHeight: number}) => {
    return (
        <div className="bg-gray-800 flex  border-b-[2px] border-gray-700 " style={{ height: rowHeight }}>
            {searchTabs.map((tab: any, index: number) => (
                <LeaderboardCell
                    key={`${characterData.id}-${tab.name}`}
                    height={rowHeight} index={index}
                    text={characterData[tab.name]}
                    tab={tab.name}
                    characterClass={characterData.character_class}
                    characterSpec={characterData.character_spec}                  
                />
            ))}
        </div>
    )
}

export default LeaderboardRow