import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { clearCart, setOrderType } from '../store/slices/cartSlice';
import { addToast } from '../store/slices/uiSlice';
import { orderService } from '../services/orderService';
import { adminService } from '../services/adminService';
import { DeliveryZone, OrderType, PaymentMethod } from '../types';
import { Button } from '../components/common/Button';
import { FlameIcon } from '../components/common/FlameIcon';
import confetti from 'canvas-confetti';
import {
  Bike,
  Store,
  Utensils,
  MapPin,
  Phone,
  User,
  Clock,
  CreditCard,
  Banknote,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector((state) => state.cart.items);
  const orderType = useAppSelector((state) => state.cart.orderType);
  const appliedCoupon = useAppSelector((state) => state.cart.appliedCoupon);
  const cartInstructions = useAppSelector((state) => state.cart.specialInstructions);
  const currentUser = useAppSelector((state) => state.auth.user);

  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form Fields
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');

  // Delivery Specific
  const [address, setAddress] = useState(currentUser?.savedAddresses?.[0]?.address || '');
  const [landmark, setLandmark] = useState(currentUser?.savedAddresses?.[0]?.landmark || '');
  const [deliveryNote, setDeliveryNote] = useState(cartInstructions || '');

  useEffect(() => {
    if (currentUser) {
      if (!fullName && currentUser.name) setFullName(currentUser.name);
      if (!phone && currentUser.phone) setPhone(currentUser.phone);
      if (!email && currentUser.email) setEmail(currentUser.email);
      if (!address && currentUser.savedAddresses?.[0]?.address) {
        setAddress(currentUser.savedAddresses[0].address);
      }
      if (!landmark && currentUser.savedAddresses?.[0]?.landmark) {
        setLandmark(currentUser.savedAddresses[0].landmark);
      }
    }
  }, [currentUser]);

  // Pickup Specific
  const [pickupTime, setPickupTime] = useState('Within 30-40 minutes');

  // Dine-in Specific
  const [dineInGuests, setDineInGuests] = useState(4);
  const [dineInTime, setDineInTime] = useState('08:00 PM');
  const [tableNumber, setTableNumber] = useState('Rooftop Lounge / Table 5');
  const [dineInNotes, setDineInNotes] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery');

  useEffect(() => {
    const loadZones = async () => {
      const zones = await adminService.getActiveDeliveryZones();
      setDeliveryZones(zones);
      if (zones.length > 0) {
        setSelectedZone(zones[0]);
      }
    };
    loadZones();
  }, []);

  // Update payment method default based on order type
  useEffect(() => {
    if (orderType === 'pickup') {
      setPaymentMethod('cash_on_pickup');
    } else if (orderType === 'dine-in') {
      setPaymentMethod('card_at_counter');
    } else {
      setPaymentMethod('cash_on_delivery');
    }
  }, [orderType]);

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);
  const deliveryFee = orderType === 'delivery' ? selectedZone?.fee || 150 : 0;

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
        discountAmount = appliedCoupon.maxDiscount;
      }
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const grandTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!phone.trim() || phone.length < 10) newErrors.phone = 'Valid phone number is required';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid email is required';

    if (orderType === 'delivery') {
      if (!address.trim()) newErrors.address = 'Street address is required';
      if (!selectedZone) newErrors.zone = 'Please select a delivery area';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      navigate('/menu');
      return;
    }

    if (!validateForm()) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Missing Required Information',
          message: 'Please complete all required fields highlighted in red.',
        })
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await orderService.createOrder({
        customer: {
          name: fullName,
          phone,
          email,
        },
        orderType,
        deliveryDetails:
          orderType === 'delivery'
            ? {
                fullName,
                phone,
                email,
                address,
                area: selectedZone?.name || 'Peshawar',
                landmark,
                instructions: deliveryNote,
              }
            : undefined,
        pickupDetails:
          orderType === 'pickup'
            ? {
                fullName,
                phone,
                pickupTime,
                instructions: deliveryNote,
              }
            : undefined,
        dineInDetails:
          orderType === 'dine-in'
            ? {
                fullName,
                phone,
                guests: dineInGuests,
                preferredTime: dineInTime,
                tableNumber,
                specialRequests: dineInNotes,
              }
            : undefined,
        items: cartItems,
        subtotal,
        deliveryFee,
        discount: discountAmount,
        couponCode: appliedCoupon?.code,
        tax: 0,
        total: grandTotal,
        paymentMethod,
        paymentStatus: 'unpaid',
        estimatedTime: orderType === 'delivery' ? (selectedZone?.estimatedMinutes || '35-45 mins') : '25-35 mins',
      });

      // Clear cart
      dispatch(clearCart());

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F97316', '#D99A32', '#EA580C', '#FFF7ED'],
        });
      } catch (err) {
        // Safe fallback if confetti canvas fails
      }

      dispatch(
        addToast({
          type: 'success',
          title: 'Order Placed Successfully! 🔥',
          message: `Order #${order.id} is confirmed. Estimated time: ${order.estimatedTime}`,
        })
      );

      navigate(`/order-success/${order.id}`);
    } catch (err) {
      console.error('Failed to place order', err);
      dispatch(
        addToast({
          type: 'error',
          title: 'Order Failed',
          message: 'Unable to process order. Please try again.',
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#080604] pt-32 pb-20 text-[#FFF7ED]">
        <div className="max-w-xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl font-bold font-heading">No Items in Order</h2>
          <p className="text-sm text-[#B8AAA0]">
            Please add your favorite Pakistani BBQ dishes to the cart before checking out.
          </p>
          <Button variant="primary" onClick={() => navigate('/menu')}>
            Explore Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080604] pt-28 pb-20 text-[#FFF7ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#FFF7ED] flex items-center gap-3">
            <FlameIcon size={32} />
            CHECKOUT & CONFIRMATION
          </h1>
          <p className="text-sm text-[#B8AAA0] mt-1">
            Complete your details to send your order directly to our flame kitchen.
          </p>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Checkout Form Columns */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Order Type */}
            <div className="p-6 rounded-2xl bg-[#120B08] border border-[#FF8A1F]/30 space-y-4 shadow-lg">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#FF8A1F]/15">
                <span className="w-6 h-6 rounded-full bg-[#FF8A1F] text-black font-extrabold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="text-base font-bold font-heading text-[#FFF7ED]">
                  SELECT ORDER TYPE
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    type: 'delivery' as OrderType,
                    title: 'Home Delivery',
                    desc: 'Hot thermal delivery in Peshawar',
                    icon: <Bike className="text-[#FF8A1F]" size={22} />,
                  },
                  {
                    type: 'pickup' as OrderType,
                    title: 'Self Takeaway',
                    desc: 'Pickup at University Town',
                    icon: <Store className="text-[#D99A32]" size={22} />,
                  },
                  {
                    type: 'dine-in' as OrderType,
                    title: 'Dine-In Order',
                    desc: 'Order ahead for table seating',
                    icon: <Utensils className="text-[#FF8A1F]" size={22} />,
                  },
                ].map((option) => (
                  <button
                    type="button"
                    key={option.type}
                    onClick={() => dispatch(setOrderType(option.type))}
                    className={`p-4 rounded-xl text-left transition-all border flex flex-col justify-between ${
                      orderType === option.type
                        ? 'bg-[#1A100C] border-[#FF8A1F] ring-1 ring-[#FF8A1F] shadow-lg shadow-[#F97316]/20'
                        : 'bg-[#1A100C]/50 border-white/10 hover:border-[#FF8A1F]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      {option.icon}
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          orderType === option.type
                            ? 'bg-[#FF8A1F] border-[#FF8A1F]'
                            : 'border-white/20'
                        }`}
                      >
                        {orderType === option.type && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </span>
                    </div>
                    <span className="font-bold text-sm text-[#FFF7ED] block">{option.title}</span>
                    <span className="text-[11px] text-[#B8AAA0] block mt-0.5">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Customer Contact Information */}
            <div className="p-6 rounded-2xl bg-[#120B08] border border-[#FF8A1F]/30 space-y-4 shadow-lg">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#FF8A1F]/15">
                <span className="w-6 h-6 rounded-full bg-[#FF8A1F] text-black font-extrabold text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="text-base font-bold font-heading text-[#FFF7ED]">
                  CUSTOMER INFORMATION
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#B8AAA0] block mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8AAA0]" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Asfandyar Khan"
                      className={`w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#1A100C] border text-xs text-[#FFF7ED] focus:outline-none ${
                        errors.fullName ? 'border-rose-500' : 'border-[#FF8A1F]/30 focus:border-[#FF8A1F]'
                      }`}
                    />
                  </div>
                  {errors.fullName && <p className="text-[11px] text-rose-400 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#B8AAA0] block mb-1.5">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8AAA0]" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0333-9123456"
                      className={`w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#1A100C] border text-xs text-[#FFF7ED] focus:outline-none ${
                        errors.phone ? 'border-rose-500' : 'border-[#FF8A1F]/30 focus:border-[#FF8A1F]'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] text-rose-400 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#B8AAA0] block mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={`w-full px-3 py-2.5 rounded-xl bg-[#1A100C] border text-xs text-[#FFF7ED] focus:outline-none ${
                      errors.email ? 'border-rose-500' : 'border-[#FF8A1F]/30 focus:border-[#FF8A1F]'
                    }`}
                  />
                  {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Step 3: Conditional Details (Delivery vs Pickup vs Dine-in) */}
            {orderType === 'delivery' && (
              <div className="p-6 rounded-2xl bg-[#120B08] border border-[#FF8A1F]/30 space-y-4 shadow-lg">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#FF8A1F]/15">
                  <span className="w-6 h-6 rounded-full bg-[#FF8A1F] text-black font-extrabold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h3 className="text-base font-bold font-heading text-[#FFF7ED]">
                    DELIVERY LOCATION (PESHAWAR)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#B8AAA0] block mb-1.5">
                      Delivery Area / Zone *
                    </label>
                    <select
                      value={selectedZone?.id || ''}
                      onChange={(e) => {
                        const zone = deliveryZones.find((z) => z.id === e.target.value);
                        if (zone) setSelectedZone(zone);
                      }}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-xs text-[#FFF7ED] focus:outline-none focus:border-[#FF8A1F]"
                    >
                      {deliveryZones.map((zone) => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name} (Fee: Rs. {zone.fee}) - {zone.estimatedMinutes}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#B8AAA0] block mb-1.5">
                      Nearby Landmark
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Near Tatara Park Gate 2 / Opposite Town Club"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-xs text-[#FFF7ED] focus:outline-none focus:border-[#FF8A1F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#B8AAA0] block mb-1.5">
                    Complete Street Address *
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House #, Street #, Sector, Colony..."
                    className={`w-full px-3 py-2.5 rounded-xl bg-[#1A100C] border text-xs text-[#FFF7ED] focus:outline-none ${
                      errors.address ? 'border-rose-500' : 'border-[#FF8A1F]/30 focus:border-[#FF8A1F]'
                    }`}
                  />
                  {errors.address && <p className="text-[11px] text-rose-400 mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#B8AAA0] block mb-1.5">
                    Rider Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                    placeholder="e.g. Call when entering street, security barrier code..."
                    className="w-full px-3 py-2.5 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/20 text-xs text-[#FFF7ED] focus:outline-none focus:border-[#FF8A1F]"
                  />
                </div>
              </div>
            )}

            {orderType === 'pickup' && (
              <div className="p-6 rounded-2xl bg-[#120B08] border border-[#FF8A1F]/30 space-y-4 shadow-lg">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#FF8A1F]/15">
                  <span className="w-6 h-6 rounded-full bg-[#FF8A1F] text-black font-extrabold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h3 className="text-base font-bold font-heading text-[#FFF7ED]">
                    PICKUP DETAILS
                  </h3>
                </div>

                <div className="p-4 rounded-xl bg-[#1A100C] border border-white/5 space-y-2 text-xs">
                  <div className="font-bold text-[#D99A32] flex items-center gap-2">
                    <MapPin size={16} className="text-[#FF8A1F]" />
                    <span>Restaurant Pickup Counter</span>
                  </div>
                  <p className="text-[#FFF7ED]">
                    Three Flames Restaurant, Bilour Chowk, Rehman Baba Road, Abdara Road, University Town, Peshawar.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#B8AAA0] block mb-1.5">
                    Preferred Collection Time
                  </label>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-xs text-[#FFF7ED] focus:outline-none focus:border-[#FF8A1F]"
                  >
                    <option value="Within 25-35 minutes">Within 25-35 minutes (Standard Preparation)</option>
                    <option value="In 45 minutes">In 45 minutes</option>
                    <option value="In 1 Hour">In 1 Hour</option>
                    <option value="Tonight 08:30 PM">Tonight 08:30 PM</option>
                    <option value="Tonight 09:30 PM">Tonight 09:30 PM</option>
                  </select>
                </div>
              </div>
            )}

            {orderType === 'dine-in' && (
              <div className="p-6 rounded-2xl bg-[#120B08] border border-[#FF8A1F]/30 space-y-4 shadow-lg">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#FF8A1F]/15">
                  <span className="w-6 h-6 rounded-full bg-[#FF8A1F] text-black font-extrabold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h3 className="text-base font-bold font-heading text-[#FFF7ED]">
                    DINE-IN TABLE SEATING
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#B8AAA0] block mb-1.5">
                      Number of Guests
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={dineInGuests}
                      onChange={(e) => setDineInGuests(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-xs text-[#FFF7ED] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#B8AAA0] block mb-1.5">
                      Arrival Time
                    </label>
                    <input
                      type="text"
                      value={dineInTime}
                      onChange={(e) => setDineInTime(e.target.value)}
                      placeholder="e.g. 08:30 PM"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-xs text-[#FFF7ED] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#B8AAA0] block mb-1.5">
                      Preferred Seating Area
                    </label>
                    <select
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-xs text-[#FFF7ED] focus:outline-none"
                    >
                      <option value="Rooftop Flame Lounge">Rooftop Flame Lounge</option>
                      <option value="Traditional Dastarkhwan">Traditional Dastarkhwan</option>
                      <option value="Indoor Family Hall">Indoor Family Hall</option>
                      <option value="Executive Dining">Executive Dining</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Payment Method */}
            <div className="p-6 rounded-2xl bg-[#120B08] border border-[#FF8A1F]/30 space-y-4 shadow-lg">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#FF8A1F]/15">
                <span className="w-6 h-6 rounded-full bg-[#FF8A1F] text-black font-extrabold text-xs flex items-center justify-center">
                  4
                </span>
                <h3 className="text-base font-bold font-heading text-[#FFF7ED]">
                  PAYMENT METHOD
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {orderType === 'delivery' && (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash_on_delivery')}
                    className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                      paymentMethod === 'cash_on_delivery'
                        ? 'bg-[#1A100C] border-[#FF8A1F] shadow-lg shadow-[#F97316]/15'
                        : 'bg-[#1A100C]/50 border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Banknote className="text-emerald-400" size={24} />
                      <div>
                        <span className="text-xs font-bold text-[#FFF7ED] block">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[11px] text-[#B8AAA0]">
                          Pay cash to rider upon arrival
                        </span>
                      </div>
                    </div>
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'cash_on_delivery'
                          ? 'bg-[#FF8A1F] border-[#FF8A1F]'
                          : 'border-white/20'
                      }`}
                    >
                      {paymentMethod === 'cash_on_delivery' && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </span>
                  </button>
                )}

                {orderType === 'pickup' && (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash_on_pickup')}
                    className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                      paymentMethod === 'cash_on_pickup'
                        ? 'bg-[#1A100C] border-[#FF8A1F] shadow-lg shadow-[#F97316]/15'
                        : 'bg-[#1A100C]/50 border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Store className="text-[#FF8A1F]" size={24} />
                      <div>
                        <span className="text-xs font-bold text-[#FFF7ED] block">
                          Pay at Restaurant Counter
                        </span>
                        <span className="text-[11px] text-[#B8AAA0]">Cash or Card on pickup</span>
                      </div>
                    </div>
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'cash_on_pickup'
                          ? 'bg-[#FF8A1F] border-[#FF8A1F]'
                          : 'border-white/20'
                      }`}
                    >
                      {paymentMethod === 'cash_on_pickup' && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </span>
                  </button>
                )}

                {orderType === 'dine-in' && (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card_at_counter')}
                    className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                      paymentMethod === 'card_at_counter'
                        ? 'bg-[#1A100C] border-[#FF8A1F] shadow-lg shadow-[#F97316]/15'
                        : 'bg-[#1A100C]/50 border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="text-[#D99A32]" size={24} />
                      <div>
                        <span className="text-xs font-bold text-[#FFF7ED] block">
                          Pay at Dining Table
                        </span>
                        <span className="text-[11px] text-[#B8AAA0]">Card or Cash at table</span>
                      </div>
                    </div>
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'card_at_counter'
                          ? 'bg-[#FF8A1F] border-[#FF8A1F]'
                          : 'border-white/20'
                      }`}
                    >
                      {paymentMethod === 'card_at_counter' && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setPaymentMethod('online_easypaisa_jazzcash')}
                  className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                    paymentMethod === 'online_easypaisa_jazzcash'
                      ? 'bg-[#1A100C] border-[#FF8A1F] shadow-lg shadow-[#F97316]/15'
                      : 'bg-[#1A100C]/50 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-[#FF8A1F]" size={24} />
                    <div>
                      <span className="text-xs font-bold text-[#FFF7ED] block">
                        JazzCash / EasyPaisa / Bank
                      </span>
                      <span className="text-[11px] text-[#B8AAA0]">Pay via mobile account</span>
                    </div>
                  </div>
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'online_easypaisa_jazzcash'
                        ? 'bg-[#FF8A1F] border-[#FF8A1F]'
                        : 'border-white/20'
                    }`}
                  >
                    {paymentMethod === 'online_easypaisa_jazzcash' && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            <div className="p-6 rounded-2xl bg-[#1A100C] border border-[#FF8A1F]/30 space-y-5 shadow-2xl">
              <h3 className="text-base font-bold font-heading text-[#FFF7ED] pb-3 border-b border-[#FF8A1F]/15">
                FINAL ORDER SUMMARY
              </h3>

              {/* Items Compact Preview */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1 divide-y divide-white/5">
                {cartItems.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                    <div className="flex-1 pr-2">
                      <span className="font-semibold text-white">
                        {item.quantity}x {item.name}
                      </span>
                      {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                        <div className="text-[10px] text-[#B8AAA0]">
                          +{item.selectedAddOns.map((a) => a.name).join(', ')}
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-[#D99A32] shrink-0">
                      Rs. {item.itemTotal.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total calculations */}
              <div className="pt-3 border-t border-[#FF8A1F]/15 space-y-2 text-xs">
                <div className="flex justify-between text-[#B8AAA0]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#FFF7ED]">
                    Rs. {subtotal.toLocaleString()}
                  </span>
                </div>

                {orderType === 'delivery' && (
                  <div className="flex justify-between text-[#B8AAA0]">
                    <span>Delivery Fee ({selectedZone?.name.split('&')[0] || 'Zone'})</span>
                    <span className="font-semibold text-[#FFF7ED]">
                      Rs. {deliveryFee.toLocaleString()}
                    </span>
                  </div>
                )}

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>- Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#FFF7ED]">TOTAL AMOUNT</span>
                  <span className="text-2xl font-black font-heading text-[#FF8A1F]">
                    Rs. {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                leftIcon={<FlameIcon size={18} glow={false} />}
              >
                🔥 PLACE ORDER NOW
              </Button>

              <p className="text-[11px] text-center text-[#B8AAA0] leading-relaxed">
                By placing this order, you confirm acceptance of Three Flames Restaurant fresh flame preparation terms.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
