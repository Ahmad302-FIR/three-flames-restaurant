import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { logoutUser } from '../store/slices/authSlice';
import { orderService } from '../services/orderService';
import { reservationService } from '../services/reservationService';
import { Order, Reservation } from '../types';
import { Button } from '../components/common/Button';
import { FlameIcon } from '../components/common/FlameIcon';
import {
  User,
  ShoppingBag,
  Calendar,
  LogOut,
  MapPin,
  Clock,
  ExternalLink,
  Flame,
  Award,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'reservations' | 'settings'>('orders');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadUserData = async () => {
      setLoading(true);
      try {
        const allOrders = await orderService.getCustomerOrders();
        setOrders(allOrders);

        const allReservations = await reservationService.getMyReservations();
        setReservations(allReservations);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#080604] pt-28 pb-20 text-[#FFF7ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header Banner */}
        <div className="p-8 rounded-3xl bg-[#120B08] border border-[#FF8A1F]/30 shadow-2xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-[#1A100C] border-2 border-[#FF8A1F] flex items-center justify-center text-3xl font-black font-heading text-[#FF8A1F] shadow-xl">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FF8A1F]/20 text-[#FF8A1F] border border-[#FF8A1F]/30">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-[#B8AAA0] mt-1">{user.email} • {user.phone}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-[#D99A32]">
                <span className="flex items-center gap-1">
                  <Award size={14} className="text-[#FF8A1F]" /> 450 Flame Loyalty Points
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {(user.role === 'admin' || user.role === 'superadmin') && (
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  Open Admin Portal
                </Button>
              </Link>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              leftIcon={<LogOut size={16} />}
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 pb-6 border-b border-[#FF8A1F]/15 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-[#F97316] text-black shadow-lg shadow-[#F97316]/20'
                : 'bg-[#120B08] text-[#B8AAA0] hover:text-white border border-[#FF8A1F]/20'
            }`}
          >
            <ShoppingBag size={16} />
            My Order History ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'reservations'
                ? 'bg-[#F97316] text-black shadow-lg shadow-[#F97316]/20'
                : 'bg-[#120B08] text-[#B8AAA0] hover:text-white border border-[#FF8A1F]/20'
            }`}
          >
            <Calendar size={16} />
            My Reservations ({reservations.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#120B08] border border-white/10 space-y-4">
                <p className="text-sm text-[#B8AAA0]">You haven't placed any orders yet.</p>
                <Link to="/menu">
                  <Button variant="primary">Explore Menu</Button>
                </Link>
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-6 rounded-2xl bg-[#120B08] border border-[#FF8A1F]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[#FF8A1F]/40 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold font-heading text-lg text-white">
                        Order #{ord.id}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-[#FF8A1F]/20 text-[#FF8A1F] border border-[#FF8A1F]/40">
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-[#B8AAA0]">
                      {new Date(ord.createdAt).toLocaleDateString()} • {ord.items.length} dishes • Mode: <span className="text-white capitalize">{ord.orderType}</span>
                    </p>

                    <div className="text-xs text-white/80">
                      {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <span className="text-xs text-[#B8AAA0] block">Total Paid/Due</span>
                      <span className="text-lg font-black text-[#FF8A1F]">
                        Rs. {ord.total.toLocaleString()}
                      </span>
                    </div>

                    <Link to={`/track-order/${ord.id}`}>
                      <Button variant="outline" size="sm" rightIcon={<ExternalLink size={14} />}>
                        Live Track
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="space-y-4">
            {reservations.map((res) => (
              <div
                key={res.id}
                className="p-6 rounded-2xl bg-[#120B08] border border-[#FF8A1F]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold font-heading text-lg text-white">
                      Reservation #{res.id}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                      {res.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#B8AAA0] mt-1">
                    Date: <strong className="text-white">{res.date}</strong> at <strong className="text-[#FF8A1F]">{res.time}</strong> • {res.guests} Guests • {res.seatingArea}
                  </p>
                  {res.specialRequest && (
                    <p className="text-xs text-[#D99A32] italic mt-1">Note: {res.specialRequest}</p>
                  )}
                </div>

                <div className="text-xs text-[#B8AAA0]">
                  Table allocated upon arrival
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
