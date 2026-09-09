import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MenuItem, CartAddOn } from '../types';
import { menuService } from '../services/menuService';
import { StarRating } from '../components/common/StarRating';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { FlameIcon } from '../components/common/FlameIcon';
import { FoodCard } from '../components/menu/FoodCard';
import { useAppDispatch } from '../store/store';
import { addToCart } from '../../src/store/slices/cartSlice';
import { addToast, setCartDrawerOpen } from '../../src/store/slices/uiSlice';
import {
  Plus,
  Minus,
  ArrowLeft,
  Clock,
  Users,
  Check,
  Flame,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

export const FoodDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [item, setItem] = useState<MenuItem | null>(null);
  const [relatedItems, setRelatedItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<CartAddOn[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    const fetchDish = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const dish = await menuService.getMenuItemById(id);
        setItem(dish);
        if (dish) {
          const related = await menuService.getMenuItems({ category: dish.category });
          setRelatedItems(related.filter((r) => r.id !== dish.id).slice(0, 3));
        }
      } catch (e) {
        console.error('Failed to load dish', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDish();
    setQuantity(1);
    setSelectedAddOns([]);
    setSpecialInstructions('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDFC] pt-36 pb-20 flex items-center justify-center text-[#25201D]">
        <div className="flex flex-col items-center gap-3">
          <FlameIcon size={40} />
          <p className="text-sm font-semibold tracking-wider uppercase text-[#B85C38] animate-pulse">
            Loading Dish Recipe...
          </p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-[#FFFDFC] pt-36 pb-20 flex flex-col items-center justify-center text-[#25201D] px-4">
        <h2 className="text-2xl font-bold font-heading mb-4">Dish Not Found</h2>
        <p className="text-sm text-[#6F6761] mb-6">The requested culinary item is not available in our current menu.</p>
        <Button variant="primary" onClick={() => navigate('/menu')}>
          Return to Menu
        </Button>
      </div>
    );
  }

  const toggleAddOn = (addon: { id: string; name: string; price: number }) => {
    setSelectedAddOns((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const singlePrice = item.price + addOnsTotal;
  const totalPrice = singlePrice * quantity;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        serving: item.serving,
        quantity,
        selectedAddOns,
        specialInstructions,
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Added to Cart 🔥',
        message: `${quantity}x ${item.name} added to your order.`,
      })
    );

    dispatch(setCartDrawerOpen(true));
  };

  return (
    <div className="min-h-screen bg-[#FFFDFC] pt-28 pb-20 text-[#25201D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-sm text-[#6F6761] hover:text-[#B85C38] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Full Menu</span>
          </Link>
        </div>

        {/* Main 2-Column Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-[#FFFFFF] p-6 sm:p-10 rounded-3xl border border-[#E8DED6] shadow-2xl">
          {/* Left Column: Image & Highlights */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-[#E8DED6] bg-[#F7F3EE] group shadow-xl">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-80 sm:h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF] via-transparent to-black/20" />

              {/* Badges on Image */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {item.featured && <Badge variant="flame">★ Chef Signature</Badge>}
                {item.isSpecial && <Badge variant="gold">Grand Special</Badge>}
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 rounded-xl bg-[#FFFDFC]/80 backdrop-blur-md border border-[#E8DED6] text-xs">
                <span className="flex items-center gap-1.5 text-[#B85C38] font-semibold">
                  <Clock size={14} className="text-[#B85C38]" />
                  {item.prepTime}
                </span>
                <span className="flex items-center gap-1.5 text-[#25201D]">
                  <Users size={14} className="text-[#B85C38]" />
                  Serves: {item.serving}
                </span>
                {item.spiceLevel && (
                  <span className="text-[#B85C38] font-bold">
                    🌶️ {item.spiceLevel}
                  </span>
                )}
              </div>
            </div>

            {/* Ingredients preview pill */}
            {item.ingredients && item.ingredients.length > 0 && (
              <div className="p-4 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#B85C38] flex items-center gap-1.5">
                  <Sparkles size={13} />
                  Key Heritage Ingredients & Spices
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {item.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-lg bg-[#FFFDFC] border border-[#E8DED6] text-[#25201D]"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Title, Details, Add-ons & CTA */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <StarRating rating={item.rating} reviewsCount={item.reviewsCount} size={18} showValue />
                <Badge variant="flame" size="sm">
                  {item.category.toUpperCase()}
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#25201D] leading-tight">
                {item.name}
              </h1>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#B85C38]">
                  Rs. {item.price.toLocaleString()}
                </span>
                {item.originalPrice && (
                  <span className="text-base text-[#6F6761] line-through">
                    Rs. {item.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                  Tax Included
                </span>
              </div>

              <p className="text-sm sm:text-base text-[#6F6761] leading-relaxed pt-2">
                {item.description}
              </p>
            </div>

            {/* Add-ons Checklist */}
            {item.addOns && item.addOns.length > 0 && (
              <div className="pt-4 border-t border-[#E8DED6] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#25201D] flex items-center justify-between">
                  <span>Custom Add-ons & Sides</span>
                  <span className="text-[#6F6761] font-normal text-[11px]">(Optional)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {item.addOns.map((addon) => {
                    const isSelected = selectedAddOns.some((a) => a.id === addon.id);
                    return (
                      <button
                        type="button"
                        key={addon.id}
                        onClick={() => toggleAddOn(addon)}
                        className={`flex items-center justify-between p-3 rounded-xl text-xs font-medium transition-all text-left border ${
                          isSelected
                            ? 'bg-[#F7F3EE] border-[#E8DED6] text-[#25201D] shadow-md shadow-[#B85C38]/10'
                            : 'bg-[#F7F3EE]/50 border-[#E8DED6] text-[#6F6761] hover:border-[#E8DED6]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center border ${
                              isSelected
                                ? 'bg-[#B85C38] border-[#E8DED6] text-black'
                                : 'border-[#6F6761]/40'
                            }`}
                          >
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </div>
                          <span>{addon.name}</span>
                        </div>
                        <span className="font-bold text-[#B85C38]">+ Rs. {addon.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-1.5">
                Special Kitchen Request / Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Less spicy, extra lemon on side, extra well-done charcoal..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-[#25201D] text-xs placeholder-[#6F6761]/60 focus:outline-none focus:border-[#E8DED6]"
              />
            </div>

            {/* Quantity Selector & Add to Cart Button */}
            <div className="pt-6 border-t border-[#E8DED6] space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Quantity Control */}
                <div className="flex items-center justify-between w-full sm:w-auto border border-[#E8DED6] rounded-xl bg-[#F7F3EE] p-1.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-9 rounded-lg bg-[#FFFFFF] text-[#25201D] hover:text-[#B85C38] flex items-center justify-center disabled:opacity-40 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-6 text-base font-extrabold text-[#25201D]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-lg bg-[#FFFFFF] text-[#25201D] hover:text-[#B85C38] flex items-center justify-center transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleAddToCart}
                  leftIcon={<FlameIcon size={18} glow={false} />}
                >
                  ADD TO CART • Rs. {totalPrice.toLocaleString()}
                </Button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-2 text-center text-[11px] text-[#6F6761] pt-2">
                <div className="p-2 rounded-lg bg-[#F7F3EE] border border-[#E8DED6] flex items-center justify-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>100% Halal Fresh Charcoal</span>
                </div>
                <div className="p-2 rounded-lg bg-[#F7F3EE] border border-[#E8DED6] flex items-center justify-center gap-1.5">
                  <Flame size={14} className="text-[#B85C38]" />
                  <span>Sealed Thermal Packing</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Dishes Row */}
        {relatedItems.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold font-heading text-[#25201D] mb-6 flex items-center gap-2">
              <FlameIcon size={20} />
              You May Also Savor
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedItems.map((rel) => (
                <FoodCard key={rel.id} item={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
