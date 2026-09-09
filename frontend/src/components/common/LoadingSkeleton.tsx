import React from 'react';

export const FoodCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl bg-[#332B25] border border-[#51463D] overflow-hidden animate-pulse">
      <div className="h-52 bg-[#28221D] w-full" />
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-[#3D332C] rounded w-1/3" />
          <div className="h-4 bg-[#3D332C] rounded w-1/4" />
        </div>
        <div className="h-6 bg-[#3D332C] rounded w-3/4" />
        <div className="h-3 bg-[#3D332C] rounded w-full" />
        <div className="h-3 bg-[#3D332C] rounded w-2/3" />
        <div className="pt-2 flex items-center justify-between">
          <div className="h-7 bg-[#3D332C] rounded w-1/3" />
          <div className="h-9 bg-[#3D332C] rounded-xl w-1/3" />
        </div>
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 5 }) => {
  return (
    <tr className="border-b border-[#51463D] animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="p-4">
          <div className="h-4 bg-[#3D332C] rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
};
