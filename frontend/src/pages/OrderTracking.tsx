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
  ShieldCheck,
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

  const isOnlinePayment =
    order?.paymentMethod === 'online' ||
    order?.status === 'payment_verification' ||
    order?.paymentStatus === 'submitted' ||
    order?.paymentStatus === 'verified' ||
    order?.paymentStatus === 'rejected';

  const isRejected = order?.paymentStatus === 'rejected';

  // Stepper mapping matching Ahmed Khan Restaurant live order progression
  const steps: { key: OrderStatus; label: string; icon: React.ReactNode; desc: string }[] = isOnlinePayment
    ? [
        {
          key: 'pending',
          label: 'Order Placed',
          icon: <Clock size={18} />,
          desc: 'Transfer proof submitted by customer',
        },
        {
          key: 'payment_verification',
          label: isRejected
            ? 'Payment Rejected'
            : order?.paymentStatus === 'verified'
            ? 'Payment Verified'
            : 'Payment Review',
          icon: <ShieldCheck size={18} />,
          desc: isRejected
            ? (order?.paymentRejectionReason || 'Screenshot rejected')
            : order?.paymentStatus === 'verified'
            ? 'Approved & confirmed by management'
            : 'Manager reviewing transfer screenshot',
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
      ]
    : [
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
    if (isOnlinePayment) {
      switch (status) {
        case 'pending_payment':
          return 0;
        case 'payment_verification':
          return 1;
        case 'pending':
          return order?.paymentStatus === 'verified' ? 1 : 0;
        case 'confirmed':
          return 1;
        case 'preparing':
          return 2;
        case 'ready':
          return 3;
        case 'out_for_delivery':
          return 4;
        case 'delivered':
          return 5;
        default:
          return 0;
      }
    }
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
    <div className="min-h-screen bg-[#FFFDFC] pt-28 pb-20 text-[#25201D]">
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
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B85C38]"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Order ID (e.g. TF-1048)"
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#FFFFFF] border border-[#E8DED6] text-xs text-[#25201D] placeholder-[#6F6761] focus:outline-none focus:border-[#E8DED6] transition-colors"
              />
            </div>
            <Button variant="primary" size="md" type="submit" isLoading={loading}>
              TRACK
            </Button>
          </form>

          {/* Helper / Recent Order Shortcut */}
          {recentOrderId && (!order || order.id !== recentOrderId) ? (
            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-[#6F6761]">
              <span>Recent order:</span>
              <button
                type="button"
                onClick={() => {
                  setSearchId(recentOrderId);
                  navigate(`/track-order/${recentOrderId}`);
                  fetchOrder(recentOrderId);
                }}
                className="text-[#B85C38] font-bold hover:underline inline-flex items-center gap-1"
              >
                #{recentOrderId} <ArrowRight size={12} />
              </button>
            </div>
          ) : (
            <div className="mt-2 text-center text-[11px] text-[#6F6761]">
              Enter the Order ID from your confirmation screen or email (e.g.{' '}
              <strong className="text-[#B85C38]">TF-1048</strong>)
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-12 text-center rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F7F3EE] border border-[#E8DED6] flex items-center justify-center mx-auto animate-pulse">
              <FlameIcon size={24} />
            </div>
            <h3 className="text-base font-bold font-heading text-[#25201D]">
              Locating Order Status...
            </h3>
            <p className="text-xs text-[#6F6761]">
              Connecting to Ahmed Khan Restaurant kitchen dispatcher and live radar.
            </p>
          </div>
        )}

        {/* Order Details & Progress Stepper */}
        {!loading && order ? (
          <div className="space-y-8">
            {/* Top Status Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DED6]">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <FlameIcon size={22} />
                    <span className="text-2xl font-black font-heading text-[#25201D] tracking-wide">
                      Order #{order.id}
                    </span>
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#B85C38]/20 text-[#B85C38] border border-[#E8DED6]">
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[#6F6761] mt-1.5">
                    Placed on {new Date(order.createdAt).toLocaleString()} • Fulfillment:{' '}
                    <strong className="text-[#25201D] capitalize">{order.orderType}</strong>
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-[#6F6761] uppercase font-semibold block">
                    Estimated Time
                  </span>
                  <span className="text-lg font-bold text-[#B85C38] flex items-center sm:justify-end gap-1.5 mt-0.5">
                    <Clock size={16} />
                    {order.estimatedTime || '30-40 mins'}
                  </span>
                </div>
              </div>

              {/* Payment Verification Status Notifications */}
              {isRejected && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm space-y-1">
                  <div className="font-bold flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-600" />
                    Payment Verification Rejected
                  </div>
                  <p>{order.paymentRejectionReason || 'The payment screenshot provided could not be verified against our accounts.'}</p>
                  <p className="text-[11px] text-red-700">Please contact our kitchen desk via phone/WhatsApp to rectify your payment details.</p>
                </div>
              )}

              {(order.status === 'payment_verification' || order.paymentStatus === 'submitted') && !isRejected && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs sm:text-sm space-y-1">
                  <div className="font-bold flex items-center gap-2">
                    <Clock size={16} className="text-amber-700" />
                    Awaiting Payment Verification
                  </div>
                  <p>Our team is verifying your payment transfer screenshot. Your order will be confirmed and scheduled for grilling once verified.</p>
                </div>
              )}

              {/* Progress Stepper Visual */}
              <div className="py-4">
                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
                  {/* Connecting Line (Desktop) */}
                  <div className="hidden md:block absolute top-6 left-8 right-8 h-0.5 bg-[#E8DED6] -z-0">
                    <div
                      className="h-full bg-gradient-to-r from-[#B85C38] to-[#B85C38] transition-all duration-700"
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
                              ? 'bg-[#B85C38] border-[#B85C38] text-white shadow-lg shadow-[#B85C38]/40 scale-110'
                              : isDone
                              ? 'bg-[#F7F3EE] border-[#E8DED6] text-[#B85C38]'
                              : 'bg-[#F7F3EE]/60 border-[#E8DED6] text-[#6F6761]/40'
                          }`}
                        >
                          {step.icon}
                        </div>

                        {/* Step Label & Info */}
                        <div className="text-left md:text-center">
                          <h4
                            className={`text-xs font-bold uppercase tracking-wider ${
                              isDone ? 'text-[#25201D]' : 'text-[#6F6761]'
                            }`}
                          >
                            {step.label}
                          </h4>
                          <p className="text-[11px] text-[#6F6761] mt-0.5 max-w-xs md:max-w-none">
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
                <div className="pt-4 border-t border-[#E8DED6]">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-[#B85C38] mb-3 flex items-center gap-2">
                    <Clock size={14} className="text-[#B85C38]" />
                    <span>Kitchen & Delivery Milestones</span>
                  </h4>
                  <div className="space-y-2">
                    {order.timeline.map((event, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between text-xs p-2.5 rounded-xl border ${
                          event.completed
                            ? 'bg-[#F7F3EE] border-[#E8DED6] text-[#25201D]'
                            : 'bg-[#FFFFFF] border-[#E8DED6] text-[#6F6761]/70'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              event.completed ? 'bg-[#B85C38]' : 'bg-[#E8DED6]'
                            }`}
                          />
                          <span className="font-semibold">{event.title}</span>
                          {event.note && (
                            <span className="text-[11px] text-[#6F6761] hidden sm:inline">
                              — {event.note}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-[#B85C38]">
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
              <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#B85C38] flex items-center gap-2">
                  <MapPin size={16} className="text-[#B85C38]" />
                  {order.orderType === 'delivery'
                    ? 'Delivery Destination'
                    : order.orderType === 'pickup'
                    ? 'Pickup Location'
                    : 'Table Seating'}
                </h3>

                {order.orderType === 'delivery' && order.deliveryDetails && (
                  <div className="text-xs space-y-1.5 text-[#6F6761]">
                    <p className="font-bold text-[#25201D] text-sm">{order.deliveryDetails.fullName}</p>
                    <p>{order.deliveryDetails.address}</p>
                    <p className="text-[#B85C38]">Area: {order.deliveryDetails.area}</p>
                    {order.deliveryDetails.landmark && (
                      <p>Landmark: {order.deliveryDetails.landmark}</p>
                    )}
                    {order.deliveryDetails.phone && (
                      <p className="text-[#25201D] font-medium">Phone: {order.deliveryDetails.phone}</p>
                    )}
                  </div>
                )}

                {order.orderType === 'pickup' && (
                  <div className="text-xs space-y-1.5 text-[#6F6761]">
                    <p className="font-bold text-[#25201D] text-sm">Ahmed Khan Restaurant</p>
                    <p>{restaurantInfo.address}</p>
                    <p className="text-[#B85C38]">Ready in approx: {order.estimatedTime}</p>
                  </div>
                )}

                {order.orderType === 'dine-in' && order.dineInDetails && (
                  <div className="text-xs space-y-1.5 text-[#6F6761]">
                    <p className="font-bold text-[#25201D] text-sm">
                      Guests: {order.dineInDetails.guests} People
                    </p>
                    <p>Table/Area: {order.dineInDetails.tableNumber}</p>
                    <p className="text-[#B85C38]">Time: {order.dineInDetails.preferredTime}</p>
                  </div>
                )}
              </div>

              {/* Items & Payment */}
              <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#B85C38] flex items-center gap-2">
                  <Utensils size={16} className="text-[#B85C38]" />
                  Ordered Items & Bill
                </h3>

                <div className="divide-y divide-[#E8DED6] text-xs space-y-2 max-h-40 overflow-y-auto pr-1">
                  {order.items.map((item, idx) => (
                    <div key={item.id || idx} className="pt-2 first:pt-0 flex justify-between">
                      <span className="text-[#25201D] font-medium">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-semibold text-[#B85C38]">
                        Rs. {item.itemTotal.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#E8DED6] flex justify-between text-sm font-bold text-[#B85C38]">
                  <span>Total Amount</span>
                  <span>Rs. {order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Need Help Support Banner */}
            <div className="p-6 rounded-2xl bg-[#F7F3EE] border border-[#E8DED6] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFFDFC] border border-[#E8DED6] flex items-center justify-center text-[#B85C38] shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#25201D]">Need an urgent update?</h4>
                  <p className="text-xs text-[#6F6761]">
                    Speak directly with our Peshawar restaurant dispatch manager.
                  </p>
                </div>
              </div>

              <a
                href={restaurantInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp"
                className="px-5 py-2.5 rounded-xl bg-[#FFFDFC] border border-[#E8DED6] text-[#B85C38] hover:text-[#25201D] hover:bg-[#B85C38]/20 font-bold text-xs transition-colors shrink-0"
              >
                CALL {restaurantInfo.phone}
              </a>
            </div>
          </div>
        ) : searched && !loading ? (
          /* Friendly Order Not Found Error Card */
          <div className="p-8 sm:p-12 text-center rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] space-y-5 shadow-2xl max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#F7F3EE] border border-[#E8DED6] flex items-center justify-center mx-auto text-[#B85C38]">
              <AlertCircle size={28} />
            </div>

            <h3 className="text-xl font-bold font-heading text-[#25201D]">
              Order #{searchId} Not Found
            </h3>

            <p className="text-xs text-[#6F6761] leading-relaxed">
              We could not locate an active order matching this ID. Please make sure you typed the complete code from your confirmation screen or email (e.g.{' '}
              <strong className="text-[#B85C38]">TF-1048</strong>).
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
                className="px-4 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs font-semibold text-[#B85C38] hover:bg-[#B85C38]/10 transition-colors flex items-center gap-1.5"
              >
                <Phone size={14} />
                <span>Help via WhatsApp</span>
              </a>
            </div>
          </div>
        ) : !loading ? (
          /* Initial Landing Guide when opening /track-order without an ID */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] space-y-2 text-center">
              <div className="w-10 h-10 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-[#B85C38] flex items-center justify-center mx-auto font-bold font-heading">
                1
              </div>
              <h4 className="text-sm font-bold text-[#25201D]">Find Your Order ID</h4>
              <p className="text-xs text-[#6F6761] leading-relaxed">
                Check the confirmation screen or email you received when placing your order.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] space-y-2 text-center">
              <div className="w-10 h-10 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-[#B85C38] flex items-center justify-center mx-auto font-bold font-heading">
                2
              </div>
              <h4 className="text-sm font-bold text-[#25201D]">Enter & Submit</h4>
              <p className="text-xs text-[#6F6761] leading-relaxed">
                Type your Order ID in the box above (e.g. TF-1048) and click <strong className="text-[#25201D]">TRACK</strong>.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] space-y-2 text-center">
              <div className="w-10 h-10 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-[#B85C38] flex items-center justify-center mx-auto font-bold font-heading">
                3
              </div>
              <h4 className="text-sm font-bold text-[#25201D]">Live Kitchen Updates</h4>
              <p className="text-xs text-[#6F6761] leading-relaxed">
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

