import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Order, OrderStatus } from '../types';
import { orderService } from '../services/orderService';
import { Button } from '../components/common/Button';
import { FlameIcon } from '../components/common/FlameIcon';
import { SectionHeading } from '../components/common/SectionHeading';
import { restaurantInfo } from '../../src/data/restaurantData';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Search,
  Bike,
  Utensils,
  Flame,
  ChefHat,
  PackageCheck,
  AlertCircle,
} from 'lucide-react';

import {
  joinOrderTracking,
  leaveOrderTracking,
  onOrderStatusChange,
} from '../services/socketService';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [searchId, setSearchId] = useState(id || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchOrder = async (orderIdToFetch: string) => {
    if (!orderIdToFetch.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const found = await orderService.getOrderById(orderIdToFetch.trim());
      setOrder(found);
    } catch (err) {
      console.error(err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrder(id);
    }
  }, [id]);

  // Real-time Socket.IO live order tracking
  useEffect(() => {
    if (!order?.id) return;

    joinOrderTracking(order.id);

    const cleanup = onOrderStatusChange((data) => {
      if (data.orderNumber?.toUpperCase() === order.id?.toUpperCase()) {
        setOrder((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            status: data.status,
            timeline: data.timeline || prev.timeline,
            estimatedTime: data.estimatedTime || prev.estimatedTime,
            paymentStatus: data.paymentStatus || prev.paymentStatus,
          };
        });
      }
    });

    return () => {
      leaveOrderTracking(order.id);
      cleanup();
    };
  }, [order?.id]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      navigate(`/track-order/${searchId.trim()}`);
      fetchOrder(searchId);
    }
  };

  // Stepper mapping
  const steps: { key: OrderStatus; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      key: 'pending',
      label: 'Order Placed',
      icon: <Clock size={20} />,
      desc: 'Order received by kitchen dispatcher',
    },
    {
      key: 'preparing',
      label: 'On Charcoal Flame',
      icon: <ChefHat size={20} />,
      desc: 'Marinated and cooking over red coals',
    },
    {
      key: 'out_for_delivery',
      label: order?.orderType === 'pickup' ? 'Ready for Pickup' : 'Out for Delivery',
      icon: <Bike size={20} />,
      desc: order?.orderType === 'pickup' ? 'Bagged at the takeaway counter' : 'Thermal bag dispatched with rider',
    },
    {
      key: 'delivered',
      label: order?.orderType === 'dine-in' ? 'Served at Table' : 'Delivered & Completed',
      icon: <PackageCheck size={20} />,
      desc: 'Enjoy your hot Pakistani BBQ meal!',
    },
  ];

  const getStepIndex = (status?: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'confirmed':
      case 'preparing':
        return 1;
      case 'ready':
      case 'out_for_delivery':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 1;
    }
  };

  const currentStepIdx = getStepIndex(order?.status);

  return (
    <div className="min-h-screen bg-[#080604] pt-28 pb-20 text-[#FFF7ED]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <SectionHeading
          badgeText="REAL-TIME KITCHEN & DELIVERY RADAR"
          title="TRACK YOUR FLAME ORDER"
          subtitle="Check live status from the live charcoal skewers in University Town to your doorstep."
          className="mb-8"
        />

        {/* Order Search Box */}
        <div className="max-w-xl mx-auto mb-10">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF8A1F]"
              />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Order ID (e.g. TF-1001, TF-1002...)"
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#120B08] border border-[#FF8A1F]/30 text-xs text-[#FFF7ED] placeholder-[#B8AAA0] focus:outline-none focus:border-[#FF8A1F]"
              />
            </div>
            <Button variant="primary" size="md" type="submit" isLoading={loading}>
              TRACK
            </Button>
          </form>
          <div className="mt-2 text-center text-[11px] text-[#B8AAA0]">
            Try demo IDs: <strong className="text-[#FF8A1F]">TF-1001</strong>,{' '}
            <strong className="text-[#FF8A1F]">TF-1002</strong>,{' '}
            <strong className="text-[#FF8A1F]">TF-1003</strong>
          </div>
        </div>

        {/* Order Details & Progress Stepper */}
        {order ? (
          <div className="space-y-8">
            {/* Top Status Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#120B08] border border-[#FF8A1F]/30 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#FF8A1F]/15">
                <div>
                  <div className="flex items-center gap-2">
                    <FlameIcon size={20} />
                    <span className="text-xl font-bold font-heading text-[#FFF7ED]">
                      Order #{order.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FF8A1F]/20 text-[#FF8A1F] border border-[#FF8A1F]/40">
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[#B8AAA0] mt-1">
                    Placed on {new Date(order.createdAt).toLocaleString()} • Type: <strong className="text-white capitalize">{order.orderType}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-[#B8AAA0] uppercase font-semibold block">
                    Estimated Time
                  </span>
                  <span className="text-lg font-bold text-[#F2B84B] flex items-center justify-end gap-1.5">
                    <Clock size={16} />
                    {order.estimatedTime || '30-40 mins'}
                  </span>
                </div>
              </div>

              {/* Progress Stepper Visual */}
              <div className="py-4">
                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
                  {/* Connecting Line (Desktop) */}
                  <div className="hidden md:block absolute top-6 left-10 right-10 h-0.5 bg-white/10 -z-0">
                    <div
                      className="h-full bg-gradient-to-r from-[#F97316] to-[#D99A32] transition-all duration-700"
                      style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
                    />
                  </div>

                  {steps.map((step, idx) => {
                    const isDone = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;

                    return (
                      <div
                        key={step.key}
                        className="flex md:flex-col items-center md:text-center gap-4 md:gap-2 relative z-10 w-full md:w-44"
                      >
                        {/* Step Circle Icon */}
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                            isCurrent
                              ? 'bg-[#F97316] border-[#FFF7ED] text-black shadow-lg shadow-[#F97316]/50 scale-110'
                              : isDone
                              ? 'bg-[#1A100C] border-[#FF8A1F] text-[#FF8A1F]'
                              : 'bg-[#1A100C]/60 border-white/10 text-white/30'
                          }`}
                        >
                          {step.icon}
                        </div>

                        {/* Step Label & Info */}
                        <div className="text-left md:text-center">
                          <h4
                            className={`text-xs font-bold uppercase tracking-wider ${
                              isDone ? 'text-[#FFF7ED]' : 'text-white/40'
                            }`}
                          >
                            {step.label}
                          </h4>
                          <p className="text-[11px] text-[#B8AAA0] mt-0.5 max-w-xs md:max-w-none">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Content Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Delivery / Pickup Address */}
              <div className="p-6 rounded-2xl bg-[#120B08] border border-[#FF8A1F]/20 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#D99A32] flex items-center gap-2">
                  <MapPin size={16} className="text-[#FF8A1F]" />
                  {order.orderType === 'delivery'
                    ? 'Delivery Destination'
                    : order.orderType === 'pickup'
                    ? 'Pickup Location'
                    : 'Table Seating'}
                </h3>

                {order.orderType === 'delivery' && order.deliveryDetails && (
                  <div className="text-xs space-y-1.5 text-[#B8AAA0]">
                    <p className="font-bold text-white text-sm">{order.deliveryDetails.fullName}</p>
                    <p>{order.deliveryDetails.address}</p>
                    <p className="text-[#FF8A1F]">Area: {order.deliveryDetails.area}</p>
                    {order.deliveryDetails.landmark && (
                      <p>Landmark: {order.deliveryDetails.landmark}</p>
                    )}
                    <p className="text-white/60">Phone: {order.deliveryDetails.phone}</p>
                  </div>
                )}

                {order.orderType === 'pickup' && (
                  <div className="text-xs space-y-1.5 text-[#B8AAA0]">
                    <p className="font-bold text-white text-sm">Three Flames Restaurant</p>
                    <p>{restaurantInfo.address}</p>
                    <p className="text-[#FF8A1F]">Ready in approx: {order.estimatedTime}</p>
                  </div>
                )}

                {order.orderType === 'dine-in' && order.dineInDetails && (
                  <div className="text-xs space-y-1.5 text-[#B8AAA0]">
                    <p className="font-bold text-white text-sm">
                      Guests: {order.dineInDetails.guests} People
                    </p>
                    <p>Table/Area: {order.dineInDetails.tableNumber}</p>
                    <p className="text-[#FF8A1F]">Time: {order.dineInDetails.preferredTime}</p>
                  </div>
                )}
              </div>

              {/* Items & Payment */}
              <div className="p-6 rounded-2xl bg-[#120B08] border border-[#FF8A1F]/20 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#D99A32] flex items-center gap-2">
                  <Utensils size={16} className="text-[#FF8A1F]" />
                  Ordered Items & Bill
                </h3>

                <div className="divide-y divide-white/5 text-xs space-y-2 max-h-40 overflow-y-auto pr-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="pt-2 first:pt-0 flex justify-between">
                      <span className="text-white">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-semibold text-[#D99A32]">
                        Rs. {item.itemTotal.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between text-sm font-bold text-[#FF8A1F]">
                  <span>Total Amount</span>
                  <span>Rs. {order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Need Help Support Banner */}
            <div className="p-6 rounded-2xl bg-[#1A100C] border border-[#FF8A1F]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#080604] border border-[#FF8A1F]/40 flex items-center justify-center text-[#FF8A1F]">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Need an urgent update?</h4>
                  <p className="text-xs text-[#B8AAA0]">
                    Speak directly with our Peshawar restaurant dispatch manager.
                  </p>
                </div>
              </div>

              <a
                href={`tel:${restaurantInfo.phone}`}
                className="px-5 py-2.5 rounded-xl bg-[#080604] border border-[#FF8A1F]/40 text-[#FF8A1F] hover:text-white hover:bg-[#FF8A1F]/20 font-bold text-xs transition-colors shrink-0"
              >
                CALL {restaurantInfo.phone}
              </a>
            </div>
          </div>
        ) : searched && !loading ? (
          <div className="p-12 text-center rounded-3xl bg-[#120B08] border border-white/10 space-y-4">
            <AlertCircle size={36} className="text-[#FF8A1F] mx-auto" />
            <h3 className="text-lg font-bold font-heading text-white">Order Not Found</h3>
            <p className="text-xs text-[#B8AAA0] max-w-sm mx-auto">
              We could not locate order "{searchId}". Please check your order confirmation SMS/email or try one of the demo orders.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
