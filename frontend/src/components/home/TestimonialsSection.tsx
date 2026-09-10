import React, { useEffect, useState, useCallback } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { StarRating } from '../common/StarRating';
import { adminService } from '../../services/adminService';
import { Review } from '../../types';
import { Quote, CheckCircle2, PenLine, MessageSquareQuote, ChevronDown, ChevronUp } from 'lucide-react';
import { WriteReviewModal } from '../reviews/WriteReviewModal';

export const TestimonialsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const fetched = await adminService.getPublicReviews();
      setReviews(Array.isArray(fetched) ? fetched : []);
    } catch (err) {
      console.error('Failed to load public reviews:', err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / totalReviews).toFixed(1)
    : null;

  const subtitle = totalReviews > 0
    ? `${avgRating} / 5.0 Rating based on ${totalReviews} authentic guest review${totalReviews === 1 ? '' : 's'} in Peshawar.`
    : 'Be one of our first guests to share your dining experience at Three Flames.';

  const displayedReviews = reviews.slice(0, visibleCount);

  return (
    <section id="reviews" className="py-20 bg-[#FFFDFC] border-t border-[#E8DED6] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="flex-1">
            <SectionHeading
              badgeText="VOICES OF OUR GUESTS"
              title="LOVED BY OUR CUSTOMERS"
              subtitle={subtitle}
              align="left"
              className="mb-0"
            />
          </div>

          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#B85C38] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#8F432B] transition-all shadow-md shrink-0 self-start md:self-auto hover:shadow-lg active:scale-95"
          >
            <PenLine size={15} />
            Write a Review
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#B85C38] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#6F6761]">Loading guest testimonials...</p>
          </div>
        ) : totalReviews === 0 ? (
          <div className="py-16 px-6 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] text-center max-w-lg mx-auto space-y-5 shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F7F3EE] text-[#B85C38] flex items-center justify-center border border-[#E8DED6]">
              <MessageSquareQuote size={30} />
            </div>
            <div className="space-y-2">
              <h4 className="font-heading font-extrabold text-lg text-[#25201D]">No Reviews Published Yet</h4>
              <p className="text-xs sm:text-sm text-[#6F6761] leading-relaxed">
                Have you enjoyed dining with us recently? We invite you to share your feedback about our charcoal BBQ, Shinwari Karahi, and traditional ambiance.
              </p>
            </div>
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#B85C38] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#8F432B] transition-colors shadow-sm"
            >
              <PenLine size={14} />
              Write the First Review
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {displayedReviews.map((rev) => {
                const revId = rev.id || (rev as any)._id;
                const initials = rev.customerName
                  ? rev.customerName
                      .split(' ')
                      .filter(Boolean)
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                  : 'TF';

                const displayDate = rev.date || (rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent Guest');

                return (
                  <div
                    key={revId}
                    className="p-7 sm:p-8 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] relative flex flex-col justify-between hover:border-[#B85C38]/40 transition-colors shadow-sm"
                  >
                    <div className="absolute top-6 right-6 text-[#B85C38]/15">
                      <Quote size={34} />
                    </div>

                    <div>
                      <StarRating rating={rev.rating} size={18} />
                      <p className="mt-4 text-sm sm:text-base text-[#25201D] leading-relaxed italic">
                        "{rev.comment}"
                      </p>

                      {rev.dishesMentioned && rev.dishesMentioned.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {rev.dishesMentioned.map((dish, i) => (
                            <span
                              key={i}
                              className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#F3E4DC] text-[#B85C38] border border-[#E8DED6] font-medium"
                            >
                              🔥 {dish}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#E8DED6]/60 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {rev.avatar ? (
                          <img
                            src={rev.avatar}
                            alt={rev.customerName}
                            className="w-10 h-10 rounded-full object-cover border border-[#E8DED6]"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#F3E4DC] border border-[#E8DED6] text-[#B85C38] font-bold text-xs flex items-center justify-center tracking-wider">
                            {initials}
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-bold text-[#25201D]">{rev.customerName}</h4>
                          {rev.verifiedCustomer && (
                            <span className="text-[11px] text-[#4E8A57] font-medium flex items-center gap-1">
                              <CheckCircle2 size={12} className="text-[#4E8A57]" /> Verified Diner
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="text-xs text-[#6F6761]">{displayDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalReviews > 4 && (
              <div className="mt-10 text-center">
                {visibleCount < totalReviews ? (
                  <button
                    onClick={() => setVisibleCount((prev) => Math.min(prev + 4, totalReviews))}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-[#E8DED6] bg-[#FFFFFF] text-xs font-bold text-[#25201D] hover:bg-[#F7F3EE] transition-colors shadow-sm"
                  >
                    <span>Show More Reviews ({totalReviews - visibleCount} remaining)</span>
                    <ChevronDown size={15} />
                  </button>
                ) : (
                  <button
                    onClick={() => setVisibleCount(4)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-[#E8DED6] bg-[#FFFFFF] text-xs font-bold text-[#25201D] hover:bg-[#F7F3EE] transition-colors shadow-sm"
                  >
                    <span>Show Less</span>
                    <ChevronUp size={15} />
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onSuccess={fetchReviews}
      />
    </section>
  );
};
