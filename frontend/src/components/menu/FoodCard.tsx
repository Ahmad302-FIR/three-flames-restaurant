import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuItem } from '../../types';
import { StarRating } from '../common/StarRating';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { FlameIcon } from '../common/FlameIcon';
import { useAppDispatch } from '../../store/store';
import { addToCart } from '../../store/slices/cartSlice';
import { addToast } from '../../store/slices/uiSlice';
import { Heart, Clock, Users, Eye, Plus } from 'lucide-react';

interface FoodCardProps {
  item: MenuItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const dispatch = useAppDispatch();
  const [isLiked, setIsLiked] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!item.available) return;

    dispatch(
      addToCart({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        serving: item.serving,
        quantity: 1,
        selectedAddOns: [],
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Added to Cart',
        message: `${item.name} has been added to your order.`,
      })
    );
  };

  return (
    <div className="group relative rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] hover:border-[#B85C38]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1">
      {/* Top Image Container */}
      <div className="relative h-56 sm:h-60 overflow-hidden bg-[#F7F3EE]">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {item.featured && <Badge variant="flame">★ Featured</Badge>}
          {item.isSpecial && <Badge variant="gold">Chef Special</Badge>}
          {item.spiceLevel && (
            <Badge
              variant={item.spiceLevel === 'Hot' || item.spiceLevel === 'Extra Hot' ? 'spice-hot' : 'spice-mild'}
              size="xs"
            >
              🌶️ {item.spiceLevel}
            </Badge>
          )}
        </div>

        {/* Wishlist Heart button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-[#E8DED6] flex items-center justify-center text-[#6F6761] hover:text-[#B85C38] transition-colors z-10 shadow-sm"
          aria-label="Save to favorites"
        >
          <Heart
            size={16}
            className={isLiked ? 'fill-[#B85C38] text-[#B85C38]' : 'text-[#6F6761]'}
          />
        </button>

        {/* Quick View Hover Button */}
        <Link
          to={`/menu/${item.id}`}
          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        >
          <span className="px-4 py-2 rounded-xl bg-[#FFFDFC]/95 border border-[#E8DED6] text-[#25201D] text-xs font-semibold flex items-center gap-2 shadow-lg hover:text-[#B85C38]">
            <Eye size={15} className="text-[#B85C38]" />
            View Details & Add-ons
          </span>
        </Link>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Rating & Meta */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <StarRating rating={item.rating} reviewsCount={item.reviewsCount} showValue />
            <div className="flex items-center gap-2 text-[11px] text-[#6F6761]">
              <span className="flex items-center gap-1">
                <Users size={12} className="text-[#B85C38]" />
                {item.serving}
              </span>
            </div>
          </div>

          {/* Dish Title */}
          <Link to={`/menu/${item.id}`}>
            <h3 className="text-lg font-bold font-heading text-[#25201D] group-hover:text-[#B85C38] transition-colors line-clamp-1">
              {item.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="mt-1.5 text-xs text-[#6F6761] line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price & Action CTA */}
        <div className="pt-3 border-t border-[#E8DED6] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-[#6F6761] uppercase tracking-wider block font-medium">Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-extrabold text-[#B85C38]">
                Rs. {item.price.toLocaleString()}
              </span>
              {item.originalPrice && (
                <span className="text-xs text-[#6F6761] line-through">
                  Rs. {item.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <Button
            variant={item.available ? 'primary' : 'secondary'}
            size="sm"
            disabled={!item.available}
            onClick={handleAddToCart}
            className="text-xs uppercase shrink-0"
            leftIcon={item.available ? <Plus size={14} /> : undefined}
          >
            {item.available ? 'Add' : 'Sold Out'}
          </Button>
        </div>
      </div>
    </div>
  );
};
