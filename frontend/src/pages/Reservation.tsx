import React, { useState } from 'react';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';
import { FlameIcon } from '../components/common/FlameIcon';
import { reservationService } from '../services/reservationService';
import { useAppDispatch, useAppSelector } from '../store/store';
import { addToast } from '../store/slices/uiSlice';
import { restaurantInfo } from '../../src/data/restaurantData';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  Users,
  Sparkles,
  Phone,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  RefreshCw,
  PartyPopper,
  ShieldAlert,
} from 'lucide-react';

export const ReservationPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);

  const [guestCount, setGuestCount] = useState(4);
  const [date, setDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('08:30 PM');
  const [seatingArea, setSeatingArea] = useState<'rooftop' | 'dastarkhwan' | 'family_hall' | 'outdoor' | 'any'>('rooftop');
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [occasion, setOccasion] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeReservation, setActiveReservation] = useState<any>(null);
  const [lookupRef, setLookupRef] = useState('');
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const timeSlots = [
    '06:00 PM',
    '06:30 PM',
    '07:00 PM',
    '07:30 PM',
    '08:00 PM',
    '08:30 PM',
    '09:00 PM',
    '09:30 PM',
    '10:00 PM',
    '10:30 PM',
    '11:00 PM',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !phone || !email || !date || !timeSlot) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Missing Details',
          message: 'Please fill in all required fields (name, phone, email, date, and time).',
        })
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await reservationService.createReservation({
        fullName,
        phone,
        email,
        guests: guestCount,
        date,
        time: timeSlot,
        seatingArea,
        specialRequest: occasion ? `${occasion} - ${specialRequests}` : specialRequests,
      });

      setActiveReservation(res);

      dispatch(
        addToast({
          type: 'info',
          title: 'Reservation Request Received! 🎉',
          message: `Your table reservation request #${res.id || (res as any).reservationNumber} has been received. Our team will contact you on your provided phone number to confirm availability. Please note: Your table is NOT confirmed yet.`,
        })
      );
    } catch (err: any) {
      console.error(err);
      dispatch(
        addToast({
          type: 'error',
          title: 'Request Failed',
          message: err?.response?.data?.message || err?.message || 'Could not submit reservation request. Please try again.',
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackReservation = async (refNumber?: string) => {
    const target = (refNumber || lookupRef).trim();
    if (!target) {
      dispatch(
        addToast({
          type: 'warning',
          title: 'Reference Number Required',
          message: 'Please enter your Reservation ID (e.g. RES-805).',
        })
      );
      return;
    }

    setIsCheckingStatus(true);
    try {
      const res = await reservationService.trackReservation(target);
      setActiveReservation(res);
      dispatch(
        addToast({
          type: 'success',
          title: 'Reservation Found',
          message: `Booking #${res.id || (res as any).reservationNumber} status is ${res.status?.toUpperCase()}.`,
        })
      );

      if (res.status === 'confirmed') {
        try {
          confetti({
            particleCount: 60,
            spread: 55,
            origin: { y: 0.6 },
            colors: ['#10B981', '#B85C38', '#D99A32'],
          });
        } catch (e) {}
      }
    } catch (err: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Reservation Not Found',
          message:
            err?.response?.data?.message ||
            err?.message ||
            `No reservation found with reference #${target}. Please check the number and try again.`,
        })
      );
    } finally {
      setIsCheckingStatus(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDFC] pt-28 pb-20 text-[#25201D]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="AUTHENTIC CHARCOAL DINING"
          title="RESERVE YOUR TABLE"
          subtitle="Experience the live flame ambiance, open-air rooftop heaters, and traditional Peshawari Dastarkhwan."
          className="mb-10"
        />

        {activeReservation ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] text-center space-y-6 max-w-2xl mx-auto shadow-2xl">
            {/* Status-specific Hero Icon and Title */}
            {activeReservation.status === 'confirmed' ? (
              <>
                <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                  <PartyPopper size={32} />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-emerald-100 text-emerald-800 border border-emerald-300 mb-2">
                    Confirmed Booking
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#25201D]">
                    Table Reserved! 🎉
                  </h2>
                  <p className="text-xs text-[#6F6761] mt-1">
                    Booking #{activeReservation.id || activeReservation.reservationNumber} confirmed for{' '}
                    {activeReservation.guests || activeReservation.guestCount} guests on {activeReservation.date} at{' '}
                    {activeReservation.time}.
                  </p>
                </div>
              </>
            ) : activeReservation.status === 'rejected' ? (
              <>
                <div className="w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center mx-auto text-rose-600">
                  <XCircle size={32} />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-rose-100 text-rose-800 border border-rose-300 mb-2">
                    Request Declined
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#25201D]">
                    Reservation Unavailable
                  </h2>
                  <p className="text-xs text-[#6F6761] mt-1">
                    Unfortunately, we are unable to accommodate your reservation request for this time slot.
                  </p>
                </div>
              </>
            ) : activeReservation.status === 'cancelled' ? (
              <>
                <div className="w-16 h-16 rounded-full bg-zinc-100 border-2 border-zinc-300 flex items-center justify-center mx-auto text-zinc-600">
                  <XCircle size={32} />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-zinc-200 text-zinc-800 border border-zinc-300 mb-2">
                    Cancelled
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#25201D]">
                    Reservation Cancelled
                  </h2>
                  <p className="text-xs text-[#6F6761] mt-1">
                    This reservation request has been cancelled.
                  </p>
                </div>
              </>
            ) : (
              /* Default: PENDING */
              <>
                <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mx-auto text-amber-600 animate-pulse">
                  <Clock size={32} />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-amber-100 text-amber-900 border border-amber-300 mb-2">
                    Pending Review
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#25201D]">
                    Reservation Request Received! 🎉
                  </h2>
                  <p className="text-xs text-[#6F6761] mt-1">
                    Your table reservation request #{activeReservation.id || activeReservation.reservationNumber} has been received.
                  </p>
                </div>

                {/* Important Notice Alert for Pending */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-left flex items-start gap-3">
                  <ShieldAlert className="text-amber-700 shrink-0 mt-0.5" size={20} />
                  <div className="text-xs text-amber-950 space-y-1">
                    <p className="font-bold text-amber-900">
                      IMPORTANT: Your table is NOT confirmed yet.
                    </p>
                    <p className="text-amber-900/90 leading-relaxed">
                      Our team will contact you on your provided phone number (
                      <strong className="underline">{activeReservation.phone}</strong>) to confirm availability and finalize your reservation.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Reservation Summary Details */}
            <div className="p-5 rounded-2xl bg-[#F7F3EE] border border-[#E8DED6] text-left text-xs space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[#6F6761]">Booking Reference:</span>
                <span className="font-bold text-[#B85C38] text-sm">
                  #{activeReservation.id || activeReservation.reservationNumber}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6F6761]">Primary Guest:</span>
                <span className="font-bold text-[#25201D]">
                  {activeReservation.fullName || activeReservation.guestName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6F6761]">Contact Number:</span>
                <span className="font-bold text-[#25201D]">{activeReservation.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6F6761]">Party Size:</span>
                <span className="font-bold text-[#25201D]">
                  {activeReservation.guests || activeReservation.guestCount} Guests
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6F6761]">Date & Time:</span>
                <span className="font-bold text-[#B85C38]">
                  {activeReservation.date} at {activeReservation.time}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6F6761]">Seating Zone:</span>
                <span className="font-bold text-[#25201D] uppercase">{activeReservation.seatingArea}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#E8DED6]">
                <span className="text-[#6F6761]">Current Status:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
                    activeReservation.status === 'confirmed'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : activeReservation.status === 'rejected'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : activeReservation.status === 'cancelled'
                      ? 'bg-zinc-200 text-zinc-800 border border-zinc-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  {activeReservation.status || 'PENDING'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() =>
                  handleTrackReservation(activeReservation.id || activeReservation.reservationNumber)
                }
                isLoading={isCheckingStatus}
                leftIcon={<RefreshCw size={16} />}
              >
                Refresh Live Status
              </Button>

              <Button
                variant="primary"
                onClick={() => {
                  setActiveReservation(null);
                  setLookupRef('');
                }}
              >
                {activeReservation.status === 'confirmed'
                  ? 'Book Another Reservation'
                  : 'Submit New Request'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-8 p-6 sm:p-10 rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] space-y-6 shadow-2xl"
            >
              <h3 className="text-lg font-bold font-heading text-[#25201D] flex items-center gap-2 pb-4 border-b border-[#E8DED6]">
                <FlameIcon size={20} />
                Reservation Specifications
              </h3>

              {/* Guest Count */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-2">
                  Number of Guests
                </label>
                <div className="flex flex-wrap gap-2">
                  {[2, 4, 6, 8, 10, 12, 15, 20].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setGuestCount(num)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        guestCount === num
                          ? 'bg-[#B85C38] text-white shadow-lg shadow-[#B85C38]/20 scale-105'
                          : 'bg-[#F7F3EE] text-[#6F6761] border border-[#E8DED6] hover:border-[#E8DED6]'
                      }`}
                    >
                      {num} {num === 2 ? 'Guests' : 'People'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-1.5">
                    Reservation Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] focus:outline-none focus:border-[#B85C38]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-1.5">
                    Preferred Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] focus:outline-none focus:border-[#B85C38]"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Seating Area Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-2">
                  Preferred Seating Atmosphere
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'rooftop', name: 'Rooftop Flame Terrace', desc: 'Open sky, ambient charcoal braziers' },
                    { id: 'dastarkhwan', name: 'Traditional Dastarkhwan', desc: 'Peshawari carpet seating & silk bolsters' },
                    { id: 'family_hall', name: 'Family Dining Hall', desc: 'Private enclosed family atmosphere' },
                    { id: 'any', name: 'Any Available First Class', desc: 'Chef allocates best available table' },
                  ].map((area) => (
                    <button
                      type="button"
                      key={area.id}
                      onClick={() => setSeatingArea(area.id as any)}
                      className={`p-3.5 rounded-xl text-left border transition-all ${
                        seatingArea === area.id
                          ? 'bg-[#F7F3EE] border-[#B85C38] ring-1 ring-[#B85C38] shadow-lg shadow-[#B85C38]/10'
                          : 'bg-[#F7F3EE]/40 border-[#E8DED6] hover:border-[#E8DED6]'
                      }`}
                    >
                      <span className="text-xs font-bold text-[#25201D] block">{area.name}</span>
                      <span className="text-[11px] text-[#6F6761] block mt-0.5">{area.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Taimoor Khan"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] placeholder-[#6F6761]/60 focus:outline-none focus:border-[#B85C38]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-1.5">
                    Phone Number (for confirmation call) *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0300-5544332"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] placeholder-[#6F6761]/60 focus:outline-none focus:border-[#B85C38]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. customer@example.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] placeholder-[#6F6761]/60 focus:outline-none focus:border-[#B85C38]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-1.5">
                    Occasion
                  </label>
                  <input
                    type="text"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    placeholder="e.g. Birthday, Anniversary"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] placeholder-[#6F6761]/60 focus:outline-none focus:border-[#B85C38]"
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-1.5">
                  Special Dining Request (Optional)
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. High chair needed, cake arrangement, quiet corner..."
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] placeholder-[#6F6761]/60 focus:outline-none focus:border-[#B85C38]"
                />
              </div>

              {/* Submit CTA */}
              <div className="space-y-2 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isSubmitting}
                  leftIcon={<Calendar size={18} />}
                >
                  REQUEST TABLE RESERVATION
                </Button>
                <p className="text-[11px] text-[#6F6761] text-center">
                  Reservations are reviewed first. Our reservation desk will call your phone number to confirm availability.
                </p>
              </div>
            </form>

            {/* Right Information Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Lookup Card */}
              <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] space-y-3.5 shadow-xl">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#B85C38] flex items-center gap-2">
                  <Search size={16} />
                  Track Existing Request
                </h4>
                <p className="text-xs text-[#6F6761] leading-relaxed">
                  Already submitted a request? Enter your Booking Reference (e.g. RES-805) to check your live confirmation status.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. RES-805"
                    value={lookupRef}
                    onChange={(e) => setLookupRef(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleTrackReservation();
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] uppercase font-bold placeholder-[#6F6761]/60 focus:outline-none focus:border-[#B85C38]"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleTrackReservation()}
                    isLoading={isCheckingStatus}
                  >
                    Check
                  </Button>
                </div>
              </div>

              {/* Policy Card */}
              <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] space-y-4 shadow-xl">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#B85C38] flex items-center gap-2">
                  <Sparkles size={16} />
                  Table Booking Policy
                </h4>
                <ul className="text-xs space-y-2.5 text-[#6F6761] leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>All table requests are verified by phone before confirmation.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>Confirmed tables are held for 15 minutes past the scheduled time.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>Traditional Dastarkhwan areas are ideal for groups of 4+.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>No advance booking deposit required for standard tables.</span>
                  </li>
                </ul>
              </div>

              {/* Direct Reservations Line */}
              <div className="p-6 rounded-3xl bg-[#F7F3EE] border border-[#E8DED6] space-y-3">
                <h4 className="text-sm font-bold text-[#25201D] flex items-center gap-2">
                  <Phone size={16} className="text-[#B85C38]" />
                  Direct Reservations Line
                </h4>
                <p className="text-xs text-[#6F6761]">
                  For large banquets (20+ guests) or urgent arrangements, please call our desk directly:
                </p>
                <a
                  href={restaurantInfo.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-extrabold text-[#B85C38] block hover:underline"
                  title="Chat on WhatsApp"
                >
                  {restaurantInfo.phone}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
