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
  MapPin,
  Sparkles,
  Phone,
  CheckCircle2,
  Utensils,
  PartyPopper,
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
  const [fullName, setFullName] = useState(currentUser?.name || 'Taimoor Khan');
  const [phone, setPhone] = useState(currentUser?.phone || '0300-5544332');
  const [email, setEmail] = useState(currentUser?.email || 'taimoor@example.com');
  const [occasion, setOccasion] = useState('Family Gathering');
  const [specialRequests, setSpecialRequests] = useState('Charcoal braziers nearby please');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<any>(null);

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

    if (!fullName || !phone || !date || !timeSlot) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Missing Details',
          message: 'Please fill in all required fields to book a table.',
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
        specialRequest: specialRequests,
      });

      setConfirmedReservation(res);

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#B85C38', '#B85C38', '#B85C38'],
        });
      } catch (e) {}

      dispatch(
        addToast({
          type: 'success',
          title: 'Table Reserved! 🎉',
          message: `Booking #${res.id} confirmed for ${guestCount} guests on ${date} at ${timeSlot}.`,
        })
      );
    } catch (err) {
      console.error(err);
      dispatch(
        addToast({
          type: 'error',
          title: 'Reservation Failed',
          message: 'Could not complete reservation. Please try again.',
        })
      );
    } finally {
      setIsSubmitting(false);
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

        {confirmedReservation ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] text-center space-y-6 max-w-2xl mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#F7F3EE] border-2 border-[#E8DED6] flex items-center justify-center mx-auto text-[#B85C38]">
              <PartyPopper size={32} />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#25201D]">
              Table Reservation Confirmed!
            </h2>

            <div className="p-5 rounded-2xl bg-[#F7F3EE] border border-[#E8DED6] text-left text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-[#6F6761]">Booking Reference:</span>
                <span className="font-bold text-[#B85C38]">#{confirmedReservation.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6F6761]">Primary Guest:</span>
                <span className="font-bold text-[#25201D]">{confirmedReservation.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6F6761]">Party Size:</span>
                <span className="font-bold text-[#25201D]">{confirmedReservation.guestCount} Guests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6F6761]">Date & Time:</span>
                <span className="font-bold text-[#B85C38]">
                  {confirmedReservation.date} at {confirmedReservation.time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6F6761]">Seating Zone:</span>
                <span className="font-bold text-[#25201D] uppercase">{confirmedReservation.seatingArea}</span>
              </div>
            </div>

            <p className="text-xs text-[#6F6761] max-w-md mx-auto">
              We look forward to welcoming you at Ahmed Khan Restaurant, University Town, Peshawar. An SMS confirmation has been scheduled.
            </p>

            <Button
              variant="primary"
              onClick={() => setConfirmedReservation(null)}
            >
              Book Another Reservation
            </Button>
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
                          ? 'bg-[#B85C38] text-black shadow-lg shadow-[#B85C38]/20 scale-105'
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
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] focus:outline-none focus:border-[#E8DED6]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-1.5">
                    Preferred Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] focus:outline-none focus:border-[#E8DED6]"
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
                          ? 'bg-[#F7F3EE] border-[#E8DED6] ring-1 ring-[#B85C38] shadow-lg shadow-[#B85C38]/10'
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] focus:outline-none focus:border-[#B85C38]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] focus:outline-none focus:border-[#B85C38]"
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
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                leftIcon={<Calendar size={18} />}
              >
                CONFIRM TABLE RESERVATION
              </Button>
            </form>

            {/* Right Information Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#B85C38] flex items-center gap-2">
                  <Sparkles size={16} />
                  Table Booking Policy
                </h4>
                <ul className="text-xs space-y-2.5 text-[#6F6761] leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Tables are reserved for 15 minutes past scheduled time.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Traditional Dastarkhwan areas are ideal for groups of 4+.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>No advance booking deposit required for standard tables.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-3xl bg-[#F7F3EE] border border-[#E8DED6] space-y-3">
                <h4 className="text-sm font-bold text-[#25201D] flex items-center gap-2">
                  <Phone size={16} className="text-[#B85C38]" />
                  Direct Reservations Line
                </h4>
                <p className="text-xs text-[#6F6761]">
                  For large banquets (20+ guests) or custom catering arrangements, please call:
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
