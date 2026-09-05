import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { Order, OrderStatus } from '../../types';
import { Button } from '../../components/common/Button';
import { FlameIcon } from '../../components/common/FlameIcon';
import { useAppDispatch } from '../../store/store';
import { addToast } from '../../store/slices/uiSlice';
import {
  ShoppingBag,
  Search,
  Filter,
  Clock,
  Printer,
  X,
  Eye,
  CheckCircle2,
  Bike,
  Store,
  Utensils,
} from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const updated = await orderService.updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (activeOrder && activeOrder.id === orderId) {
        setActiveOrder(updated);
      }
      dispatch(
        addToast({
          type: 'success',
          title: 'Order Status Changed',
          message: `Order #${orderId} is now "${status.replace(/_/g, ' ')}".`,
        })
      );
    } catch (e) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Update Failed',
          message: 'Could not change status.',
        })
      );
    }
  };

  const filteredOrders = orders.filter((ord) => {
    if (selectedStatus !== 'all' && ord.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = ord.id.toLowerCase().includes(q);
      const matchName = ord.customer.name.toLowerCase().includes(q);
      const matchPhone = ord.customer.phone.toLowerCase().includes(q);
      return matchId || matchName || matchPhone;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white flex items-center gap-2">
            <ShoppingBag size={24} className="text-[#FF8A1F]" />
            Live Kitchen Order Queue
          </h1>
          <p className="text-xs text-[#B8AAA0] mt-1">
            Dispatch, update status, and print receipts for home delivery, takeaway, and dine-in.
          </p>
        </div>

        <Button variant="secondary" size="sm" onClick={fetchOrders} isLoading={loading}>
          Refresh Queue
        </Button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#120B08] border border-[#FF8A1F]/20">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {['all', 'pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedStatus === st
                  ? 'bg-[#F97316] text-black shadow-md'
                  : 'bg-[#1A100C] text-[#B8AAA0] hover:text-white border border-white/5'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B8AAA0]" />
          <input
            type="text"
            placeholder="Search order ID or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-xs text-white placeholder-[#B8AAA0]/60 focus:outline-none focus:border-[#FF8A1F]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-[#120B08] border border-[#FF8A1F]/20 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1A100C] text-[#B8AAA0] font-bold uppercase tracking-wider text-[11px] border-b border-white/10">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Time & Mode</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Items Summary</th>
                <th className="p-4">Bill Amount</th>
                <th className="p-4">Live Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#1A100C]/60 transition-colors">
                  <td className="p-4 font-bold text-[#FF8A1F]">#{ord.id}</td>
                  <td className="p-4">
                    <span className="font-semibold text-white block">
                      {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-[10px] text-[#D99A32] capitalize">
                      {ord.orderType}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-white block">{ord.customer.name}</span>
                    <span className="text-[11px] text-[#B8AAA0]">{ord.customer.phone}</span>
                    {ord.deliveryDetails?.area && (
                      <span className="text-[10px] text-[#FF8A1F] block">
                        Area: {ord.deliveryDetails.area}
                      </span>
                    )}
                  </td>
                  <td className="p-4 max-w-xs">
                    <div className="text-white line-clamp-2">
                      {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                  </td>
                  <td className="p-4 font-extrabold text-white">
                    Rs. {ord.total.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderStatus)}
                      className="bg-[#1A100C] border border-[#FF8A1F]/30 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#FF8A1F]"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">On Flame Grill</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setActiveOrder(ord);
                        setIsReceiptModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#1A100C] border border-white/10 hover:border-[#FF8A1F] text-white hover:text-[#FF8A1F] text-xs font-semibold flex items-center gap-1 ml-auto"
                    >
                      <Eye size={13} /> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Receipt Modal */}
      {isReceiptModalOpen && activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-lg w-full rounded-3xl bg-[#120B08] border border-[#FF8A1F]/40 p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-[#FF8A1F]/20">
              <div className="flex items-center gap-2">
                <FlameIcon size={22} />
                <h3 className="text-lg font-bold font-heading text-white">
                  Order Slip #{activeOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="p-1.5 rounded-lg bg-[#1A100C] text-[#B8AAA0] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Customer & Delivery Information */}
            <div className="p-4 rounded-2xl bg-[#1A100C] border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#B8AAA0]">Customer:</span>
                <span className="font-bold text-white">{activeOrder.customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#B8AAA0]">Phone:</span>
                <span className="text-white">{activeOrder.customer.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#B8AAA0]">Order Type:</span>
                <span className="font-bold text-[#FF8A1F] uppercase">{activeOrder.orderType}</span>
              </div>
              {activeOrder.deliveryDetails && (
                <div className="pt-2 border-t border-white/5">
                  <span className="text-[#B8AAA0] block">Address:</span>
                  <span className="text-white">
                    {activeOrder.deliveryDetails.address}, {activeOrder.deliveryDetails.area}
                  </span>
                </div>
              )}
            </div>

            {/* Items Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#D99A32]">
                Ordered Culinary Items
              </h4>
              <div className="divide-y divide-white/5 text-xs">
                {activeOrder.items.map((it) => (
                  <div key={it.id} className="py-2.5 flex justify-between items-start">
                    <div>
                      <span className="font-bold text-white">
                        {it.quantity}x {it.name}
                      </span>
                      {it.selectedAddOns && it.selectedAddOns.length > 0 && (
                        <div className="text-[10px] text-[#B8AAA0]">
                          +{it.selectedAddOns.map((a) => a.name).join(', ')}
                        </div>
                      )}
                      {it.specialInstructions && (
                        <div className="text-[10px] text-[#D99A32] italic">
                          "{it.specialInstructions}"
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-[#FF8A1F]">
                      Rs. {it.itemTotal.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="pt-4 border-t border-white/10 text-xs space-y-1.5">
              <div className="flex justify-between text-[#B8AAA0]">
                <span>Subtotal</span>
                <span className="text-white">Rs. {activeOrder.subtotal.toLocaleString()}</span>
              </div>
              {activeOrder.deliveryFee > 0 && (
                <div className="flex justify-between text-[#B8AAA0]">
                  <span>Delivery Fee</span>
                  <span className="text-white">Rs. {activeOrder.deliveryFee.toLocaleString()}</span>
                </div>
              )}
              {activeOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>- Rs. {activeOrder.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-2 flex justify-between text-base font-extrabold text-[#FF8A1F]">
                <span>Total Amount:</span>
                <span>Rs. {activeOrder.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Print Slip Action */}
            <div className="pt-4 flex gap-3">
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => {
                  window.print();
                }}
                leftIcon={<Printer size={16} />}
              >
                Print Kitchen KOT / Receipt
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
