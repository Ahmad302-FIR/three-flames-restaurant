import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { clearCart, setOrderType } from '../store/slices/cartSlice';
import { addToast } from '../store/slices/uiSlice';
import { orderService } from '../services/orderService';
import { adminService } from '../services/adminService';
import { DeliveryZone, OrderType, PaymentMethod, PaymentProvider } from '../types';
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
  UploadCloud,
  Check,
  Copy,
  X,
  Smartphone,
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
  const [paymentProvider, setPaymentProvider] = useState<PaymentProvider>('easypaisa');
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleCopyNumber = (num: string) => {
    try {
      navigator.clipboard.writeText(num);
      setCopiedNumber(num);
      setTimeout(() => setCopiedNumber(null), 2500);
    } catch {
      // clipboard fallback
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Invalid File Format',
          message: 'Please upload a JPG, PNG, or WEBP image screenshot.',
        })
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      dispatch(
        addToast({
          type: 'error',
          title: 'File Too Large',
          message: 'Payment screenshot must be under 5MB.',
        })
      );
      return;
    }

    setPaymentProofFile(file);
    const previewUrl = URL.createObjectURL(file);
    setPaymentProofPreview(previewUrl);
    setErrors((prev) => {
      const u = { ...prev };
      delete u.paymentScreenshot;
      return u;
    });
  };

  const handleRemoveScreenshot = () => {
    setPaymentProofFile(null);
    if (paymentProofPreview) {
      URL.revokeObjectURL(paymentProofPreview);
    }
    setPaymentProofPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Valid phone number is required';
    }
    if (!email.trim() || !email.includes('@')) {
      newErrors.email = 'Valid email address is required';
    }

    if (orderType === 'delivery') {
      if (!address.trim()) newErrors.address = 'Street address is required for delivery';
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

    const isOnline = paymentMethod === 'online' || (paymentMethod as any) === 'online_easypaisa_jazzcash';

    if (isOnline && !paymentProofFile) {
      setErrors((prev) => ({
        ...prev,
        paymentScreenshot: 'Please upload your payment transfer screenshot to proceed.',
      }));
      dispatch(
        addToast({
          type: 'error',
          title: 'Payment Screenshot Required',
          message: 'Please attach your payment screenshot proof before placing your order.',
        })
      );
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedScreenshotUrl = '';
      if (isOnline && paymentProofFile) {
        uploadedScreenshotUrl = await orderService.uploadPaymentProof(paymentProofFile);
      }

      const order = await orderService.createOrder({
        customer: {
          name: fullName.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
        },
        orderType,
        deliveryDetails:
          orderType === 'delivery'
            ? {
                fullName: fullName.trim(),
                phone: phone.trim(),
                email: email.trim().toLowerCase(),
                address: address.trim(),
                area: selectedZone?.name || 'Peshawar',
                landmark: landmark.trim(),
                instructions: deliveryNote.trim(),
              }
            : undefined,
        pickupDetails:
          orderType === 'pickup'
            ? {
                fullName: fullName.trim(),
                phone: phone.trim(),
                pickupTime,
                instructions: deliveryNote.trim(),
              }
            : undefined,
        dineInDetails:
          orderType === 'dine-in'
            ? {
                fullName: fullName.trim(),
                phone: phone.trim(),
                guests: dineInGuests,
                preferredTime: dineInTime,
                tableNumber,
                specialRequests: dineInNotes.trim(),
              }
            : undefined,
        items: cartItems,
        subtotal,
        deliveryFee,
        discount: discountAmount,
        couponCode: appliedCoupon?.code,
        tax: 0,
        total: grandTotal,
        paymentMethod: isOnline ? 'online' : paymentMethod,
        paymentProvider: isOnline ? paymentProvider : (paymentMethod === 'cash_on_delivery' ? 'cod' : 'counter'),
        paymentScreenshot: isOnline ? uploadedScreenshotUrl : undefined,
        transactionId: isOnline && transactionId.trim() ? transactionId.trim() : undefined,
        paymentStatus: isOnline ? 'submitted' : 'unpaid',
        estimatedTime:
          orderType === 'delivery'
            ? selectedZone?.estimatedMinutes || '35-45 mins'
            : '25-35 mins',
      });

      // Clear cart
      dispatch(clearCart());

      const finalOrderId = order.orderNumber || order.id;

      if (isOnline) {
        // DO NOT fire confetti for unverified online orders
        dispatch(
          addToast({
            type: 'info',
            title: 'Payment Verification Pending ⏳',
            message: `Order #${finalOrderId} queued. Our team will verify your payment shortly to confirm your order.`,
          })
        );
      } else {
        // Trigger Confetti for COD
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#B85C38', '#B85C38', '#B85C38', '#25201D'],
          });
        } catch (err) {
          // Safe fallback if confetti canvas fails
        }

        dispatch(
          addToast({
            type: 'success',
            title: 'Order Placed Successfully! 🔥',
            message: `Order #${finalOrderId} is confirmed. Estimated time: ${order.estimatedTime}`,
          })
        );
      }

      navigate(`/order-success/${finalOrderId}`);
    } catch (err: any) {
      console.error('Failed to place order', err);
      dispatch(
        addToast({
          type: 'error',
          title: 'Order Failed',
          message: err.message || 'Unable to process order. Please try again.',
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFDFC] pt-32 pb-20 text-[#25201D]">
        <div className="max-w-xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl font-bold font-heading">No Items in Order</h2>
          <p className="text-sm text-[#6F6761]">
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
    <div className="min-h-screen bg-[#FFFDFC] pt-28 pb-20 text-[#25201D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#25201D] flex items-center gap-3">
            <FlameIcon size={32} />
            CHECKOUT & CONFIRMATION
          </h1>
          <p className="text-sm text-[#6F6761] mt-1">
            Complete your details to send your order directly to our flame kitchen.
          </p>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Checkout Form Columns */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Order Type */}
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] space-y-4 shadow-lg">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#E8DED6]">
                <span className="w-6 h-6 rounded-full bg-[#B85C38] text-white font-extrabold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="text-base font-bold font-heading text-[#25201D]">
                  SELECT ORDER TYPE
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    type: 'delivery' as OrderType,
                    title: 'Home Delivery',
                    desc: 'Hot thermal delivery in Peshawar',
                    icon: <Bike className="text-[#B85C38]" size={22} />,
                  },
                  {
                    type: 'pickup' as OrderType,
                    title: 'Self Takeaway',
                    desc: 'Pickup at University Town',
                    icon: <Store className="text-[#B85C38]" size={22} />,
                  },
                  {
                    type: 'dine-in' as OrderType,
                    title: 'Dine-In Order',
                    desc: 'Order ahead for table seating',
                    icon: <Utensils className="text-[#B85C38]" size={22} />,
                  },
                ].map((option) => (
                  <button
                    type="button"
                    key={option.type}
                    onClick={() => dispatch(setOrderType(option.type))}
                    className={`p-4 rounded-xl text-left transition-all border flex flex-col justify-between ${
                      orderType === option.type
                        ? 'bg-[#F7F3EE] border-[#E8DED6] ring-1 ring-[#B85C38] shadow-lg shadow-[#B85C38]/20'
                        : 'bg-[#F7F3EE]/50 border-[#E8DED6] hover:border-[#E8DED6]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      {option.icon}
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          orderType === option.type
                            ? 'bg-[#B85C38] border-[#E8DED6]'
                            : 'border-[#E8DED6]'
                        }`}
                      >
                        {orderType === option.type && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </span>
                    </div>
                    <span className="font-bold text-sm text-[#25201D] block">{option.title}</span>
                    <span className="text-[11px] text-[#6F6761] block mt-0.5">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Customer Contact Information */}
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] space-y-4 shadow-lg">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#E8DED6]">
                <span className="w-6 h-6 rounded-full bg-[#B85C38] text-white font-extrabold text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="text-base font-bold font-heading text-[#25201D]">
                  CUSTOMER INFORMATION
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F6761]" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Asfandyar Khan"
                      className={`w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#F7F3EE] border text-xs text-[#25201D] focus:outline-none ${
                        errors.fullName ? 'border-rose-500' : 'border-[#E8DED6] focus:border-[#E8DED6]'
                      }`}
                    />
                  </div>
                  {errors.fullName && <p className="text-[11px] text-rose-400 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-1.5">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F6761]" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0333-9123456"
                      className={`w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#F7F3EE] border text-xs text-[#25201D] focus:outline-none ${
                        errors.phone ? 'border-rose-500' : 'border-[#E8DED6] focus:border-[#E8DED6]'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] text-rose-400 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={`w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border text-xs text-[#25201D] focus:outline-none ${
                      errors.email ? 'border-rose-500' : 'border-[#E8DED6] focus:border-[#E8DED6]'
                    }`}
                  />
                  {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Step 3: Conditional Details (Delivery vs Pickup vs Dine-in) */}
            {orderType === 'delivery' && (
              <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] space-y-4 shadow-lg">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#E8DED6]">
                  <span className="w-6 h-6 rounded-full bg-[#B85C38] text-white font-extrabold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h3 className="text-base font-bold font-heading text-[#25201D]">
                    DELIVERY LOCATION (PESHAWAR)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-1.5">
                      Delivery Area / Zone *
                    </label>
                    <select
                      value={selectedZone?.id || ''}
                      onChange={(e) => {
                        const zone = deliveryZones.find((z) => z.id === e.target.value);
                        if (zone) setSelectedZone(zone);
                      }}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] focus:outline-none focus:border-[#E8DED6]"
                    >
                      {deliveryZones.map((zone) => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name} (Fee: Rs. {zone.fee}) - {zone.estimatedMinutes}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-1.5">
                      Nearby Landmark
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Near Tatara Park Gate 2 / Opposite Town Club"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] focus:outline-none focus:border-[#E8DED6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-1.5">
                    Complete Street Address *
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House #, Street #, Sector, Colony..."
                    className={`w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border text-xs text-[#25201D] focus:outline-none ${
                      errors.address ? 'border-rose-500' : 'border-[#E8DED6] focus:border-[#E8DED6]'
                    }`}
                  />
                  {errors.address && <p className="text-[11px] text-rose-400 mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-1.5">
                    Rider Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                    placeholder="e.g. Call when entering street, security barrier code..."
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] focus:outline-none focus:border-[#E8DED6]"
                  />
                </div>
              </div>
            )}

            {orderType === 'pickup' && (
              <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] space-y-4 shadow-lg">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#E8DED6]">
                  <span className="w-6 h-6 rounded-full bg-[#B85C38] text-white font-extrabold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h3 className="text-base font-bold font-heading text-[#25201D]">
                    PICKUP DETAILS
                  </h3>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] space-y-2 text-xs">
                  <div className="font-bold text-[#B85C38] flex items-center gap-2">
                    <MapPin size={16} className="text-[#B85C38]" />
                    <span>Restaurant Pickup Counter</span>
                  </div>
                  <p className="text-[#25201D]">
                    Ahmed Khan Restaurant, Bilour Chowk, Rehman Baba Road, Abdara Road, University Town, Peshawar.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-1.5">
                    Preferred Collection Time
                  </label>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] focus:outline-none focus:border-[#E8DED6]"
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
              <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] space-y-4 shadow-lg">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#E8DED6]">
                  <span className="w-6 h-6 rounded-full bg-[#B85C38] text-white font-extrabold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h3 className="text-base font-bold font-heading text-[#25201D]">
                    DINE-IN TABLE SEATING
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-1.5">
                      Number of Guests
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={dineInGuests}
                      onChange={(e) => setDineInGuests(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-1.5">
                      Arrival Time
                    </label>
                    <input
                      type="text"
                      value={dineInTime}
                      onChange={(e) => setDineInTime(e.target.value)}
                      placeholder="e.g. 08:30 PM"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-1.5">
                      Preferred Seating Area
                    </label>
                    <select
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] focus:outline-none"
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
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] space-y-4 shadow-lg">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#E8DED6]">
                <span className="w-6 h-6 rounded-full bg-[#B85C38] text-white font-extrabold text-xs flex items-center justify-center">
                  4
                </span>
                <h3 className="text-base font-bold font-heading text-[#25201D]">
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
                        ? 'bg-[#F7F3EE] border-[#E8DED6] shadow-lg shadow-[#B85C38]/15'
                        : 'bg-[#F7F3EE]/50 border-[#E8DED6]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Banknote className="text-emerald-400" size={24} />
                      <div>
                        <span className="text-xs font-bold text-[#25201D] block">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[11px] text-[#6F6761]">
                          Pay cash to rider upon arrival
                        </span>
                      </div>
                    </div>
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'cash_on_delivery'
                          ? 'bg-[#B85C38] border-[#E8DED6]'
                          : 'border-[#E8DED6]'
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
                        ? 'bg-[#F7F3EE] border-[#E8DED6] shadow-lg shadow-[#B85C38]/15'
                        : 'bg-[#F7F3EE]/50 border-[#E8DED6]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Store className="text-[#B85C38]" size={24} />
                      <div>
                        <span className="text-xs font-bold text-[#25201D] block">
                          Pay at Restaurant Counter
                        </span>
                        <span className="text-[11px] text-[#6F6761]">Cash or Card on pickup</span>
                      </div>
                    </div>
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'cash_on_pickup'
                          ? 'bg-[#B85C38] border-[#E8DED6]'
                          : 'border-[#E8DED6]'
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
                        ? 'bg-[#F7F3EE] border-[#E8DED6] shadow-lg shadow-[#B85C38]/15'
                        : 'bg-[#F7F3EE]/50 border-[#E8DED6]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="text-[#B85C38]" size={24} />
                      <div>
                        <span className="text-xs font-bold text-[#25201D] block">
                          Pay at Dining Table
                        </span>
                        <span className="text-[11px] text-[#6F6761]">Card or Cash at table</span>
                      </div>
                    </div>
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'card_at_counter'
                          ? 'bg-[#B85C38] border-[#E8DED6]'
                          : 'border-[#E8DED6]'
                      }`}
                    >
                      {paymentMethod === 'card_at_counter' && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setPaymentMethod('online')}
                  className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                    paymentMethod === 'online'
                      ? 'bg-[#F7F3EE] border-[#B85C38] shadow-lg shadow-[#B85C38]/15'
                      : 'bg-[#F7F3EE]/50 border-[#E8DED6]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="text-[#B85C38]" size={24} />
                    <div>
                      <span className="text-xs font-bold text-[#25201D] block">
                        Online Payment (Easypaisa / NayaPay)
                      </span>
                      <span className="text-[11px] text-[#6F6761]">Direct transfer & upload screenshot</span>
                    </div>
                  </div>
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'online'
                        ? 'bg-[#B85C38] border-[#B85C38]'
                        : 'border-[#E8DED6]'
                    }`}
                  >
                    {paymentMethod === 'online' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                </button>
              </div>

              {/* Online Payment Detailed Verification Section */}
              {paymentMethod === 'online' && (
                <div className="mt-4 p-5 rounded-2xl bg-[#F7F3EE] border border-[#B85C38]/40 space-y-4">
                  <div className="flex items-start gap-2.5 pb-3 border-b border-[#E8DED6]">
                    <ShieldCheck size={20} className="text-[#B85C38] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#25201D]">
                        Manual Online Payment Verification
                      </h4>
                      <p className="text-[11px] text-[#6F6761] mt-0.5">
                        Please send the exact order total of <strong className="text-[#B85C38]">Rs. {grandTotal.toLocaleString()}</strong> to either account below, then upload your transaction screenshot.
                      </p>
                    </div>
                  </div>

                  {/* Account Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Easypaisa */}
                    <div
                      onClick={() => setPaymentProvider('easypaisa')}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        paymentProvider === 'easypaisa'
                          ? 'bg-[#FFFFFF] border-[#B85C38] shadow-md ring-1 ring-[#B85C38]'
                          : 'bg-[#FFFFFF]/70 border-[#E8DED6] hover:border-[#B85C38]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <span className="text-xs font-bold text-[#25201D]">Easypaisa</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          Active
                        </span>
                      </div>
                      <div className="text-base font-black font-heading text-[#25201D] tracking-wide mb-1">
                        03295664981
                      </div>
                      <div className="text-[11px] text-[#6F6761] mb-2.5">
                        Title: <strong className="text-[#25201D]">Muhammad Ahmed</strong>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyNumber('03295664981');
                        }}
                        className="w-full py-1.5 px-2.5 rounded-lg bg-[#F7F3EE] hover:bg-[#B85C38]/15 border border-[#E8DED6] text-[11px] font-semibold text-[#25201D] flex items-center justify-center gap-1.5 transition-colors"
                      >
                        {copiedNumber === '03295664981' ? (
                          <>
                            <Check size={13} className="text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Number Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} className="text-[#B85C38]" />
                            <span>Copy Easypaisa Number</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* NayaPay */}
                    <div
                      onClick={() => setPaymentProvider('nayapay')}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        paymentProvider === 'nayapay'
                          ? 'bg-[#FFFFFF] border-[#B85C38] shadow-md ring-1 ring-[#B85C38]'
                          : 'bg-[#FFFFFF]/70 border-[#E8DED6] hover:border-[#B85C38]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                          <span className="text-xs font-bold text-[#25201D]">NayaPay</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                          Active
                        </span>
                      </div>
                      <div className="text-base font-black font-heading text-[#25201D] tracking-wide mb-1">
                        03190561694
                      </div>
                      <div className="text-[11px] text-[#6F6761] mb-2.5">
                        Title: <strong className="text-[#25201D]">Muhammad Ahmed</strong>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyNumber('03190561694');
                        }}
                        className="w-full py-1.5 px-2.5 rounded-lg bg-[#F7F3EE] hover:bg-[#B85C38]/15 border border-[#E8DED6] text-[11px] font-semibold text-[#25201D] flex items-center justify-center gap-1.5 transition-colors"
                      >
                        {copiedNumber === '03190561694' ? (
                          <>
                            <Check size={13} className="text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Number Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} className="text-[#B85C38]" />
                            <span>Copy NayaPay Number</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Payment Screenshot Upload Box */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#25201D] mb-1.5">
                      Upload Payment Screenshot <span className="text-[#B85C38]">*</span>
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {!paymentProofPreview ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-6 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all bg-[#FFFFFF] hover:bg-[#F7F3EE] ${
                          errors.paymentScreenshot
                            ? 'border-red-400 bg-red-50/20'
                            : 'border-[#E8DED6] hover:border-[#B85C38]'
                        }`}
                      >
                        <UploadCloud size={28} className="text-[#B85C38] mx-auto mb-2" />
                        <span className="text-xs font-bold text-[#25201D] block">
                          Click to select payment transfer screenshot
                        </span>
                        <span className="text-[11px] text-[#6F6761] mt-0.5 block">
                          PNG, JPG, or WEBP up to 5MB
                        </span>
                        {errors.paymentScreenshot && (
                          <span className="text-xs font-semibold text-red-600 mt-2 block">
                            ⚠️ {errors.paymentScreenshot}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={paymentProofPreview}
                            alt="Payment Proof"
                            className="w-14 h-14 rounded-xl object-cover border border-[#E8DED6]"
                          />
                          <div>
                            <span className="text-xs font-bold text-[#25201D] flex items-center gap-1">
                              <Check size={14} className="text-emerald-600" /> Screenshot Attached
                            </span>
                            <span className="text-[11px] text-[#6F6761] block truncate max-w-[200px]">
                              {paymentProofFile?.name || 'receipt.jpg'} ({(paymentProofFile?.size ? (paymentProofFile.size / 1024).toFixed(0) : '0')} KB)
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveScreenshot}
                          className="p-2 rounded-lg bg-[#F7F3EE] hover:bg-red-50 text-[#6F6761] hover:text-red-600 transition-colors"
                          title="Remove screenshot"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Transaction ID / Ref Optional Field */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#25201D] mb-1">
                      Transaction ID / Reference Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g., TRX-9823412 or 12-digit transaction ID"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8DED6] text-xs text-[#25201D] placeholder-[#6F6761]/60 focus:outline-none focus:border-[#B85C38]"
                    />
                  </div>

                  {/* Process note */}
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                    <strong>Note:</strong> Online payment orders are manually verified by our front desk. Your order will be officially confirmed and sent to the pitmaster grill once your payment proof is verified.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            <div className="p-6 rounded-2xl bg-[#F7F3EE] border border-[#E8DED6] space-y-5 shadow-2xl">
              <h3 className="text-base font-bold font-heading text-[#25201D] pb-3 border-b border-[#E8DED6]">
                FINAL ORDER SUMMARY
              </h3>

              {/* Items Compact Preview */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1 divide-y divide-[#E8DED6]">
                {cartItems.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                    <div className="flex-1 pr-2">
                      <span className="font-semibold text-[#25201D]">
                        {item.quantity}x {item.name}
                      </span>
                      {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                        <div className="text-[10px] text-[#6F6761]">
                          +{item.selectedAddOns.map((a) => a.name).join(', ')}
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-[#B85C38] shrink-0">
                      Rs. {item.itemTotal.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total calculations */}
              <div className="pt-3 border-t border-[#E8DED6] space-y-2 text-xs">
                <div className="flex justify-between text-[#6F6761]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#25201D]">
                    Rs. {subtotal.toLocaleString()}
                  </span>
                </div>

                {orderType === 'delivery' && (
                  <div className="flex justify-between text-[#6F6761]">
                    <span>Delivery Fee ({selectedZone?.name.split('&')[0] || 'Zone'})</span>
                    <span className="font-semibold text-[#25201D]">
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

                <div className="pt-3 border-t border-[#E8DED6] flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#25201D]">TOTAL AMOUNT</span>
                  <span className="text-2xl font-black font-heading text-[#B85C38]">
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
                leftIcon={paymentMethod === 'online' ? <ShieldCheck size={18} /> : <FlameIcon size={18} glow={false} />}
              >
                {paymentMethod === 'online' ? 'SUBMIT PAYMENT PROOF & ORDER' : '🔥 PLACE ORDER NOW'}
              </Button>

              <p className="text-[11px] text-[#6F6761] text-center pt-2">
                By placing this order, you confirm acceptance of Ahmed Khan Restaurant fresh flame preparation terms.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
