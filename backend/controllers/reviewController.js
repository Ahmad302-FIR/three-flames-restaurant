import { Review } from '../models/Review.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const getApprovedReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ status: 'approved' }).sort({ createdAt: -1 });
    return sendSuccess(res, 200, 'Reviews retrieved', reviews);
  } catch (error) {
    next(error);
  }
};

export const getReviewsByMenuItem = async (req, res, next) => {
  try {
    const { menuItemId } = req.params;
    const reviews = await Review.find({
      menuItem: menuItemId,
      status: 'approved'
    }).sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Menu item reviews retrieved', reviews);
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { menuItemId, rating, comment, dishesMentioned, customerName, avatar } = req.body;

    const review = await Review.create({
      user: req.user?._id || null,
      menuItem: menuItemId || null,
      customerName: req.user?.name || customerName || 'Verified Diner',
      avatar: req.user?.avatar || avatar || '',
      rating: Number(rating),
      comment,
      dishesMentioned: Array.isArray(dishesMentioned) ? dishesMentioned : (dishesMentioned ? [dishesMentioned] : []),
      verifiedCustomer: true,
      status: 'approved' // default approved or can be pending
    });

    return sendSuccess(res, 201, 'Thank you for your feedback! Your review has been recorded.', review);
  } catch (error) {
    next(error);
  }
};

export const getAdminReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    return sendSuccess(res, 200, 'All customer reviews retrieved', reviews);
  } catch (error) {
    next(error);
  }
};

export const updateReviewStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'pending', 'hidden'].includes(status)) {
      return sendError(res, 400, 'Invalid status. Allowed: approved, pending, hidden');
    }

    const review = await Review.findByIdAndUpdate(id, { status }, { new: true });
    if (!review) {
      return sendError(res, 404, 'Review not found.');
    }

    return sendSuccess(res, 200, `Review status updated to ${status}`, review);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return sendError(res, 404, 'Review not found.');
    }

    return sendSuccess(res, 200, 'Review deleted successfully');
  } catch (error) {
    next(error);
  }
};
