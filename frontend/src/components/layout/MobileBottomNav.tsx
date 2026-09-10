import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Utensils, ShoppingBag, Calendar, Phone } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { setCartDrawerOpen } from '../../store/slices/uiSlice';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Hide mobile bottom nav on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { label: 'Home', path: '/', icon: <Home size={20} /> },
    { label: 'Menu', path: '/menu', icon: <Utensils size={20} /> },
    {
      label: 'Cart',
      isCartButton: true,
      icon: (
        <div className="relative">
          <ShoppingBag size={20} />
          {totalCartCount > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#B85C38] text-white font-extrabold text-[10px] flex items-center justify-center shadow-md">
              {totalCartCount}
            </span>
          )}
        </div>
      ),
    },
    { label: 'Reserve', path: '/reservation', icon: <Calendar size={20} /> },
    { label: 'Contact', path: '/contact', icon: <Phone size={20} /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDFC]/95 backdrop-blur-lg border-t border-[#E8DED6] py-2 px-3 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path || '');

          if (item.isCartButton) {
            return (
              <button
                key="cart-btn"
                onClick={() => dispatch(setCartDrawerOpen(true))}
                className="flex flex-col items-center gap-1 p-1 text-[#6F6761] hover:text-[#B85C38] transition-colors"
              >
                {item.icon}
                <span className="text-[11px] font-medium">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path!}
              className={`flex flex-col items-center gap-1 p-1 transition-colors ${
                isActive ? 'text-[#B85C38] font-bold' : 'text-[#6F6761] hover:text-[#25201D]'
              }`}
            >
              {item.icon}
              <span className="text-[11px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
