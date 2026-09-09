import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Offer } from '../../types';
import { Button } from '../../components/common/Button';
import { FlameIcon } from '../../components/common/FlameIcon';
import { useAppDispatch } from '../../store/store';
import { addToast } from '../../store/slices/uiSlice';
import { Tag, Plus, Check, X, Calendar, Percent, Banknote, Trash2 } from 'lucide-react';

export const AdminOffersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form Fields
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(15);
  const [minOrder, setMinOrder] = useState(2000);
  const [maxDiscount, setMaxDiscount] = useState<number | undefined>(600);
  const [expiresAt, setExpiresAt] = useState('2026-12-31');

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getOffers();
      setOffers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleToggleOffer = async (offer: Offer) => {
    try {
      const updatedOffers = offers.map((o) =>
        o.id === offer.id ? { ...o, isActive: !o.isActive } : o
      );
      await adminService.saveOffers(updatedOffers);
      setOffers(updatedOffers);
      const newStatus = !offer.isActive;
      dispatch(
        addToast({
          type: newStatus ? 'success' : 'info',
          title: 'Coupon Updated',
          message: `Voucher ${offer.code} is now ${newStatus ? 'Active' : 'Disabled'}.`,
        })
      );
    } catch (e) {}
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || discountValue <= 0) return;

    try {
      const newOffer: Offer = {
        id: `off-${Date.now()}`,
        code: code.toUpperCase().trim(),
        title,
        description,
        discountType,
        discountValue,
        minOrder,
        maxDiscount,
        expiresAt,
        isActive: true,
      };

      try {
        const created = await adminService.createOffer(newOffer);
        setOffers((prev) => [created, ...prev]);
      } catch {
        const updated = [newOffer, ...offers];
        await adminService.saveOffers(updated);
        setOffers(updated);
      }

      dispatch(
        addToast({
          type: 'success',
          title: 'Coupon Created',
          message: `Promo code ${newOffer.code} is now ready for customers.`,
        })
      );
      setIsAddModalOpen(false);
      setCode('');
      setTitle('');
    } catch (e: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Creation Failed',
          message: e.message || 'Could not create coupon.',
        })
      );
    }
  };

  const handleDeleteOffer = async (offer: Offer) => {
    if (!window.confirm(`Are you sure you want to delete promo coupon "${offer.code}"?`)) return;
    try {
      const offerId = (offer as any)._id || offer.id;
      await adminService.deleteOffer(offerId);
      setOffers((prev) => prev.filter((o) => o.id !== offer.id && (o as any)._id !== offerId));
      dispatch(
        addToast({
          type: 'info',
          title: 'Coupon Deleted',
          message: `Promo code ${offer.code} has been deleted.`,
        })
      );
    } catch (e: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Delete Failed',
          message: e.message || 'Could not delete coupon.',
        })
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#25201D] flex items-center gap-2">
            <Tag size={24} className="text-[#B85C38]" />
            Promotional Coupons & Voucher Desk
          </h1>
          <p className="text-xs text-[#6F6761] mt-1">
            Create discount promo codes, percentage vouchers, and minimum order rules.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus size={16} />}
        >
          Create Voucher
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className={`p-6 rounded-2xl bg-[#FFFFFF] border transition-all ${
              offer.isActive ? 'border-[#E8DED6] shadow-lg' : 'border-[#E8DED6] opacity-60'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-lg font-black font-heading text-[#B85C38] uppercase tracking-wider block">
                  {offer.code}
                </span>
                <h4 className="text-xs font-bold text-[#25201D] mt-0.5">{offer.title}</h4>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleOffer(offer)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                    offer.isActive
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {offer.isActive ? 'Active' : 'Disabled'}
                </button>
                <button
                  onClick={() => handleDeleteOffer(offer)}
                  className="p-1 rounded-lg bg-rose-950/40 text-rose-400 border border-rose-500/20 hover:bg-rose-900/50"
                  title="Delete Coupon"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <p className="text-xs text-[#6F6761] mb-4">{offer.description}</p>

            <div className="pt-3 border-t border-[#E8DED6] grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[#6F6761] block text-[10px] uppercase font-semibold">
                  Discount
                </span>
                <span className="text-sm font-bold text-[#25201D]">
                  {offer.discountType === 'percentage'
                    ? `${offer.discountValue}% OFF`
                    : `Rs. ${offer.discountValue} OFF`}
                </span>
              </div>
              <div>
                <span className="text-[#6F6761] block text-[10px] uppercase font-semibold">
                  Min Order
                </span>
                <span className="text-sm font-bold text-[#B85C38]">
                  Rs. {offer.minOrder.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DED6]">
              <h3 className="text-base font-bold font-heading text-[#25201D]">Create Promo Voucher</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded bg-[#F7F3EE] text-[#6F6761]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase text-[#6F6761] block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. FESTIVE20"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-white uppercase font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold uppercase text-[#6F6761] block mb-1">Campaign Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 20% Off Weekend BBQ"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-[#6F6761] block mb-1">Type</label>
                  <select
                    value={discountType}
                    onChange={(e: any) => setDiscountType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-white focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed PKR (Rs.)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold uppercase text-[#6F6761] block mb-1">Value *</label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-[#6F6761] block mb-1">Min Order (PKR)</label>
                  <input
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase text-[#6F6761] block mb-1">Max Cap (PKR)</label>
                  <input
                    type="number"
                    value={maxDiscount || ''}
                    onChange={(e) => setMaxDiscount(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 500"
                    className="w-full px-3 py-2 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Publish Voucher
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
