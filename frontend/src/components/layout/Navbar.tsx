import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FlameIcon } from '../common/FlameIcon';
import { Button } from '../common/Button';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { toggleMobileMenu, setCartDrawerOpen, setReservationModalOpen } from '../../store/slices/uiSlice';
import {
  ShoppingBag,
  Menu as MenuIcon,
  X,
  Phone,
  CalendarCheck,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { restaurantInfo } from '../../data/restaurantData';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isScrolled, setIsScrolled] = useState(false);
  const cartItems = useAppSelector((state) => state.cart.items);
  const isMobileMenuOpen = useAppSelector((state) => state.ui.isMobileMenuOpen);
  const user = useAppSelector((state) => state.auth.user);
  const isAdminAuthenticated = useAppSelector((state) => state.auth.isAdminAuthenticated);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
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
            ? 'bg-[#080604]/90 backdrop-blur-md border-b border-[#FF8A1F]/15 py-3 shadow-2xl shadow-black/80'
            : 'bg-gradient-to-b from-[#080604]/95 via-[#080604]/70 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Mobile Left: Menu Toggle Button (Preserved) */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => dispatch(toggleMobileMenu())}
              aria-label="Toggle Menu"
              className="p-2.5 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-[#FFF7ED] hover:text-[#FF8A1F] hover:border-[#FF8A1F] transition-all active:scale-95 flex items-center gap-2"
            >
              {isMobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFF7ED]">Menu</span>
            </button>
          </div>

          {/* Desktop Left: Restored Elegant Flame Logo (No Text Branding) */}
          <div className="hidden lg:flex items-center shrink-0">
            <Link
              to="/"
              className="group relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1E110A] via-[#140C08] to-[#0A0503] border border-[#FF8A1F]/35 p-2 transition-all duration-300 hover:border-[#FF8A1F] hover:shadow-[0_0_20px_rgba(249,115,22,0.45)] hover:scale-105 active:scale-95"
              title="Three Flames Restaurant - Home"
              aria-label="Three Flames Restaurant Home"
            >
              <FlameIcon size={24} />
            </Link>
          </div>

          {/* Desktop Center: Refined & Centered Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 px-3 py-1.5 rounded-2xl bg-[#120B08]/60 backdrop-blur-md border border-[#FF8A1F]/15 shadow-inner shadow-black/40">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3.5 xl:px-4 py-2 rounded-xl text-xs xl:text-sm font-medium tracking-wide transition-all duration-200 ${
                    active
                      ? 'text-[#FF8A1F] bg-[#1F120A] border border-[#FF8A1F]/40 shadow-[0_0_12px_rgba(249,115,22,0.25)] font-semibold'
                      : 'text-[#C9BAAF] hover:text-[#FFF7ED] hover:bg-[#1A100C]/70 hover:border-white/10'
                  }`}
                >
                  <span>{link.name}</span>
                  {active && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gradient-to-r from-transparent via-[#FF8A1F] to-transparent shadow-[0_0_8px_#FF8A1F]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Buttons (Preserved) */}
          <div className="flex items-center justify-end gap-2.5 sm:gap-3 shrink-0">
            {/* Quick WhatsApp / Call Button (Desktop) */}
            <a
              href={restaurantInfo.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Chat on WhatsApp"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#D99A32] bg-[#140D09] border border-[#D99A32]/30 hover:border-[#D99A32] hover:text-[#F59E0B] hover:bg-[#1C120C] hover:shadow-[0_0_15px_rgba(217,154,50,0.2)] transition-all"
            >
              <Phone size={13} className="text-[#FF8A1F]" />
              <span>{restaurantInfo.phone}</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={() => dispatch(setCartDrawerOpen(true))}
              aria-label="Open Cart"
              className="relative p-2.5 rounded-xl bg-[#140D09] border border-[#FF8A1F]/30 text-[#FFF7ED] hover:border-[#FF8A1F] hover:text-[#FF8A1F] hover:shadow-[0_0_15px_rgba(249,115,22,0.25)] transition-all hover:scale-105 active:scale-95"
            >
              <ShoppingBag size={19} />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-[#F97316] to-[#DC2626] text-black font-black text-[10px] flex items-center justify-center shadow-lg shadow-[#F97316]/50 animate-bounce">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Admin portal link (only visible if logged-in user is admin/superadmin) */}
            {user && (user.role === 'admin' || user.role === 'superadmin') && (
              <Link
                to="/admin"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#120B08] border border-[#FF8A1F]/30 text-xs text-[#FF8A1F] hover:text-white hover:bg-[#FF8A1F]/10 transition-colors font-bold"
                title="Admin Portal"
              >
                <ShieldCheck size={15} className="text-[#FF8A1F]" />
                <span>Admin</span>
              </Link>
            )}

            {/* Order Now CTA */}
            <Button
              variant="primary"
              size="sm"
              className="hidden sm:inline-flex text-xs uppercase tracking-wider font-bold shadow-lg shadow-[#F97316]/20 hover:shadow-[#F97316]/40"
              onClick={() => navigate('/menu')}
              leftIcon={<FlameIcon size={14} glow={false} />}
            >
              Order Now
            </Button>
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
          <div className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-[#0E0806] border-l border-[#FF8A1F]/30 p-6 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#FF8A1F]/20 mb-6">
                <span className="font-heading font-bold text-base text-white tracking-wider uppercase">
                  Navigation Menu
                </span>
                <button
                  onClick={() => dispatch(toggleMobileMenu())}
                  className="p-2 rounded-lg bg-[#1A100C] text-[#B8AAA0] hover:text-white"
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
                        ? 'bg-[#1A100C] text-[#FF8A1F] border border-[#FF8A1F]/30'
                        : 'text-[#FFF7ED] hover:bg-[#1A100C]/60'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight size={16} className="text-[#B8AAA0]" />
                  </Link>
                ))}
              </nav>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-[#FF8A1F]/20 space-y-3">
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
                  leftIcon={<CalendarCheck size={16} className="text-[#FF8A1F]" />}
                >
                  BOOK A TABLE
                </Button>
              </div>
            </div>

            {/* Footer details in Drawer */}
            <div className="pt-6 border-t border-[#FF8A1F]/20 text-xs text-[#B8AAA0] space-y-2">
              <div className="flex items-center gap-2 text-[#D99A32]">
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
              <p className="text-[11px] leading-relaxed text-[#B8AAA0]/80">
                {restaurantInfo.address}
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px]">
                {user && (user.role === 'admin' || user.role === 'superadmin') ? (
                  <Link
                    to="/admin"
                    onClick={() => dispatch(toggleMobileMenu())}
                    className="text-[#FF8A1F] font-semibold hover:text-white flex items-center gap-1.5"
                  >
                    <ShieldCheck size={14} />
                    <span>Admin Portal</span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => dispatch(toggleMobileMenu())}
                    className="text-[#B8AAA0] hover:text-[#FF8A1F]"
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
