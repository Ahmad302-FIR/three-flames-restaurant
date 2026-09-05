import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { DeliveryZone } from '../../types';
import { Button } from '../../components/common/Button';
import { FlameIcon } from '../../components/common/FlameIcon';
import { useAppDispatch } from '../../store/store';
import { addToast } from '../../store/slices/uiSlice';
import { MapPin, Plus, Edit2, Check, X, Trash2 } from 'lucide-react';

export const AdminDeliveryZonesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [fee, setFee] = useState(150);
  const [minOrder, setMinOrder] = useState(1000);
  const [estimatedMinutes, setEstimatedMinutes] = useState('30-40 mins');

  const fetchZones = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDeliveryZones();
      setZones(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleToggleZone = async (zone: DeliveryZone) => {
    try {
      const updatedZones = zones.map((z) =>
        z.id === zone.id ? { ...z, active: !z.active } : z
      );
      await adminService.saveDeliveryZones(updatedZones);
      setZones(updatedZones);
      const newStatus = !zone.active;
      dispatch(
        addToast({
          type: newStatus ? 'success' : 'info',
          title: 'Delivery Zone Updated',
          message: `${zone.name} is now ${newStatus ? 'Active' : 'Disabled'}.`,
        })
      );
    } catch (e) {}
  };

  const handleDeleteZone = async (zone: DeliveryZone) => {
    if (!window.confirm(`Are you sure you want to remove delivery sector "${zone.name}"?`)) return;
    try {
      const zoneId = (zone as any)._id || zone.id;
      await adminService.deleteDeliveryZone(zoneId);
      setZones((prev) => prev.filter((z) => z.id !== zone.id && (z as any)._id !== zoneId));
      dispatch(
        addToast({
          type: 'info',
          title: 'Zone Deleted',
          message: `${zone.name} removed from delivery logistics.`,
        })
      );
    } catch (e: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Delete Failed',
          message: e.message || 'Could not delete zone.',
        })
      );
    }
  };

  const handleCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newZone: DeliveryZone = {
      id: `dz-${Date.now()}`,
      name,
      fee,
      minOrder,
      estimatedMinutes,
      active: true,
    };

    const updated = [...zones, newZone];
    await adminService.saveDeliveryZones(updated);
    setZones(updated);
    dispatch(
      addToast({
        type: 'success',
        title: 'Zone Added',
        message: `${name} has been added to Peshawar delivery network.`,
      })
    );
    setIsAddModalOpen(false);
    setName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white flex items-center gap-2">
            <MapPin size={24} className="text-[#FF8A1F]" />
            Peshawar Delivery Zones & Logistics
          </h1>
          <p className="text-xs text-[#B8AAA0] mt-1">
            Configure rider delivery fees, minimum order thresholds, and estimated thermal transit times.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus size={16} />}
        >
          Add Delivery Sector
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className={`p-6 rounded-2xl bg-[#120B08] border transition-all ${
              zone.active ? 'border-[#FF8A1F]/30 shadow-lg' : 'border-white/5 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 flex items-center justify-center text-[#FF8A1F]">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-bold font-heading text-white text-base">{zone.name}</h3>
                  <span className="text-[10px] text-[#B8AAA0]">Est: {zone.estimatedMinutes}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleZone(zone)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                    zone.active
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {zone.active ? 'Active' : 'Paused'}
                </button>
                <button
                  onClick={() => handleDeleteZone(zone)}
                  className="p-1 rounded-lg bg-rose-950/40 text-rose-400 border border-rose-500/20 hover:bg-rose-900/50"
                  title="Delete Sector"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[#B8AAA0] block text-[10px] uppercase font-semibold">
                  Delivery Fee
                </span>
                <span className="text-base font-extrabold text-[#FF8A1F]">
                  Rs. {zone.fee}
                </span>
              </div>
              <div>
                <span className="text-[#B8AAA0] block text-[10px] uppercase font-semibold">
                  Min Order
                </span>
                <span className="text-base font-extrabold text-white">
                  Rs. {zone.minOrder.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full rounded-3xl bg-[#120B08] border border-[#FF8A1F]/40 p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#FF8A1F]/20">
              <h3 className="text-base font-bold font-heading text-white">Add Delivery Sector</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded bg-[#1A100C] text-[#B8AAA0]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateZone} className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase text-[#B8AAA0] block mb-1">Sector Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ring Road & Gulbahar"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-[#B8AAA0] block mb-1">Fee (PKR) *</label>
                  <input
                    type="number"
                    value={fee}
                    onChange={(e) => setFee(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase text-[#B8AAA0] block mb-1">Min Order (PKR)</label>
                  <input
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold uppercase text-[#B8AAA0] block mb-1">Est. Minutes</label>
                <input
                  type="text"
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(e.target.value)}
                  placeholder="35-45 mins"
                  className="w-full px-3 py-2 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Zone
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
