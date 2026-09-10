import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Review } from '../../types';
import { useAppDispatch } from '../../store/store';
import { addToast } from '../../store/slices/uiSlice';
import {
  Star,
  MessageSquare,
  CheckCircle2,
  XCircle,
  EyeOff,
  Trash2,
  Search,
  Mail,
  Clock,
  Check,
  X,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';

export const AdminReviewsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'hidden'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await adminService.getReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Failed to load reviews',
          message: err.message || 'Could not fetch customer reviews.',
        })
      );
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleStatusUpdate = async (id: string, status: 'approved' | 'pending' | 'rejected' | 'hidden') => {
    setActionLoadingId(id);
    try {
      await adminService.updateReviewStatus(id, status);
      setReviews((prev) =>
        prev.map((r) => ((r.id === id || (r as any)._id === id) ? { ...r, status } : r))
      );
      dispatch(
        addToast({
          type: 'success',
          title: 'Review Status Updated',
          message: `Review marked as "${status}".`,
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
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this review? This action cannot be undone.')) {
      return;
    }
    setActionLoadingId(id);
    try {
      await adminService.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id && (r as any)._id !== id));
      dispatch(
        addToast({
          type: 'info',
          title: 'Review Deleted',
          message: 'Review permanently removed from database.',
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
    } finally {
      setActionLoadingId(null);
    }
  };

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const approvedCount = reviews.filter((r) => r.status === 'approved').length;
  const rejectedCount = reviews.filter((r) => r.status === 'rejected').length;
  const hiddenCount = reviews.filter((r) => r.status === 'hidden').length;

  const filtered = reviews.filter((r) => {
    if (activeTab !== 'all' && r.status !== activeTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.customerName?.toLowerCase().includes(q) ||
        r.customerEmail?.toLowerCase().includes(q) ||
        r.comment?.toLowerCase().includes(q) ||
        (r.dishesMentioned && r.dishesMentioned.some((d) => d.toLowerCase().includes(q)))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#25201D] flex items-center gap-2.5">
            <MessageSquare size={26} className="text-[#B85C38]" />
            Customer Reviews Moderation
          </h1>
          <p className="text-xs sm:text-sm text-[#6F6761] mt-1">
            Review guest submissions, approve verified testimonials for the landing page, and moderate feedback.
          </p>
        </div>

        <button
          onClick={fetchReviews}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFFFFF] border border-[#E8DED6] text-xs font-semibold text-[#25201D] hover:bg-[#F7F3EE] transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#E8DED6]">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'all'
              ? 'bg-[#B85C38] text-white shadow-sm'
              : 'bg-[#FFFFFF] text-[#6F6761] hover:text-[#25201D] hover:bg-[#F7F3EE] border border-[#E8DED6]'
          }`}
        >
          All Reviews ({reviews.length})
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'pending'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-[#FFFFFF] text-[#6F6761] hover:text-[#25201D] hover:bg-[#F7F3EE] border border-[#E8DED6]'
          }`}
        >
          <Clock size={13} />
          <span>Pending Moderation</span>
          {pendingCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeTab === 'pending' ? 'bg-white text-amber-700' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('approved')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'approved'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-[#FFFFFF] text-[#6F6761] hover:text-[#25201D] hover:bg-[#F7F3EE] border border-[#E8DED6]'
          }`}
        >
          <CheckCircle2 size={13} />
          <span>Approved ({approvedCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('rejected')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'rejected'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-[#FFFFFF] text-[#6F6761] hover:text-[#25201D] hover:bg-[#F7F3EE] border border-[#E8DED6]'
          }`}
        >
          <XCircle size={13} />
          <span>Rejected ({rejectedCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('hidden')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'hidden'
              ? 'bg-[#25201D] text-white shadow-sm'
              : 'bg-[#FFFFFF] text-[#6F6761] hover:text-[#25201D] hover:bg-[#F7F3EE] border border-[#E8DED6]'
          }`}
        >
          <EyeOff size={13} />
          <span>Hidden ({hiddenCount})</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] flex items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F6761]" />
          <input
            type="text"
            placeholder="Search by diner name, email, dish, or text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] placeholder-[#6F6761]/60 focus:outline-none focus:border-[#B85C38]"
          />
        </div>
        <span className="text-xs text-[#6F6761] whitespace-nowrap">
          Showing <strong className="text-[#25201D]">{filtered.length}</strong> review{filtered.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Reviews List / Grid */}
      {loading ? (
        <div className="py-24 text-center space-y-3 bg-[#FFFFFF] rounded-2xl border border-[#E8DED6]">
          <div className="w-8 h-8 border-2 border-[#B85C38] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#6F6761]">Loading customer reviews...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-[#FFFFFF] rounded-2xl border border-[#E8DED6] space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#F7F3EE] text-[#6F6761] flex items-center justify-center mx-auto">
            <MessageSquare size={22} />
          </div>
          <p className="text-sm font-bold text-[#25201D]">No reviews found</p>
          <p className="text-xs text-[#6F6761]">
            {searchQuery ? 'No reviews match your search query.' : `No reviews currently in "${activeTab}" tab.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((rev) => {
            const revId = (rev as any)._id || rev.id;
            const isActing = actionLoadingId === revId;
            const displayDate = rev.date || (rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent');

            return (
              <div
                key={revId}
                className={`p-5 rounded-2xl bg-[#FFFFFF] border shadow-sm flex flex-col justify-between space-y-4 transition-all ${
                  rev.status === 'pending'
                    ? 'border-amber-300 ring-1 ring-amber-200'
                    : 'border-[#E8DED6] hover:border-[#B85C38]/40'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Name, Email, Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-[#25201D] truncate flex items-center gap-1.5">
                        {rev.customerName}
                        {rev.verifiedCustomer && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-normal border border-emerald-200">
                            Verified
                          </span>
                        )}
                      </h4>
                      {rev.customerEmail ? (
                        <div className="flex items-center gap-1 text-[11px] text-[#6F6761] truncate mt-0.5">
                          <Mail size={11} className="shrink-0" />
                          <span className="truncate">{rev.customerEmail}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-[#6F6761]">{displayDate}</span>
                      )}
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1 ${
                        rev.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : rev.status === 'pending'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
                          : rev.status === 'rejected'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-[#F7F3EE] text-[#6F6761] border border-[#E8DED6]'
                      }`}
                    >
                      {rev.status === 'approved' && <Check size={10} />}
                      {rev.status === 'pending' && <Clock size={10} />}
                      {rev.status === 'rejected' && <X size={10} />}
                      {rev.status}
                    </span>
                  </div>

                  {/* Rating & Date */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1 text-[#B85C38]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          fill={i < rev.rating ? '#B85C38' : 'none'}
                          className={i < rev.rating ? 'text-[#B85C38]' : 'text-[#E8DED6]'}
                        />
                      ))}
                      <span className="text-xs font-bold text-[#25201D] ml-1">{rev.rating}.0</span>
                    </div>
                    {rev.customerEmail && (
                      <span className="text-[10px] text-[#6F6761]">{displayDate}</span>
                    )}
                  </div>

                  {/* Review Text */}
                  <div className="p-3 rounded-xl bg-[#F7F3EE]/60 border border-[#E8DED6]/60">
                    <p className="text-xs text-[#25201D] leading-relaxed italic break-words whitespace-pre-line">
                      "{rev.comment}"
                    </p>
                  </div>

                  {/* Dishes Mentioned */}
                  {rev.dishesMentioned && rev.dishesMentioned.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {rev.dishesMentioned.map((d, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[#F3E4DC] text-[10px] text-[#B85C38] font-medium border border-[#E8DED6]"
                        >
                          🔥 {d}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Actions Bar */}
                <div className="pt-3 border-t border-[#E8DED6] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Approve Button */}
                    {rev.status !== 'approved' && (
                      <button
                        onClick={() => handleStatusUpdate(revId, 'approved')}
                        disabled={isActing}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-sm disabled:opacity-50"
                        title="Approve for public landing page"
                      >
                        <Check size={12} />
                        Approve
                      </button>
                    )}

                    {/* Reject Button */}
                    {rev.status !== 'rejected' && (
                      <button
                        onClick={() => handleStatusUpdate(revId, 'rejected')}
                        disabled={isActing}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold hover:bg-rose-100 transition-colors flex items-center gap-1 disabled:opacity-50"
                        title="Reject review"
                      >
                        <X size={12} />
                        Reject
                      </button>
                    )}

                    {/* Hide Button (for approved items) */}
                    {rev.status === 'approved' && (
                      <button
                        onClick={() => handleStatusUpdate(revId, 'hidden')}
                        disabled={isActing}
                        className="px-2.5 py-1.5 rounded-lg bg-[#F7F3EE] text-[#6F6761] border border-[#E8DED6] text-[11px] hover:text-[#25201D] transition-colors flex items-center gap-1 disabled:opacity-50"
                        title="Hide from landing page"
                      >
                        <EyeOff size={12} />
                        Hide
                      </button>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(revId)}
                    disabled={isActing}
                    className="p-1.5 rounded-lg text-[#6F6761] hover:text-[#C24838] hover:bg-rose-50 border border-[#E8DED6] transition-colors disabled:opacity-50"
                    title="Permanently delete review"
                  >
                    {isActing ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

