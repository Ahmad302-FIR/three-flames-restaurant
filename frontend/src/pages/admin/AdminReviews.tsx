import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Review } from '../../types';
import { Button } from '../../components/common/Button';
import { useAppDispatch } from '../../store/store';
import { addToast } from '../../store/slices/uiSlice';
import { Star, MessageSquare, CheckCircle, EyeOff, Trash2, Search, Filter } from 'lucide-react';

export const AdminReviewsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await adminService.getReviews();
      setReviews(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleStatusUpdate = async (id: string, status: 'approved' | 'pending' | 'hidden') => {
    try {
      await adminService.updateReviewStatus(id, status);
      setReviews((prev) => prev.map((r) => ((r.id === id || (r as any)._id === id) ? { ...r, status } : r)));
      dispatch(
        addToast({
          type: 'success',
          title: 'Review Updated',
          message: `Review is now marked as "${status}".`,
        })
      );
    } catch (err: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Update Failed',
          message: err.message || 'Could not update review status.',
        })
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this customer review?')) return;
    try {
      await adminService.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id && (r as any)._id !== id));
      dispatch(
        addToast({
          type: 'info',
          title: 'Review Deleted',
          message: 'Review was removed from the database.',
        })
      );
    } catch (err: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Delete Failed',
          message: err.message || 'Could not delete review.',
        })
      );
    }
  };

  const filtered = reviews.filter((r) => {
    if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.customerName.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        (r.dishesMentioned && r.dishesMentioned.some((d) => d.toLowerCase().includes(q)))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#25201D] flex items-center gap-2">
            <MessageSquare size={24} className="text-[#B85C38]" />
            Customer Reviews Moderation
          </h1>
          <p className="text-xs text-[#6F6761] mt-1">
            Approve verified dining experiences, monitor star ratings, and manage public testimonials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6F6761]">Filter:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] font-medium focus:outline-none focus:border-[#B85C38]"
          >
            <option value="all" className="bg-[#FFFFFF] text-[#25201D]">All Reviews ({reviews.length})</option>
            <option value="approved" className="bg-[#FFFFFF] text-[#25201D]">Approved</option>
            <option value="pending" className="bg-[#FFFFFF] text-[#25201D]">Pending</option>
            <option value="hidden" className="bg-[#FFFFFF] text-[#25201D]">Hidden / Archived</option>
          </select>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F6761]" />
          <input
            type="text"
            placeholder="Search by diner name, dish, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] placeholder-[#6F6761]/60 focus:outline-none focus:border-[#B85C38]"
          />
        </div>
        <span className="text-xs text-[#6F6761]">Showing <strong className="text-[#25201D]">{filtered.length}</strong> reviews</span>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-[#6F6761]">Loading customer reviews...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-[#FFFFFF] rounded-2xl border border-[#E8DED6] space-y-2">
          <p className="text-sm font-bold text-[#25201D]">No reviews found matching criteria</p>
          <p className="text-xs text-[#6F6761]">Try clearing your search or status filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((rev) => {
            const revId = (rev as any)._id || rev.id;
            return (
              <div
                key={revId}
                className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] shadow-lg flex flex-col justify-between space-y-4 hover:border-[#E8DED6] transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#25201D]">{rev.customerName}</h4>
                      <span className="text-[10px] text-[#6F6761]">{rev.date || 'Recent Guest'}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[#B85C38]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          fill={i < rev.rating ? '#B85C38' : 'none'}
                          className={i < rev.rating ? 'text-[#B85C38]' : 'text-[#E8DED6]'}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-[#25201D] italic leading-relaxed">
                    "{rev.comment}"
                  </p>

                  {rev.dishesMentioned && rev.dishesMentioned.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {rev.dishesMentioned.map((d, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-[#F7F3EE] text-[10px] text-[#B85C38] border border-[#E8DED6]">
                          {d}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#E8DED6] flex items-center justify-between">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      rev.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : rev.status === 'pending'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-[#F7F3EE] text-[#6F6761] border border-[#E8DED6]'
                    }`}
                  >
                    {rev.status || 'approved'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {rev.status !== 'approved' && (
                      <button
                        onClick={() => handleStatusUpdate(revId, 'approved')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-bold hover:bg-emerald-100 transition-colors"
                        title="Approve for public showcase"
                      >
                        Approve
                      </button>
                    )}
                    {rev.status !== 'hidden' && (
                      <button
                        onClick={() => handleStatusUpdate(revId, 'hidden')}
                        className="px-2.5 py-1 rounded-lg bg-[#F7F3EE] text-[#6F6761] border border-[#E8DED6] text-[11px] hover:text-[#25201D] transition-colors"
                        title="Hide from public page"
                      >
                        Hide
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(revId)}
                      className="p-1.5 rounded-lg bg-[#F7F3EE] text-[#6F6761] hover:text-[#C24838] hover:bg-rose-50 border border-[#E8DED6] transition-colors"
                      title="Permanently delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
