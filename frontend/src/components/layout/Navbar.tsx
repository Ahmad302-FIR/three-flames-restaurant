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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Left: Menu Toggle Button */}
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

          {/* Desktop Left Spacer: Balances right-side actions to keep center navigation perfectly aligned */}
          <div className="hidden lg:block lg:flex-1" />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-[#FF8A1F] bg-[#1A100C] border border-[#FF8A1F]/30 shadow-sm'
                    : 'text-[#B8AAA0] hover:text-[#FFF7ED] hover:bg-[#1A100C]/50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center justify-end gap-2.5 sm:gap-3 lg:flex-1">
            {/* Quick WhatsApp / Call Button (Desktop) */}
            <a
              href={restaurantInfo.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Chat on WhatsApp"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#D99A32] bg-[#1A100C] border border-[#D99A32]/30 hover:border-[#D99A32] transition-colors"
            >
              <Phone size={14} className="text-[#FF8A1F]" />
              <span>{restaurantInfo.phone}</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={() => dispatch(setCartDrawerOpen(true))}
              aria-label="Open Cart"
              className="relative p-2.5 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-[#FFF7ED] hover:border-[#FF8A1F] hover:text-[#FF8A1F] transition-all hover:scale-105 active:scale-95"
            >
              <ShoppingBag size={20} />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-[#F97316] to-[#DC2626] text-black font-extrabold text-[11px] flex items-center justify-center shadow-lg shadow-[#F97316]/50 animate-bounce">
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
              className="hidden sm:inline-flex text-xs uppercase"
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
