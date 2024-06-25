import React from 'react';
import { classColors } from '~/utils/helper/classIconsMap';

const MostActiveSpecs = ({ name, spec, total, mostActiveSpecsColumns }: { name: string, spec: any, total: number, mostActiveSpecsColumns: { label: string, width: string }[] }) => {
  const calculateSpecPercentage = (specPlayed: number, total: number) => {
    if (total === 0) return 0;
    return ((specPlayed / total) * 100).toFixed(2);
  };

  const specClass = spec.character_class as keyof typeof classColors;
  const percentage = calculateSpecPercentage(spec.played, total);

  return (
    <div key={name} className='flex py-2 border-b-[1px] border-opacity-20 border-gray-300 items-center'>
      <span className={`${mostActiveSpecsColumns[0]?.width} text-center`} style={{ color: classColors[specClass] }}>
        {spec.character_spec === 'Feral Combat' ? 'Feral' : spec.character_spec} {spec.character_class}
      </span>
      <span className={`${mostActiveSpecsColumns[1]?.width} text-center`}>
        {spec.played}
      </span>
      <span className={`${mostActiveSpecsColumns[2]?.width} text-center `}>
        {percentage}%
      </span>
    </div>
  );
};

export default MostActiveSpecs;
