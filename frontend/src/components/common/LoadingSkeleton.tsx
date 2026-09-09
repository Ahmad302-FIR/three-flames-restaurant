import React from 'react';

export const FoodCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] overflow-hidden animate-pulse shadow-sm">
      <div className="h-52 bg-[#F7F3EE] w-full" />
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-[#E8DED6] rounded w-1/3" />
          <div className="h-4 bg-[#E8DED6] rounded w-1/4" />
        </div>
        <div className="h-6 bg-[#E8DED6] rounded w-3/4" />
        <div className="h-3 bg-[#E8DED6] rounded w-full" />
        <div className="h-3 bg-[#E8DED6] rounded w-2/3" />
        <div className="pt-2 flex items-center justify-between">
          <div className="h-7 bg-[#E8DED6] rounded w-1/3" />
          <div className="h-9 bg-[#E8DED6] rounded-xl w-1/3" />
        </div>
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 5 }) => {
  return (
    <tr className="border-b border-[#E8DED6] animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="p-4">
          <div className="h-4 bg-[#E8DED6] rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
};
