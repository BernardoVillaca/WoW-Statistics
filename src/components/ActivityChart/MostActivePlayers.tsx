import Image from 'next/image';
import React from 'react';
import { PlayerActivity } from '~/utils/helper/activityMap';
import { classColors } from '~/utils/helper/classIconsMap';
import specIconsMap from '~/utils/helper/specIconsMap';

const MostActivePlayers = ({ name, player, mostActivePlayersColumns }: { name: string, player: PlayerActivity, mostActivePlayersColumns: { label: string, width: string }[] }) => {
  const characterClass = player.character_class as keyof typeof classColors;
  const characterSpecClass = `${player.character_spec} ${player.character_class}` as keyof typeof specIconsMap;

  return (
    <div key={name} className='flex py-2 gap-2 border-b-[1px] border-opacity-20 border-gray-300 items-center'>
      <span className={`${mostActivePlayersColumns[0]?.width}`} style={{ color: classColors[characterClass] }}>{player.character_name}-{player.realm_slug}</span>
      <div className={`${mostActivePlayersColumns[1]?.width} flex justify-center`}>
        <Image
          width={20}
          height={20}
          src={specIconsMap[characterSpecClass]}
          alt={player.character_spec}
        />
      </div>
      <span className={`${mostActivePlayersColumns[2]?.width} text-center`}>{player.rating}</span>
      <span className={`${mostActivePlayersColumns[3]?.width} text-center`}>{player.played}</span>
      <span className={`${mostActivePlayersColumns[4]?.width} text-center`}>({player.won}-{player.lost})</span>
    </div>
  );
};

export default MostActivePlayers;
