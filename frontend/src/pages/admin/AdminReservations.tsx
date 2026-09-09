import React, { useState, useEffect } from 'react';
import { reservationService } from '../../services/reservationService';
import { Reservation, ReservationStatus } from '../../types';
import { Button } from '../../components/common/Button';
import { FlameIcon } from '../../components/common/FlameIcon';
import { useAppDispatch } from '../../store/store';
import { addToast } from '../../store/slices/uiSlice';
import { Calendar, Users, Clock, CheckCircle2, XCircle, Search, Phone } from 'lucide-react';

export const AdminReservationsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const data = await reservationService.getReservations();
      setReservations(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleUpdateStatus = async (id: string, status: ReservationStatus) => {
    try {
      const updated = await reservationService.updateReservationStatus(id, status);
      setReservations((prev) => prev.map((r) => (r.id === id ? updated : r)));
      dispatch(
        addToast({
          type: 'success',
          title: 'Reservation Updated',
          message: `Booking #${id} is now marked as ${status}.`,
        })
      );
    } catch (e) {}
  };

  const filtered = reservations.filter((res) => {
    if (selectedStatus !== 'all' && res.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        res.fullName.toLowerCase().includes(q) ||
        res.phone.toLowerCase().includes(q) ||
        res.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#25201D] flex items-center gap-2">
            <Calendar size={24} className="text-[#B85C38]" />
            Table Reservations Desk
          </h1>
          <p className="text-xs text-[#6F6761] mt-1">
            Manage rooftop braziers, family dining halls, and traditional Peshawari Dastarkhwan tables.
          </p>
        </div>

        <Button variant="secondary" size="sm" onClick={fetchReservations} isLoading={loading}>
          Refresh Bookings
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                selectedStatus === st
                  ? 'bg-[#B85C38] text-black shadow-md'
                  : 'bg-[#F7F3EE] text-[#6F6761] hover:text-[#25201D] border border-[#E8DED6]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F6761]" />
          <input
            type="text"
            placeholder="Search guest or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-white placeholder-[#6F6761]/60 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F3EE] text-[#6F6761] font-bold uppercase tracking-wider text-[11px] border-b border-[#E8DED6]">
              <tr>
                <th className="p-4">Ref #</th>
                <th className="p-4">Guest Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Date & Slot</th>
                <th className="p-4">Party Size</th>
                <th className="p-4">Seating Area</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((res) => (
                <tr key={res.id} className="hover:bg-[#F7F3EE]/60 transition-colors">
                  <td className="p-4 font-bold text-[#B85C38]">#{res.id}</td>
                  <td className="p-4 font-semibold text-[#25201D]">
                    {res.fullName}
                    {res.specialRequest && (
                      <span className="text-[10px] text-[#B85C38] block">
                        Note: {res.specialRequest}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-[#6F6761]">{res.phone}</td>
                  <td className="p-4">
                    <span className="font-bold text-[#25201D] block">{res.date}</span>
                    <span className="text-[10px] text-[#B85C38]">{res.time}</span>
                  </td>
                  <td className="p-4 font-bold text-[#25201D]">{res.guests} Guests</td>
                  <td className="p-4 uppercase text-[#B85C38] font-semibold">{res.seatingArea}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        res.status === 'confirmed'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                          : res.status === 'completed'
                          ? 'bg-blue-950/80 text-blue-300 border border-blue-500/30'
                          : res.status === 'pending'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {res.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {res.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(res.id, 'confirmed')}
                          className="px-2.5 py-1 rounded bg-[#F7F3EE] text-emerald-400 hover:bg-emerald-950 border border-emerald-500/30 text-[11px] font-bold"
                        >
                          Confirm
                        </button>
                      )}
                      {res.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(res.id, 'completed')}
                          className="px-2.5 py-1 rounded bg-[#F7F3EE] text-blue-400 hover:bg-blue-950 border border-blue-500/30 text-[11px] font-bold"
                        >
                          Complete
                        </button>
                      )}
                      {res.status !== 'cancelled' && (
                        <button
                          onClick={() => handleUpdateStatus(res.id, 'cancelled')}
                          className="px-2.5 py-1 rounded bg-[#F7F3EE] text-rose-400 hover:bg-rose-950 border border-rose-500/30 text-[11px] font-bold"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
