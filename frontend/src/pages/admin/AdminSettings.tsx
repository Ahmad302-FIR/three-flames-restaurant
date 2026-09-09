import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Button } from '../../components/common/Button';
import { useAppDispatch } from '../../store/store';
import { addToast } from '../../store/slices/uiSlice';
import { Store, Phone, MapPin, Clock, Save, ShieldCheck } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [restaurantName, setRestaurantName] = useState('Ahmed Khan Restaurant');
  const [tagline, setTagline] = useState('WHERE TASTE MEETS FLAME');
  const [phone, setPhone] = useState('03295664981');
  const [whatsapp, setWhatsapp] = useState('923295664981');
  const [email, setEmail] = useState('info.ahmadkhan.com@gmail.com');
  const [streetAddress, setStreetAddress] = useState('Bilour Chowk, Rehman Baba Road, Abdara Road');
  const [city, setCity] = useState('University Town, Peshawar, Pakistan');
  const [weekdaysHours, setWeekdaysHours] = useState('12:00 PM – 01:00 AM');
  const [weekendsHours, setWeekendsHours] = useState('12:00 PM – 02:00 AM');
  const [minOrder, setMinOrder] = useState(800);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(5000);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await adminService.getSettings();
      if (data) {
        setRestaurantName(data.restaurantName || 'Ahmed Khan Restaurant');
        setTagline(data.tagline || 'WHERE TASTE MEETS FLAME');
        setPhone(data.phone || '03295664981');
        setWhatsapp(data.whatsapp || '923295664981');
        setEmail(data.email || 'info.ahmadkhan.com@gmail.com');
        if (data.address) {
          setStreetAddress(data.address.street || '');
          setCity(data.address.city || 'Peshawar, Pakistan');
        }
        if (data.openingHours) {
          setWeekdaysHours(data.openingHours.weekdays || '12:00 PM – 01:00 AM');
          setWeekendsHours(data.openingHours.weekends || '12:00 PM – 02:00 AM');
        }
        if (data.deliverySettings) {
          setMinOrder(data.deliverySettings.minOrder || 800);
          setFreeDeliveryThreshold(data.deliverySettings.freeDeliveryThreshold || 5000);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminService.updateSettings({
        restaurantName,
        tagline,
        phone,
        whatsapp,
        email,
        address: {
          street: streetAddress,
          city,
          fullAddress: `${streetAddress}, ${city}`
        },
        openingHours: {
          weekdays: weekdaysHours,
          weekends: weekendsHours
        },
        deliverySettings: {
          minOrder,
          freeDeliveryThreshold
        }
      });
      dispatch(
        addToast({
          type: 'success',
          title: 'Settings Saved',
          message: 'Restaurant configuration updated in MongoDB.',
        })
      );
    } catch (err: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Save Failed',
          message: err.message || 'Could not save restaurant settings.',
        })
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-[#6F6761]">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#25201D] flex items-center gap-2">
          <Store size={24} className="text-[#B85C38]" />
          Restaurant Master Configuration
        </h1>
        <p className="text-xs text-[#6F6761] mt-1">
          Manage brand identity, contact numbers, Peshawar branch address, operating hours, and delivery minimums.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Information */}
        <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] space-y-4 shadow-xl">
          <h3 className="font-bold font-heading text-[#25201D] text-sm flex items-center gap-2 border-b border-[#E8DED6] pb-3">
            <ShieldCheck size={16} className="text-[#B85C38]" />
            Brand & Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold uppercase text-[#6F6761] block mb-1">Restaurant Name</label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold uppercase text-[#6F6761] block mb-1">Signature Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contact & Branch Location */}
        <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] space-y-4 shadow-xl">
          <h3 className="font-bold font-heading text-[#25201D] text-sm flex items-center gap-2 border-b border-[#E8DED6] pb-3">
            <MapPin size={16} className="text-[#B85C38]" />
            Location & Contact Desk
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold uppercase text-[#6F6761] block mb-1">Order Hotline</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold uppercase text-[#6F6761] block mb-1">WhatsApp Dispatch</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold uppercase text-[#6F6761] block mb-1">Official Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="font-bold uppercase text-[#6F6761] block mb-1">Street Address</label>
              <input
                type="text"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold uppercase text-[#6F6761] block mb-1">City / Region</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours & Ordering Rules */}
        <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] space-y-4 shadow-xl">
          <h3 className="font-bold font-heading text-[#25201D] text-sm flex items-center gap-2 border-b border-[#E8DED6] pb-3">
            <Clock size={16} className="text-emerald-400" />
            Operating Hours & Thresholds
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold uppercase text-[#6F6761] block mb-1">Weekdays (Mon - Thu)</label>
              <input
                type="text"
                value={weekdaysHours}
                onChange={(e) => setWeekdaysHours(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold uppercase text-[#6F6761] block mb-1">Weekends (Fri - Sun)</label>
              <input
                type="text"
                value={weekendsHours}
                onChange={(e) => setWeekendsHours(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold uppercase text-[#6F6761] block mb-1">Minimum Order (PKR)</label>
              <input
                type="number"
                value={minOrder}
                onChange={(e) => setMinOrder(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold uppercase text-[#6F6761] block mb-1">Free Delivery Threshold (PKR)</label>
              <input
                type="number"
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="primary" size="md" type="submit" disabled={saving} leftIcon={<Save size={16} />}>
            {saving ? 'Persisting to Database...' : 'Save All Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};
