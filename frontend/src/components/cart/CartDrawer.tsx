import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { setCartDrawerOpen } from '../../store/slices/uiSlice';
import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Flame } from 'lucide-react';
import { Button } from '../common/Button';
import { FlameIcon } from '../common/FlameIcon';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isCartDrawerOpen);
  const cartItems = useAppSelector((state) => state.cart.items);
  const orderType = useAppSelector((state) => state.cart.orderType);

  const subtotal = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => dispatch(setCartDrawerOpen(false))}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFFFF] border-l border-[#E8DED6] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-[#E8DED6] flex items-center justify-between bg-[#F7F3EE]">
            <div className="flex items-center gap-2.5">
              <FlameIcon size={22} />
              <div>
                <h2 className="text-lg font-bold font-heading text-[#25201D]">YOUR ORDER CART</h2>
                <p className="text-xs text-[#B85C38] uppercase tracking-wider font-semibold">
                  Mode: {orderType}
                </p>
              </div>
            </div>
            <button
              onClick={() => dispatch(setCartDrawerOpen(false))}
              className="p-2 rounded-lg bg-[#FFFDFC] text-[#6F6761] hover:text-[#25201D] border border-[#E8DED6] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F3E4DC] border border-[#E8DED6] flex items-center justify-center text-[#B85C38]">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="text-lg font-bold font-heading text-[#25201D]">Your Cart is Empty</h3>
                <p className="text-xs text-[#6F6761] max-w-xs">
                  Discover Peshawar’s finest charcoal Sajji, Shinwari Karahi, and flame skewers.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    dispatch(setCartDrawerOpen(false));
                    navigate('/menu');
                  }}
                  leftIcon={<Flame size={14} />}
                >
                  Explore Menu
                </Button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[#FFFDFC] border border-[#E8DED6] flex gap-3.5 items-start group hover:border-[#B85C38]/40 transition-colors shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover border border-[#E8DED6] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-semibold text-sm text-[#25201D] truncate">{item.name}</h4>
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-[#6F6761] hover:text-rose-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="text-xs text-[#B85C38] font-bold mt-0.5">
                      Rs. {item.price.toLocaleString()}
                    </div>

                    {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.selectedAddOns.map((addon) => (
                          <span
                            key={addon.id}
                            className="text-[10px] bg-[#F7F3EE] text-[#6F6761] px-1.5 py-0.5 rounded border border-[#E8DED6]"
                          >
                            + {addon.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#E8DED6]">
                      <div className="flex items-center border border-[#E8DED6] rounded-lg bg-[#F7F3EE]">
                        <button
                          onClick={() =>
                            dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))
                          }
                          className="p-1 text-[#6F6761] hover:text-[#25201D]"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#25201D]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                          }
                          className="p-1 text-[#6F6761] hover:text-[#25201D]"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <span className="text-xs font-extrabold text-[#B85C38]">
                        Rs. {item.itemTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-[#E8DED6] bg-[#F7F3EE] space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6F6761]">Subtotal</span>
                <span className="text-xl font-bold font-heading text-[#25201D]">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-[#6F6761]/90">
                Delivery fees & discounts are calculated during checkout.
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={() => {
                    dispatch(setCartDrawerOpen(false));
                    navigate('/cart');
                  }}
                >
                  View Full Cart
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => {
                    dispatch(setCartDrawerOpen(false));
                    navigate('/checkout');
                  }}
                  rightIcon={<ArrowRight size={16} />}
                >
                  Checkout
                </Button>
              </div>

              <button
                onClick={() => dispatch(clearCart())}
                className="w-full text-center text-xs text-[#6F6761] hover:text-rose-600 transition-colors cursor-pointer"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
