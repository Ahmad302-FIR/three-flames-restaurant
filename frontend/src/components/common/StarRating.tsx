import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  showValue?: boolean;
  reviewsCount?: number;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 16,
  showValue = false,
  reviewsCount,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5 text-[#F2B84B]">
        {Array.from({ length: maxStars }).map((_, index) => {
          const fillPercentage = Math.max(0, Math.min(1, rating - index));
          return (
            <span key={index} className="relative inline-block">
              <Star
                size={size}
                className="text-[#2A1A12] stroke-[#D99A32]/40"
              />
              {fillPercentage > 0 && (
                <span
                  className="absolute inset-0 overflow-hidden text-[#F2B84B]"
                  style={{ width: `${fillPercentage * 100}%` }}
                >
                  <Star size={size} className="fill-[#F2B84B] text-[#F2B84B]" />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {showValue && (
        <span className="font-semibold text-sm text-[#FFF7ED]">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewsCount !== undefined && (
        <span className="text-xs text-[#B8AAA0]">({reviewsCount})</span>
      )}
    </div>
  );
};
