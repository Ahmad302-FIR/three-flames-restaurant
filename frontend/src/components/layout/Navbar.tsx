import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FlameIcon } from '../common/FlameIcon';
import { Button } from '../common/Button';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { toggleMobileMenu, setCartDrawerOpen } from '../../store/slices/uiSlice';
import {
  ShoppingCart,
  Phone,
  User,
  Utensils,
  Menu as MenuIcon,
  X,
  ChevronRight,
  CalendarCheck,
  ShieldCheck,
} from 'lucide-react';
import { restaurantInfo } from '../../data/restaurantData';

const WhatsAppIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z" />
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.05 22l4.985-1.307A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.698 0-3.279-.494-4.609-1.343l-.33-.211-2.965.778.792-2.893-.231-.368A8.134 8.134 0 0 1 3.833 12c0-4.503 3.664-8.167 8.167-8.167s8.167 3.664 8.167 8.167-3.664 8.167-8.167 8.167z" />
  </svg>
);

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isScrolled, setIsScrolled] = useState(false);
  const cartItems = useAppSelector((state) => state.cart.items);
  const isMobileMenuOpen = useAppSelector((state) => state.ui.isMobileMenuOpen);
  const user = useAppSelector((state) => state.auth.user);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Track Order', path: '/track-order' },
    { name: 'Reservations', path: '/reservation' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#25201C]/95 backdrop-blur-md border-b border-[#463A31] py-3 shadow-xl shadow-black/40'
            : 'bg-[#25201C]/90 backdrop-blur-md border-b border-[#463A31]/70 py-3.5 shadow-md shadow-black/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Flame Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center group py-1"
              aria-label="Ahmed Khan Restaurant Home"
              title="Ahmed Khan Restaurant"
            >
              <FlameIcon
                size={34}
                glow={true}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center gap-3 xl:gap-6">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative group transition-all duration-200"
                >
                  {active ? (
                    <div className="px-3.5 py-1.5 rounded-xl bg-[#332B25] border border-[#51463D] text-[#F0C27B] font-semibold text-sm flex flex-col items-center shadow-inner shadow-black/20">
                      <span>{link.name}</span>
                      <span className="w-3.5 h-[2px] bg-[#D6A15D] rounded-full mt-0.5" />
                    </div>
                  ) : (
                    <div className="px-3 py-1.5 text-sm font-medium text-[#E6DED5]/85 hover:text-[#F0C27B] transition-colors flex flex-col items-center">
                      <span>{link.name}</span>
                      <span className="w-0 group-hover:w-3 h-[2px] bg-[#D6A15D]/60 rounded-full transition-all duration-300 mt-0.5" />
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 xl:gap-3">
            {/* 1. Circular WhatsApp Action */}
            <a
              href={restaurantInfo.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Chat on WhatsApp"
              className="hidden lg:flex w-9 h-9 rounded-full bg-[#25D366] text-white items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md shadow-[#25D366]/20 hover:brightness-105 shrink-0"
            >
              <WhatsAppIcon size={18} />
            </a>

            {/* 2. Circular Phone Action */}
            <a
              href={`tel:${restaurantInfo.phone}`}
              title={`Call ${restaurantInfo.phone}`}
              className="hidden lg:flex w-9 h-9 rounded-full bg-[#28221D] border border-[#463A31] text-[#E6DED5] hover:text-[#D6A15D] hover:border-[#D6A15D]/50 items-center justify-center hover:scale-105 active:scale-95 transition-all shrink-0"
            >
              <Phone size={15} />
            </a>

            {/* 3. Circular Cart Action with Counter Badge */}
            <button
              onClick={() => dispatch(setCartDrawerOpen(true))}
              aria-label="Open Cart"
              className="w-9 h-9 sm:w-10 sm:h-10 lg:w-9 lg:h-9 rounded-full bg-[#28221D] border border-[#463A31] text-[#E6DED5] hover:border-[#D6A15D] hover:text-[#D6A15D] flex items-center justify-center relative hover:scale-105 active:scale-95 transition-all shrink-0"
            >
              <ShoppingCart size={16} />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C97845] text-[#F3EDE5] font-extrabold text-[10px] flex items-center justify-center shadow-md shadow-black/30">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* 4. Subtle Outlined Admin Portal Action */}
            <Link
              to={user && (user.role === 'admin' || user.role === 'superadmin') ? '/admin' : '/login'}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#28221D] border border-[#463A31] hover:border-[#D6A15D]/50 text-xs font-medium text-[#E6DED5] hover:text-[#D6A15D] hover:bg-[#332B25] transition-all shrink-0"
              title="Admin Portal"
            >
              <User size={13} className="text-[#BDB1A5]" />
              <span>Admin Portal</span>
            </Link>

            {/* 5. Muted Terracotta Order Now CTA Pill */}
            <button
              type="button"
              onClick={() => navigate('/menu')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 xl:px-5 py-2 rounded-full bg-[#C97845] hover:bg-[#E0AE6C] text-[#F3EDE5] font-semibold text-xs uppercase tracking-wider shadow-md shadow-black/25 hover:scale-105 active:scale-95 transition-all shrink-0"
            >
              <Utensils size={13} className="text-[#F3EDE5]" />
              <span>Order Now</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => dispatch(toggleMobileMenu())}
              aria-label="Toggle Menu"
              className="lg:hidden p-2 rounded-xl bg-[#28221D] border border-[#463A31] text-[#E6DED5] hover:text-[#D6A15D] hover:border-[#D6A15D] transition-all active:scale-95"
            >
              {isMobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-In Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
            onClick={() => dispatch(toggleMobileMenu())}
          />

          {/* Drawer Content */}
          <div className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-[#25201C] border-l border-[#463A31] p-6 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#463A31] mb-6">
                <div className="flex items-center gap-2">
                  <FlameIcon size={24} />
                  <span className="font-heading font-bold text-base text-[#F3EDE5] tracking-wider uppercase">
                    Navigation Menu
                  </span>
                </div>
                <button
                  onClick={() => dispatch(toggleMobileMenu())}
                  className="p-2 rounded-lg bg-[#28221D] text-[#BDB1A5] hover:text-[#F3EDE5]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => dispatch(toggleMobileMenu())}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive(link.path)
                        ? 'bg-[#332B25] text-[#F0C27B] border border-[#51463D]'
                        : 'text-[#E6DED5] hover:bg-[#332B25]/60'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight size={16} className="text-[#BDB1A5]" />
                  </Link>
                ))}
              </nav>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-[#463A31] space-y-3">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => {
                    dispatch(toggleMobileMenu());
                    navigate('/menu');
                  }}
                  leftIcon={<FlameIcon size={16} glow={false} />}
                >
                  ORDER FOOD ONLINE
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={() => {
                    dispatch(toggleMobileMenu());
                    navigate('/reservation');
                  }}
                  leftIcon={<CalendarCheck size={16} className="text-[#D6A15D]" />}
                >
                  BOOK A TABLE
                </Button>
              </div>
            </div>

            {/* Footer details in Drawer */}
            <div className="pt-6 border-t border-[#463A31] text-xs text-[#BDB1A5] space-y-2">
              <div className="flex items-center gap-2 text-[#D6A15D]">
                <Phone size={14} />
                <a
                  href={restaurantInfo.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  title="Chat on WhatsApp"
                >
                  {restaurantInfo.phone}
                </a>
              </div>
              <p className="text-[11px] leading-relaxed text-[#BDB1A5]/80">
                {restaurantInfo.address}
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px]">
                {user && (user.role === 'admin' || user.role === 'superadmin') ? (
                  <Link
                    to="/admin"
                    onClick={() => dispatch(toggleMobileMenu())}
                    className="text-[#D6A15D] font-semibold hover:text-[#F3EDE5] flex items-center gap-1.5"
                  >
                    <ShieldCheck size={14} />
                    <span>Admin Portal</span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => dispatch(toggleMobileMenu())}
                    className="text-[#BDB1A5] hover:text-[#D6A15D]"
                  >
                    Staff Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
