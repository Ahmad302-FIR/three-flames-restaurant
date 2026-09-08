import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  ChefHat,
  PackageCheck,
  AlertCircle,
  RotateCcw,
  Box,
  Compass,
  ArrowRight,
} from 'lucide-react';

import {
  joinOrderTracking,
  leaveOrderTracking,
  onOrderStatusChange,
} from '../services/socketService';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchId, setSearchId] = useState(id || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [recentOrderId, setRecentOrderId] = useState<string>('');

  const fetchOrder = async (orderIdToFetch: string) => {
    const trimmed = orderIdToFetch.trim();
    if (!trimmed) return;
    setLoading(true);
    setSearched(true);
    try {
      // Allow searching with or without 'TF-' prefix
      const formatted = trimmed.toUpperCase().startsWith('TF-')
        ? trimmed.toUpperCase()
        : `TF-${trimmed.toUpperCase()}`;

      let found = await orderService.getOrderById(formatted);
      if (!found && formatted !== trimmed) {
        found = await orderService.getOrderById(trimmed);
      }
      setOrder(found);

      if (found) {
        try {
          localStorage.setItem('tf_recent_order_id', found.id);
          setRecentOrderId(found.id);
        } catch {}
      }
    } catch (err) {
      console.error('Order tracking fetch error:', err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const storedRecent = localStorage.getItem('tf_recent_order_id');
      if (storedRecent) {
        setRecentOrderId(storedRecent);
      }
    } catch {}

    if (id) {
      setSearchId(id);
      fetchOrder(id);
    } else {
      setOrder(null);
      setSearched(false);
    }
  }, [id]);

  // Real-time Socket.IO live order tracking + polling fallback
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

    // Gentle polling fallback every 15s for active orders (ensures updates in serverless / mobile background)
    let interval: any = null;
    const isActive = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(order.status);
    if (isActive) {
      interval = setInterval(async () => {
        try {
          const fresh = await orderService.getOrderById(order.id);
          if (fresh) {
            setOrder((prev) => {
              if (!prev) return fresh;
              if (
                prev.status !== fresh.status ||
                prev.estimatedTime !== fresh.estimatedTime ||
                JSON.stringify(prev.timeline) !== JSON.stringify(fresh.timeline)
              ) {
                return fresh;
              }
              return prev;
            });
          }
        } catch {}
      }, 15000);
    }

    return () => {
      leaveOrderTracking(order.id);
      cleanup();
      if (interval) clearInterval(interval);
    };
  }, [order?.id, order?.status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchId.trim().toUpperCase();
    if (clean) {
      const formatted = clean.startsWith('TF-') ? clean : `TF-${clean}`;
      navigate(`/track-order/${formatted}`);
      fetchOrder(formatted);
    }
  };

  const handleResetSearch = () => {
    setSearchId('');
    setSearched(false);
    setOrder(null);
    navigate('/track-order');
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  // 5-Stage Stepper mapping matching Three Flames live order progression
  const steps: { key: OrderStatus; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      key: 'pending',
      label: 'Order Placed',
      icon: <Clock size={18} />,
      desc: 'Received & queued by kitchen dispatcher',
    },
    {
      key: 'preparing',
      label: 'On Flame Grill',
      icon: <ChefHat size={18} />,
      desc: 'Marinated and grilling over red charcoal',
    },
    {
      key: 'ready',
      label: 'Packed & Sealed',
      icon: <Box size={18} />,
      desc: 'Sealed in insulated foil thermal box',
    },
    {
      key: 'out_for_delivery',
      label: order?.orderType === 'pickup' ? 'Ready for Pickup' : 'Out for Delivery',
      icon: <Bike size={18} />,
      desc: order?.orderType === 'pickup' ? 'Waiting at takeaway counter' : 'Rider dispatched on route to you',
    },
    {
      key: 'delivered',
      label: order?.orderType === 'dine-in' ? 'Served at Table' : 'Delivered & Savored',
      icon: <PackageCheck size={18} />,
      desc: 'Enjoy your hot wood-fired Pakistani BBQ!',
    },
  ];

  const getStepIndex = (status?: OrderStatus) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return 0;
      case 'preparing':
        return 1;
      case 'ready':
        return 2;
      case 'out_for_delivery':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 0;
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
          subtitle="Follow your charcoal skewers and desi ghee karahi from our University Town pit to your doorstep."
          className="mb-8"
        />

        {/* Order Search Box */}
        <div className="max-w-xl mx-auto mb-8">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF8A1F]"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Order ID (e.g. TF-1048)"
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#120B08] border border-[#FF8A1F]/30 text-xs text-[#FFF7ED] placeholder-[#B8AAA0] focus:outline-none focus:border-[#FF8A1F] transition-colors"
              />
            </div>
            <Button variant="primary" size="md" type="submit" isLoading={loading}>
              TRACK
            </Button>
          </form>

          {/* Helper / Recent Order Shortcut */}
          {recentOrderId && (!order || order.id !== recentOrderId) ? (
            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-[#B8AAA0]">
              <span>Recent order:</span>
              <button
                type="button"
                onClick={() => {
                  setSearchId(recentOrderId);
                  navigate(`/track-order/${recentOrderId}`);
                  fetchOrder(recentOrderId);
                }}
                className="text-[#FF8A1F] font-bold hover:underline inline-flex items-center gap-1"
              >
                #{recentOrderId} <ArrowRight size={12} />
              </button>
            </div>
          ) : (
            <div className="mt-2 text-center text-[11px] text-[#B8AAA0]">
              Enter the Order ID from your confirmation screen or email (e.g.{' '}
              <strong className="text-[#FF8A1F]">TF-1048</strong>)
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-12 text-center rounded-3xl bg-[#120B08] border border-[#FF8A1F]/20 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1A100C] border border-[#FF8A1F]/40 flex items-center justify-center mx-auto animate-pulse">
              <FlameIcon size={24} />
            </div>
            <h3 className="text-base font-bold font-heading text-white">
              Locating Order Status...
            </h3>
            <p className="text-xs text-[#B8AAA0]">
              Connecting to Three Flames kitchen dispatcher and live radar.
            </p>
          </div>
        )}

        {/* Order Details & Progress Stepper */}
        {!loading && order ? (
          <div className="space-y-8">
            {/* Top Status Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#120B08] border border-[#FF8A1F]/30 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#FF8A1F]/15">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <FlameIcon size={22} />
                    <span className="text-2xl font-black font-heading text-[#FFF7ED] tracking-wide">
                      Order #{order.id}
                    </span>
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FF8A1F]/20 text-[#FF8A1F] border border-[#FF8A1F]/40">
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[#B8AAA0] mt-1.5">
                    Placed on {new Date(order.createdAt).toLocaleString()} • Fulfillment:{' '}
                    <strong className="text-white capitalize">{order.orderType}</strong>
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-[#B8AAA0] uppercase font-semibold block">
                    Estimated Time
                  </span>
                  <span className="text-lg font-bold text-[#F2B84B] flex items-center sm:justify-end gap-1.5 mt-0.5">
                    <Clock size={16} />
                    {order.estimatedTime || '30-40 mins'}
                  </span>
                </div>
              </div>

              {/* Progress Stepper Visual */}
              <div className="py-4">
                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
                  {/* Connecting Line (Desktop) */}
                  <div className="hidden md:block absolute top-6 left-8 right-8 h-0.5 bg-white/10 -z-0">
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
                        className="flex md:flex-col items-center md:text-center gap-4 md:gap-2 relative z-10 w-full md:w-36"
                      >
                        {/* Step Circle Icon */}
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 shrink-0 ${
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

              {/* Detailed Live Timeline Logs if available */}
              {order.timeline && order.timeline.length > 0 && (
                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-[#D99A32] mb-3 flex items-center gap-2">
                    <Clock size={14} className="text-[#FF8A1F]" />
                    <span>Kitchen & Delivery Milestones</span>
                  </h4>
                  <div className="space-y-2">
                    {order.timeline.map((event, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between text-xs p-2.5 rounded-xl border ${
                          event.completed
                            ? 'bg-[#1A100C] border-[#FF8A1F]/30 text-white'
                            : 'bg-[#120B08] border-white/5 text-[#B8AAA0]/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              event.completed ? 'bg-[#FF8A1F]' : 'bg-white/20'
                            }`}
                          />
                          <span className="font-semibold">{event.title}</span>
                          {event.note && (
                            <span className="text-[11px] text-[#B8AAA0] hidden sm:inline">
                              — {event.note}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-[#D99A32]">
                          {event.timestamp || (event.completed ? 'Completed' : 'Pending')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                    {order.deliveryDetails.phone && (
                      <p className="text-white/60">Phone: {order.deliveryDetails.phone}</p>
                    )}
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
                  {order.items.map((item, idx) => (
                    <div key={item.id || idx} className="pt-2 first:pt-0 flex justify-between">
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
                <div className="w-10 h-10 rounded-xl bg-[#080604] border border-[#FF8A1F]/40 flex items-center justify-center text-[#FF8A1F] shrink-0">
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
                href={restaurantInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp"
                className="px-5 py-2.5 rounded-xl bg-[#080604] border border-[#FF8A1F]/40 text-[#FF8A1F] hover:text-white hover:bg-[#FF8A1F]/20 font-bold text-xs transition-colors shrink-0"
              >
                CALL {restaurantInfo.phone}
              </a>
            </div>
          </div>
        ) : searched && !loading ? (
          /* Friendly Order Not Found Error Card */
          <div className="p-8 sm:p-12 text-center rounded-3xl bg-[#120B08] border border-[#FF8A1F]/30 space-y-5 shadow-2xl max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#1A100C] border border-[#FF8A1F]/40 flex items-center justify-center mx-auto text-[#FF8A1F]">
              <AlertCircle size={28} />
            </div>

            <h3 className="text-xl font-bold font-heading text-white">
              Order #{searchId} Not Found
            </h3>

            <p className="text-xs text-[#B8AAA0] leading-relaxed">
              We could not locate an active order matching this ID. Please make sure you typed the complete code from your confirmation screen or email (e.g.{' '}
              <strong className="text-[#FF8A1F]">TF-1048</strong>).
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={handleResetSearch}
                leftIcon={<RotateCcw size={15} />}
              >
                TRY ANOTHER ORDER ID
              </Button>

              <a
                href={restaurantInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-xs font-semibold text-[#FF8A1F] hover:bg-[#FF8A1F]/10 transition-colors flex items-center gap-1.5"
              >
                <Phone size={14} />
                <span>Help via WhatsApp</span>
              </a>
            </div>
          </div>
        ) : !loading ? (
          /* Initial Landing Guide when opening /track-order without an ID */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-[#120B08] border border-white/5 space-y-2 text-center">
              <div className="w-10 h-10 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-[#FF8A1F] flex items-center justify-center mx-auto font-bold font-heading">
                1
              </div>
              <h4 className="text-sm font-bold text-white">Find Your Order ID</h4>
              <p className="text-xs text-[#B8AAA0] leading-relaxed">
                Check the confirmation screen or email you received when placing your order.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#120B08] border border-white/5 space-y-2 text-center">
              <div className="w-10 h-10 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-[#FF8A1F] flex items-center justify-center mx-auto font-bold font-heading">
                2
              </div>
              <h4 className="text-sm font-bold text-white">Enter & Submit</h4>
              <p className="text-xs text-[#B8AAA0] leading-relaxed">
                Type your Order ID in the box above (e.g. TF-1048) and click <strong className="text-white">TRACK</strong>.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#120B08] border border-white/5 space-y-2 text-center">
              <div className="w-10 h-10 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-[#FF8A1F] flex items-center justify-center mx-auto font-bold font-heading">
                3
              </div>
              <h4 className="text-sm font-bold text-white">Live Kitchen Updates</h4>
              <p className="text-xs text-[#B8AAA0] leading-relaxed">
                Watch real-time live charcoal grilling, thermal packaging, and dispatch updates.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default OrderTrackingPage;

