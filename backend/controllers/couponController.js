import { Coupon } from '../models/Coupon.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;

    if (!code || !code.trim()) {
      return sendError(res, 400, 'Coupon code is required.');
    }

    const normalizedCode = code.trim().toUpperCase();
    const coupon = await Coupon.findOne({ code: normalizedCode });

    if (!coupon) {
      return sendError(res, 404, `Coupon code "${normalizedCode}" is invalid.`);
    }

    if (!coupon.isActive) {
      return sendError(res, 400, `Coupon "${normalizedCode}" has been paused or deactivated.`);
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return sendError(res, 400, `Coupon "${normalizedCode}" has expired.`);
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return sendError(res, 400, `Coupon "${normalizedCode}" has reached its maximum redemption limit.`);
    }

    const currentSubtotal = Number(subtotal) || 0;
    if (currentSubtotal < coupon.minOrder) {
      return sendError(res, 400, `This voucher requires a minimum order of Rs. ${coupon.minOrder}. Add more dishes to qualify!`);
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((currentSubtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = Math.min(coupon.discountValue, currentSubtotal);
    }

    return sendSuccess(res, 200, `Promo code applied! You save Rs. ${discount}`, {
      code: coupon.code,
      title: coupon.title,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscount: coupon.maxDiscount,
      minOrder: coupon.minOrder,
      calculatedDiscount: discount
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return sendSuccess(res, 200, 'Coupons retrieved', coupons);
  } catch (error) {
    next(error);
  }
};

export const createAdminCoupon = async (req, res, next) => {
  try {
    const { code, title, description, discountType, discountValue, minOrder, maxDiscount, expiresAt, isActive, usageLimit } = req.body;

    const normalizedCode = code.trim().toUpperCase();
    const existing = await Coupon.findOne({ code: normalizedCode });
    if (existing) {
      return sendError(res, 400, `Coupon with code "${normalizedCode}" already exists.`);
    }

    const coupon = await Coupon.create({
      code: normalizedCode,
      title: title.trim(),
      description: description || '',
      discountType,
      discountValue: Number(discountValue),
      minOrder: Number(minOrder) || 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      usageLimit: usageLimit ? Number(usageLimit) : null
    });

    return sendSuccess(res, 201, 'Promo offer created successfully', coupon);
  } catch (error) {
    next(error);
  }
};

export const updateAdminCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.code) updates.code = updates.code.trim().toUpperCase();

    const coupon = await Coupon.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!coupon) {
      return sendError(res, 404, 'Coupon not found.');
    }

    return sendSuccess(res, 200, 'Coupon updated successfully', coupon);
  } catch (error) {
    next(error);
  }
};

export const deleteAdminCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      return sendError(res, 404, 'Coupon not found.');
    }

    return sendSuccess(res, 200, 'Coupon deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const syncAdminCoupons = async (req, res, next) => {
  try {
    const { offers } = req.body;
    if (!Array.isArray(offers)) {
      return sendError(res, 400, 'Expected an array of offers');
    }

    for (const o of offers) {
      if (o._id || o.id) {
        await Coupon.findByIdAndUpdate(o._id || o.id, o, { upsert: true });
      } else {
        await Coupon.findOneAndUpdate({ code: o.code }, o, { upsert: true });
      }
    }

    const all = await Coupon.find().sort({ createdAt: -1 });
    return sendSuccess(res, 200, 'Offers synchronized successfully', all);
  } catch (error) {
    next(error);
  }
};
