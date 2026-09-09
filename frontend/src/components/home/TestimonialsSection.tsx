import React, { useEffect, useState } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { StarRating } from '../common/StarRating';
import { reviewsData } from '../../data/reviewsData';
import { adminService } from '../../services/adminService';
import { Review } from '../../types';
import { Quote, CheckCircle2 } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(reviewsData.slice(0, 4));

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const fetched = await adminService.getPublicReviews();
        if (fetched && fetched.length > 0) {
          setReviews(fetched.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load reviews:', err);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section id="reviews" className="py-20 bg-[#1C1815] border-t border-[#51463D]/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="VOICES OF OUR GUESTS"
          title="LOVED BY OUR CUSTOMERS"
          subtitle="4.9 / 5.0 Rating based on 3,800+ verified customer experiences in Peshawar and beyond."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-8 rounded-2xl bg-[#28221D] border border-[#51463D] relative flex flex-col justify-between hover:border-[#D6A15D]/50 transition-colors shadow-lg shadow-black/20"
            >
              <div className="absolute top-6 right-6 text-[#D6A15D]/20">
                <Quote size={36} />
              </div>

              <div>
                <StarRating rating={rev.rating} size={18} />
                <p className="mt-4 text-sm sm:text-base text-[#F3EDE5] leading-relaxed italic">
                  "{rev.comment}"
                </p>

                {rev.dishesMentioned && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {rev.dishesMentioned.map((dish, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#332B25] text-[#D6A15D] border border-[#51463D] font-medium"
                      >
                        🔥 {dish}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[#51463D]/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {rev.avatar && (
                    <img
                      src={rev.avatar}
                      alt={rev.customerName}
                      className="w-10 h-10 rounded-full object-cover border border-[#51463D]"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-[#F3EDE5]">{rev.customerName}</h4>
                    <span className="text-[11px] text-[#BDB1A5] flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-[#7FA27A]" /> Verified Diner
                    </span>
                  </div>
                </div>

                <span className="text-xs text-[#91857A]">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
