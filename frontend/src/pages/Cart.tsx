import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  setOrderType,
  setSpecialInstructions,
} from '../store/slices/cartSlice';
import { addToast } from '../store/slices/uiSlice';
import { Button } from '../components/common/Button';
import { FlameIcon } from '../components/common/FlameIcon';
import { EmptyState } from '../components/common/EmptyState';
import { adminService } from '../services/adminService';
import { OrderType } from '../types';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  Check,
  Bike,
  Store,
  Utensils,
  ShieldCheck,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector((state) => state.cart.items);
  const orderType = useAppSelector((state) => state.cart.orderType);
  const selectedZoneFee = useAppSelector((state) => state.cart.selectedZoneFee);
  const appliedCoupon = useAppSelector((state) => state.cart.appliedCoupon);
  const specialInstructions = useAppSelector((state) => state.cart.specialInstructions);

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);

  const deliveryFee = orderType === 'delivery' ? selectedZoneFee : 0;

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
        discountAmount = appliedCoupon.maxDiscount;
      }
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const grandTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    try {
      const { coupon, discount } = await adminService.validateCoupon(code, subtotal);
      dispatch(
        applyCoupon({
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          maxDiscount: coupon.maxDiscount,
          minOrder: coupon.minOrder,
        })
      );
      dispatch(
        addToast({
          type: 'success',
          title: 'Coupon Applied! 🎉',
          message: `${coupon.title} - discount applied to your order.`,
        })
      );
      setCouponInput('');
    } catch (err: any) {
      setCouponError(err.message || 'This coupon code is not valid.');
      dispatch(
        addToast({
          type: 'error',
          title: 'Invalid Coupon',
          message: err.message || 'This coupon code is not valid.',
        })
      );
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    dispatch(
      addToast({
        type: 'info',
        message: 'Coupon removed.',
      })
    );
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#1C1815] pt-32 pb-20 text-[#F3EDE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState
            icon={<ShoppingBag size={36} className="text-[#C97845]" />}
            title="Your Cart is Empty"
            description="Explore our menu and discover something delicious. Hot Sajji, Shinwari Karahi, and charcoal skewers await!"
            actionText="Browse Food Menu"
            onAction={() => navigate('/menu')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C1815] pt-28 pb-20 text-[#F3EDE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#F3EDE5] flex items-center gap-3">
            <FlameIcon size={32} />
            YOUR ORDER CART
          </h1>
          <p className="text-sm text-[#BDB1A5] mt-1">
            Review your dishes and select your preferred ordering mode.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items List & Order Mode */}
          <div className="lg:col-span-8 space-y-6">
            {/* Order Mode Switcher Card */}
            <div className="p-5 rounded-2xl bg-[#28221D] border border-[#51463D] space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#BDB1A5] block">
                Select Order Type
              </span>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { type: 'delivery' as OrderType, label: 'Delivery', icon: <Bike size={18} /> },
                  { type: 'pickup' as OrderType, label: 'Self Pickup', icon: <Store size={18} /> },
                  { type: 'dine-in' as OrderType, label: 'Dine-In', icon: <Utensils size={18} /> },
                ].map((mode) => (
                  <button
                    key={mode.type}
                    onClick={() => dispatch(setOrderType(mode.type))}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all border ${
                      orderType === mode.type
                        ? 'bg-[#332B25] border-[#51463D] text-[#C97845] shadow-lg shadow-[#C97845]/15'
                        : 'bg-[#332B25]/50 border-[#51463D] text-[#BDB1A5] hover:border-[#51463D]'
                    }`}
                  >
                    {mode.icon}
                    <span>{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cart Items Table/Cards */}
            <div className="rounded-2xl bg-[#28221D] border border-[#51463D] p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-[#51463D]">
                <span className="text-sm font-bold uppercase tracking-wider text-[#F3EDE5]">
                  Dish Item & Specifications
                </span>
                <button
                  onClick={() => dispatch(clearCart())}
                  className="text-xs text-[#BDB1A5] hover:text-rose-400 flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={14} /> Clear All
                </button>
              </div>

              <div className="divide-y divide-white/5 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover border border-[#51463D] shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <Link
                          to={`/menu/${item.menuItemId}`}
                          className="font-bold font-heading text-base text-[#F3EDE5] hover:text-[#C97845] transition-colors"
                        >
                          {item.name}
                        </Link>
                        <div className="text-xs text-[#C97845] font-bold mt-0.5">
                          Rs. {item.price.toLocaleString()} each
                        </div>

                        {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.selectedAddOns.map((addon) => (
                              <span
                                key={addon.id}
                                className="text-[10px] bg-[#332B25] text-[#BDB1A5] px-2 py-0.5 rounded border border-[#51463D]"
                              >
                                + {addon.name} (Rs. {addon.price})
                              </span>
                            ))}
                          </div>
                        )}

                        {item.specialInstructions && (
                          <p className="text-[11px] text-[#D6A15D] italic mt-1">
                            Note: "{item.specialInstructions}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quantity and Total */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <div className="flex items-center border border-[#51463D] rounded-xl bg-[#332B25]">
                        <button
                          onClick={() =>
                            dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))
                          }
                          className="p-2 text-[#BDB1A5] hover:text-[#F3EDE5]"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-sm font-bold text-[#F3EDE5]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                          }
                          className="p-2 text-[#BDB1A5] hover:text-[#F3EDE5]"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="text-right min-w-[90px]">
                        <span className="text-base font-extrabold text-[#F3EDE5]">
                          Rs. {item.itemTotal.toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="p-2 text-[#BDB1A5] hover:text-rose-400 transition-colors"
                        title="Remove from cart"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Instructions Box */}
            <div className="p-5 rounded-2xl bg-[#28221D] border border-[#51463D] space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#BDB1A5] block">
                Overall Kitchen or Delivery Note (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Please bring extra cutlery, leave at gate, ring bell twice..."
                value={specialInstructions}
                onChange={(e) => dispatch(setSpecialInstructions(e.target.value))}
                className="w-full p-3 rounded-xl bg-[#332B25] border border-[#51463D] text-[#F3EDE5] text-xs focus:outline-none focus:border-[#51463D]"
              />
            </div>
          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            {/* Promo Coupon Card */}
            <div className="p-6 rounded-2xl bg-[#28221D] border border-[#51463D] space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#F3EDE5] flex items-center gap-2">
                <Tag size={16} className="text-[#C97845]" />
                Apply Discount Voucher
              </h3>

              {appliedCoupon ? (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Check size={14} />
                      {appliedCoupon.code} APPLIED
                    </div>
                    <div className="text-[11px] text-[#BDB1A5]">
                      Saving Rs. {discountAmount.toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. FLAME10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-[#332B25] border border-[#51463D] text-xs text-[#F3EDE5] uppercase placeholder-[#BDB1A5]/60 focus:outline-none focus:border-[#51463D]"
                    />
                    <Button variant="secondary" size="sm" type="submit">
                      Apply
                    </Button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-rose-400 leading-tight">{couponError}</p>
                  )}
                  <div className="text-[11px] text-[#D6A15D]">
                    Tip: Try code <strong>FLAME10</strong> for 10% off
                  </div>
                </form>
              )}
            </div>

            {/* Order Cost Breakdown Card */}
            <div className="p-6 rounded-2xl bg-[#332B25] border border-[#51463D] space-y-4 shadow-xl">
              <h3 className="text-base font-bold font-heading text-[#F3EDE5] pb-3 border-b border-[#51463D]">
                ORDER BILL BREAKDOWN
              </h3>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-[#BDB1A5]">
                  <span>Subtotal</span>
                  <span className="text-[#F3EDE5] font-semibold">
                    Rs. {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-[#BDB1A5]">
                  <span>Order Mode</span>
                  <span className="text-[#D6A15D] font-semibold capitalize">
                    {orderType}
                  </span>
                </div>

                {orderType === 'delivery' && (
                  <div className="flex justify-between text-[#BDB1A5]">
                    <span>Estimated Delivery Fee</span>
                    <span className="text-[#F3EDE5] font-semibold">
                      Rs. {deliveryFee.toLocaleString()}
                    </span>
                  </div>
                )}

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>- Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-[#51463D] flex justify-between items-baseline">
                  <span className="text-base font-bold text-[#F3EDE5]">TOTAL AMOUNT</span>
                  <span className="text-2xl font-extrabold font-heading text-[#C97845]">
                    Rs. {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => navigate('/checkout')}
                rightIcon={<ArrowRight size={18} />}
              >
                PROCEED TO CHECKOUT
              </Button>

              <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#BDB1A5]">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Cash / Card on Delivery & Pickup</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
