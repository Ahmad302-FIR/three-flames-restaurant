import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { logoutUser } from '../../store/slices/authSlice';
import { FlameIcon } from '../common/FlameIcon';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Calendar,
  MapPin,
  Tag,
  BarChart3,
  LogOut,
  Menu as MenuIcon,
  X,
  Store,
  Bell,
  ShieldCheck,
  FolderTree,
  MessageSquare,
  Image as ImageIcon,
  Users,
  Settings,
  User as UserIcon,
} from 'lucide-react';

export const AdminLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAdminAuthenticated = useAppSelector((state) => state.auth.isAdminAuthenticated);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Check if admin is authenticated
  const isAuthenticated = Boolean(user && localStorage.getItem('tf_token_v1'));
  const isAuthorizedAdmin =
    isAuthenticated &&
    (user.role === 'admin' || user.role === 'superadmin');

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAuthorizedAdmin) {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={18} /> },
    { label: 'Reservations', path: '/admin/reservations', icon: <Calendar size={18} /> },
    { label: 'Menu Catalog', path: '/admin/menu', icon: <UtensilsCrossed size={18} /> },
    { label: 'Categories', path: '/admin/categories', icon: <FolderTree size={18} /> },
    { label: 'Reviews', path: '/admin/reviews', icon: <MessageSquare size={18} /> },
    { label: 'Gallery', path: '/admin/gallery', icon: <ImageIcon size={18} /> },
    { label: 'Offers & Coupons', path: '/admin/offers', icon: <Tag size={18} /> },
    { label: 'Delivery Zones', path: '/admin/delivery-zones', icon: <MapPin size={18} /> },
    { label: 'Customers', path: '/admin/users', icon: <Users size={18} /> },
    { label: 'Sales Analytics', path: '/admin/analytics', icon: <BarChart3 size={18} /> },
    { label: 'Restaurant Settings', path: '/admin/settings', icon: <Settings size={18} /> },
    { label: 'My Profile', path: '/admin/profile', icon: <UserIcon size={18} /> },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#080604] text-[#FFF7ED] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#120B08] border-r border-[#FF8A1F]/20 fixed inset-y-0 z-30 justify-between overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Brand Header */}
          <Link to="/" className="flex items-center gap-3">
            <FlameIcon size={26} />
            <div>
              <span className="font-extrabold font-heading text-lg tracking-wider text-white block">
                THREE FLAMES
              </span>
              <span className="text-[10px] text-[#FF8A1F] font-bold tracking-widest uppercase block">
                Ops & Kitchen Portal
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#1A100C] text-[#FF8A1F] border border-[#FF8A1F]/40 shadow-lg shadow-[#F97316]/10'
                      : 'text-[#B8AAA0] hover:text-white hover:bg-[#1A100C]/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User / Store Info */}
        <div className="p-6 border-t border-white/5 space-y-4">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#1A100C] text-xs font-bold text-[#D99A32] border border-[#D99A32]/30 hover:text-white transition-colors"
          >
            <Store size={14} />
            <span>Open Diner Storefront</span>
          </Link>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1A100C] border border-[#FF8A1F]/40 flex items-center justify-center font-bold text-xs text-[#FF8A1F]">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-white block truncate max-w-[100px]">
                  {user?.name || 'Administrator'}
                </span>
                <span className="text-[10px] text-emerald-400 block font-semibold">Online</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-[#B8AAA0] hover:text-rose-400 rounded-lg hover:bg-white/5"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 bg-[#120B08]/90 backdrop-blur-md border-b border-[#FF8A1F]/20 sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-2 text-[#B8AAA0] hover:text-white"
            >
              <MenuIcon size={22} />
            </button>
            <h2 className="text-sm sm:text-base font-bold font-heading text-white">
              Restaurant Management Console
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A100C] border border-[#FF8A1F]/20 text-[11px] text-[#D99A32]">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Peshawar Kitchen Live</span>
            </div>

            <Link
              to="/"
              className="px-3 py-1.5 rounded-lg bg-[#FF8A1F]/10 hover:bg-[#FF8A1F]/20 text-xs font-bold text-[#FF8A1F] border border-[#FF8A1F]/30"
            >
              View Site
            </Link>
          </div>
        </header>

        {/* Subpage View */}
        <main className="flex-1 p-4 sm:p-8 bg-[#080604]">
          {children || <Outlet />}
        </main>
      </div>

      {/* Mobile Drawer */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileNavOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-[#120B08] p-6 border-r border-[#FF8A1F]/30 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <FlameIcon size={24} />
                  <span className="font-bold text-white">Three Flames Admin</span>
                </div>
                <button
                  onClick={() => setIsMobileNavOpen(false)}
                  className="p-1.5 text-[#B8AAA0] hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileNavOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-[#B8AAA0] hover:text-white hover:bg-[#1A100C]"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-white/5">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/30"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
