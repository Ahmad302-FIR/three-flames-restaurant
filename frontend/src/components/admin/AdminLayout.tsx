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
  const adminUser = useAppSelector((state) => state.auth.adminUser);
  const isAdminAuthenticated = useAppSelector((state) => state.auth.isAdminAuthenticated);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Check if admin is authenticated with real backend token and authorized role
  const token = typeof window !== 'undefined' ? localStorage.getItem('tf_token_v1') : null;
  const activeUser = user || (adminUser ? { id: 'admin', name: adminUser.name, email: adminUser.email, phone: '', role: adminUser.role as any } : null);

  let cachedRole: string | null = activeUser?.role || null;
  if (!cachedRole && typeof window !== 'undefined') {
    try {
      const u = localStorage.getItem('tf_user_v1');
      cachedRole = u ? JSON.parse(u)?.role : null;
    } catch {}
  }

  const isRoleAuthorized = Boolean(cachedRole && ['admin', 'superadmin', 'staff'].includes(cachedRole));
  const isAuthorized = Boolean(token && isRoleAuthorized);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAuthorized) {
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
    <div className="min-h-screen bg-[#F7F3EE] text-[#25201D] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#FFFFFF] border-r border-[#E8DED6] fixed inset-y-0 z-30 justify-between overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Brand Header */}
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/akr-logo.png" alt="AKR" className="h-12 w-auto object-contain" />
            <div>
              <span className="font-extrabold font-heading text-sm tracking-wider text-[#25201D] block">
                AHMED KHAN
              </span>
              <span className="text-[10px] text-[#B85C38] font-bold tracking-widest uppercase block">
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
                      ? 'bg-[#F3E4DC] text-[#B85C38] border border-[#B85C38]/30 shadow-sm'
                      : 'text-[#6F6761] hover:text-[#25201D] hover:bg-[#F7F3EE]'
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
        <div className="p-6 border-t border-[#E8DED6] space-y-4">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#F7F3EE] text-xs font-bold text-[#B85C38] border border-[#E8DED6] hover:bg-[#F3E4DC] transition-colors"
          >
            <Store size={14} />
            <span>Open Diner Storefront</span>
          </Link>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#F3E4DC] border border-[#E8DED6] flex items-center justify-center font-bold text-xs text-[#B85C38]">
                {activeUser?.name?.charAt(0) || 'A'}
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-[#25201D] block truncate max-w-[100px]">
                  {activeUser?.name || 'Administrator'}
                </span>
                <span className="text-[10px] text-emerald-700 block font-bold">Online</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-[#6F6761] hover:text-[#C24838] rounded-lg hover:bg-[#F7F3EE]"
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
        <header className="h-16 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E8DED6] sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-2 text-[#6F6761] hover:text-[#25201D]"
            >
              <MenuIcon size={22} />
            </button>
            <h2 className="text-sm sm:text-base font-bold font-heading text-[#25201D]">
              Restaurant Management Console
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F7F3EE] border border-[#E8DED6] text-[11px] text-[#25201D]">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Peshawar Kitchen Live</span>
            </div>

            <Link
              to="/"
              className="px-3 py-1.5 rounded-lg bg-[#F3E4DC] hover:bg-[#E8DED6] text-xs font-bold text-[#B85C38] border border-[#E8DED6]"
            >
              View Site
            </Link>
          </div>
        </header>

        {/* Subpage View */}
        <main className="flex-1 p-4 sm:p-8 bg-[#F7F3EE]">
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
          <div className="fixed inset-y-0 left-0 w-72 bg-[#FFFFFF] p-6 border-r border-[#E8DED6] flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DED6]">
                <div className="flex items-center gap-2.5">
                  <img src="/akr-logo.png" alt="AKR" className="h-10 w-auto object-contain" />
                  <span className="font-bold text-[#25201D]">Ahmed Khan Admin</span>
                </div>
                <button
                  onClick={() => setIsMobileNavOpen(false)}
                  className="p-1.5 text-[#6F6761] hover:text-[#25201D]"
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
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-[#6F6761] hover:text-[#25201D] hover:bg-[#F7F3EE]"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#E8DED6]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#C24838] hover:bg-[#F3E4DC]/50"
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
