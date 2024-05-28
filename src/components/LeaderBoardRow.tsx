import React from 'react'
import LeaderboardCell from './LeaderboardCell'

const LeaderboardRow = ({ characterData, searchTabs, rowHeight }: { characterData: any, searchTabs: any, rowHeight: number }) => {
    return (
        <div key={characterData.id} className="bg-gray-800 flex justify-between w-full border-b-1" style={{ height: rowHeight }}>
            {searchTabs.map((tab: any, index: number) => (
                <LeaderboardCell
                    key={`${characterData.id}-${tab.name}`}
                    height={rowHeight} index={index}
                    text={characterData[tab.name]}
                    tab={tab.name}
                    characterClass={characterData.spec_class}
                />
            ))}
        </div>
    )
}

export default LeaderboardRow