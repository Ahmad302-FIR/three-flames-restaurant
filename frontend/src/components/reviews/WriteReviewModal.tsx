import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { addToast } from '../../store/slices/uiSlice';
import { adminService } from '../../services/adminService';
import { X, Star, Sparkles, CheckCircle2, Loader2, MessageSquareQuote } from 'lucide-react';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [dishesInput, setDishesInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Prefill if logged in
  useEffect(() => {
    if (isOpen) {
      if (currentUser) {
        setCustomerName(currentUser.name || '');
        setCustomerEmail(currentUser.email || '');
      }
      setIsSuccess(false);
      setErrorMessage('');
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!comment.trim() || comment.trim().length < 5) {
      setErrorMessage('Please write at least a brief comment (minimum 5 characters).');
      return;
    }

    if (comment.trim().length > 1000) {
      setErrorMessage('Comment cannot exceed 1000 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const dishesMentioned = dishesInput
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean);

      await adminService.submitReview({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        rating,
        comment: comment.trim(),
        dishesMentioned: dishesMentioned.length > 0 ? dishesMentioned : undefined,
      });

      setIsSuccess(true);
      dispatch(
        addToast({
          type: 'success',
          title: 'Review Submitted',
          message: 'Thank you! Your dining review has been submitted and is awaiting approval.',
        })
      );

      if (onSuccess) onSuccess();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit review. Please try again.';
      setErrorMessage(msg);
      dispatch(
        addToast({
          type: 'error',
          title: 'Submission Failed',
          message: msg,
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setComment('');
    setDishesInput('');
    setRating(5);
    setIsSuccess(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#25201D]/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg bg-[#FFFFFF] rounded-2xl border border-[#E8DED6] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#F7F3EE] border-b border-[#E8DED6] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#F3E4DC] flex items-center justify-center text-[#B85C38]">
              <MessageSquareQuote size={20} />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-[#25201D]">Share Your Dining Experience</h3>
              <p className="text-xs text-[#6F6761]">Three Flames Restaurant & Traditional Dastarkhwan</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-[#6F6761] hover:text-[#25201D] hover:bg-[#E8DED6]/50 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <CheckCircle2 size={32} />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-heading font-extrabold text-[#25201D]">Review Submitted! 🎉</h4>
                <p className="text-sm text-[#6F6761] max-w-sm mx-auto leading-relaxed">
                  Thank you for sharing your experience. Your review has been received and is awaiting approval. Once verified by our team, it will appear on our customer testimonials showcase.
                </p>
              </div>
              <div className="pt-4">
                <button
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 rounded-xl bg-[#B85C38] text-white font-semibold text-xs tracking-wider uppercase hover:bg-[#8F432B] transition-colors shadow-sm"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Star Rating */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#25201D] mb-2">
                  Your Overall Rating <span className="text-[#C24838]">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star
                          size={28}
                          className={`${
                            (hoverRating || rating) >= star
                              ? 'text-[#B85C38] fill-[#B85C38]'
                              : 'text-[#E8DED6]'
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-[#B85C38] ml-2">
                    {hoverRating || rating} of 5 Stars
                  </span>
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#25201D] mb-1.5">
                    Full Name <span className="text-[#C24838]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asad Ullah"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    disabled={submitting}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] placeholder-[#6F6761]/60 focus:outline-none focus:border-[#B85C38]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#25201D] mb-1.5">
                    Email Address <span className="text-[#C24838]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. asad@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    disabled={submitting}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] placeholder-[#6F6761]/60 focus:outline-none focus:border-[#B85C38]"
                  />
                  <span className="text-[10px] text-[#6F6761] mt-1 block">Your email stays private and will never be published.</span>
                </div>
              </div>

              {/* Dishes Mentioned */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#25201D] mb-1.5">
                  Dishes Enjoyed <span className="text-[10px] text-[#6F6761] font-normal">(Optional, comma-separated)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Special Chicken Sajji, Shinwari Mutton Karahi, Roghni Naan"
                  value={dishesInput}
                  onChange={(e) => setDishesInput(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] placeholder-[#6F6761]/60 focus:outline-none focus:border-[#B85C38]"
                />
              </div>

              {/* Review Comment */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#25201D]">
                    Your Dining Experience <span className="text-[#C24838]">*</span>
                  </label>
                  <span className={`text-[10px] ${comment.length > 950 ? 'text-[#C24838]' : 'text-[#6F6761]'}`}>
                    {comment.length} / 1000
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  maxLength={1000}
                  placeholder="Tell us about the flavor, service, atmosphere, and whether you recommend Three Flames to others..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] placeholder-[#6F6761]/60 focus:outline-none focus:border-[#B85C38] leading-relaxed resize-none"
                />
              </div>

              {/* Moderation Policy Note */}
              <div className="p-3 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-[11px] text-[#6F6761] leading-relaxed flex items-start gap-2">
                <Sparkles size={14} className="text-[#B85C38] shrink-0 mt-0.5" />
                <span>
                  To uphold our standards of authentic dining, all customer reviews undergo moderation before appearing on the public website.
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl border border-[#E8DED6] text-xs font-semibold text-[#6F6761] hover:text-[#25201D] hover:bg-[#F7F3EE] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#B85C38] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#8F432B] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
