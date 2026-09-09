import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Utensils, ShoppingBag, Calendar, Phone, ShieldCheck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { setCartDrawerOpen } from '../../store/slices/uiSlice';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

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
            <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#C97845] text-[#F3EDE5] font-extrabold text-[10px] flex items-center justify-center shadow-md">
              {totalCartCount}
            </span>
          )}
        </div>
      ),
    },
    { label: 'Reserve', path: '/reservation', icon: <Calendar size={20} /> },
    isAdmin
      ? { label: 'Admin', path: '/admin', icon: <ShieldCheck size={20} /> }
      : { label: 'Contact', path: '/contact', icon: <Phone size={20} /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#25201C]/95 backdrop-blur-lg border-t border-[#463A31] py-2 px-3 shadow-2xl">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path || '');

          if (item.isCartButton) {
            return (
              <button
                key="cart-btn"
                onClick={() => dispatch(setCartDrawerOpen(true))}
                className="flex flex-col items-center gap-1 p-1 text-[#BDB1A5] hover:text-[#D6A15D] transition-colors"
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
                isActive ? 'text-[#F0C27B] font-bold' : 'text-[#BDB1A5] hover:text-[#F3EDE5]'
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
