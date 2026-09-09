import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { orderService } from '../../services/orderService';
import { Order, OrderStatus } from '../../types';
import { Button } from '../../components/common/Button';
import { FlameIcon } from '../../components/common/FlameIcon';
import { useAppDispatch } from '../../store/store';
import { addToast } from '../../store/slices/uiSlice';
import {
  ShoppingBag,
  Banknote,
  Calendar,
  UtensilsCrossed,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      const [metrics, orders] = await Promise.all([
        adminService.getDashboardStats(),
        orderService.getOrders(),
      ]);
      setStats(metrics);
      setRecentOrders(orders.slice(0, 6));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      dispatch(
        addToast({
          type: 'success',
          title: 'Order Status Updated',
          message: `Order #${orderId} moved to "${status.replace(/_/g, ' ')}".`,
        })
      );
      loadDashboardData();
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Update Failed',
          message: 'Could not update status.',
        })
      );
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <FlameIcon size={36} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#25201D]">
            Operations Dashboard
          </h1>
          <p className="text-xs text-[#6F6761] mt-1">
            Real-time kitchen orders, reservations, and delivery logistics overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/orders">
            <Button variant="primary" size="sm" leftIcon={<ShoppingBag size={14} />}>
              View Live Queue
            </Button>
          </Link>
          <Link to="/admin/menu">
            <Button variant="secondary" size="sm">
              Manage Dishes
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] shadow-lg space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6F6761]">
              Today's Gross Sales
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#F7F3EE] border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Banknote size={18} />
            </div>
          </div>
          <div className="text-2xl font-black font-heading text-[#25201D]">
            Rs. {stats?.todayRevenue?.toLocaleString() || '184,500'}
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp size={13} /> +18.4% compared to yesterday
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] shadow-lg space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6F6761]">
              Active Kitchen Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] flex items-center justify-center text-[#B85C38]">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="text-2xl font-black font-heading text-[#B85C38]">
            {stats?.todayOrders || '12'} Orders
          </div>
          <div className="text-[11px] text-[#6F6761]">
            {stats?.pendingOrders || 3} pending approval, {stats?.preparingOrders || 5} grilling
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] shadow-lg space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6F6761]">
              Today's Reservations
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] flex items-center justify-center text-[#B85C38]">
              <Calendar size={18} />
            </div>
          </div>
          <div className="text-2xl font-black font-heading text-[#25201D]">
            {stats?.reservationsCount || '9'} Tables
          </div>
          <div className="text-[11px] text-[#B85C38]">
            Rooftop & Dastarkhwan 85% occupied tonight
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] shadow-lg space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6F6761]">
              Menu Catalog
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] flex items-center justify-center text-[#6F6761]">
              <UtensilsCrossed size={18} />
            </div>
          </div>
          <div className="text-2xl font-black font-heading text-[#25201D]">
            {stats?.menuItemsCount || '20'} Dishes
          </div>
          <div className="text-[11px] text-emerald-400">
            All primary meat items in fresh stock
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Orders Table */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] space-y-5 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8DED6]">
            <h3 className="text-base font-bold font-heading text-[#25201D] flex items-center gap-2">
              <ShoppingBag size={18} className="text-[#B85C38]" />
              Active & Recent Orders
            </h3>
            <Link
              to="/admin/orders"
              className="text-xs text-[#B85C38] hover:underline font-bold flex items-center gap-1"
            >
              View Full Order Desk <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-bold uppercase text-[#6F6761] border-b border-[#E8DED6] pb-2">
                <tr>
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DED6]">
                {recentOrders.map((ord) => {
                  const orderKey = ord.id || (ord as any).orderNumber || (ord as any)._id || Math.random().toString();
                  const orderDisplayId = ord.id || (ord as any).orderNumber || (ord as any)._id?.toString()?.slice(-6) || 'N/A';
                  const customerName = ord.customer?.name || 'Customer';
                  const customerPhone = ord.customer?.phone || '';
                  const totalFormatted = typeof ord.total === 'number' ? ord.total.toLocaleString() : (ord.total || 0);

                  return (
                    <tr key={orderKey} className="hover:bg-[#F7F3EE]/50 transition-colors">
                      <td className="py-3 font-bold text-[#B85C38]">#{orderDisplayId}</td>
                      <td className="py-3 text-[#25201D]">
                        <div className="font-semibold">{customerName}</div>
                        <div className="text-[10px] text-[#6F6761]">{customerPhone}</div>
                      </td>
                      <td className="py-3 capitalize text-[#B85C38]">{ord.orderType || 'delivery'}</td>
                      <td className="py-3 font-bold text-[#25201D]">
                        Rs. {totalFormatted}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : ord.status === 'preparing'
                              ? 'bg-[#F3E4DC] text-[#B85C38] border border-[#E8DED6]'
                              : ord.status === 'out_for_delivery'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {(ord.status || 'pending').replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <select
                          value={ord.status || 'pending'}
                          onChange={(e) => handleUpdateStatus(ord.id || (ord as any).orderNumber || (ord as any)._id, e.target.value as OrderStatus)}
                          className="bg-[#FFFFFF] hover:bg-[#F7F3EE] border border-[#E8DED6] focus:border-[#B85C38] text-[#25201D] font-semibold rounded-lg px-2.5 py-1 text-[11px] focus:outline-none transition-colors cursor-pointer shadow-sm"
                        >
                          <option value="pending" className="bg-[#FFFFFF] text-[#25201D]">Pending</option>
                          <option value="confirmed" className="bg-[#FFFFFF] text-[#25201D]">Confirmed</option>
                          <option value="preparing" className="bg-[#FFFFFF] text-[#25201D]">On Flame Grill</option>
                          <option value="out_for_delivery" className="bg-[#FFFFFF] text-[#25201D]">Out for Delivery</option>
                          <option value="delivered" className="bg-[#FFFFFF] text-[#25201D]">Delivered</option>
                          <option value="cancelled" className="bg-[#FFFFFF] text-[#25201D]">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Top BBQ Sellers & Quick Shortcuts */}
        <div className="lg:col-span-4 space-y-6">
          {/* Top Selling Items */}
          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] space-y-4 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#B85C38] flex items-center gap-2">
              <FlameIcon size={16} />
              Best-Selling Signature Dishes
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Balochi Chicken Sajji (Full)', sold: '42 Orders Today', revenue: 'Rs. 75,600' },
                { name: 'Shinwari Mutton Karahi (1kg)', sold: '28 Orders Today', revenue: 'Rs. 78,400' },
                { name: 'Mutton Seekh Kebab (4 Skewers)', sold: '54 Orders Today', revenue: 'Rs. 51,300' },
                { name: 'Kabuli Lamb Pulao', sold: '31 Orders Today', revenue: 'Rs. 43,400' },
              ].map((dish, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-[#25201D] block">{dish.name}</span>
                    <span className="text-[10px] text-[#6F6761]">{dish.sold}</span>
                  </div>
                  <span className="font-extrabold text-[#B85C38]">{dish.revenue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Admin Actions */}
          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] space-y-3 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#25201D]">
              Kitchen Operations Shortcuts
            </h3>
            <div className="space-y-2">
              <Link
                to="/admin/menu"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F7F3EE] hover:bg-[#E8DED6]/60 border border-[#E8DED6] text-xs font-semibold text-[#25201D] transition-colors"
              >
                <span>➕ Add New Menu Item</span>
                <ChevronRight size={16} className="text-[#B85C38]" />
              </Link>
              <Link
                to="/admin/delivery-zones"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F7F3EE] hover:bg-[#E8DED6]/60 border border-[#E8DED6] text-xs font-semibold text-[#25201D] transition-colors"
              >
                <span>📍 Update Delivery Zones & Rates</span>
                <ChevronRight size={16} className="text-[#B85C38]" />
              </Link>
              <Link
                to="/admin/offers"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F7F3EE] hover:bg-[#E8DED6]/60 border border-[#E8DED6] text-xs font-semibold text-[#25201D] transition-colors"
              >
                <span>🏷️ Create Promo Discount Voucher</span>
                <ChevronRight size={16} className="text-[#B85C38]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
