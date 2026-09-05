import { DeliveryZone } from '../models/DeliveryZone.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const getDeliveryZones = async (req, res, next) => {
  try {
    const isAdmin = req.user && ['admin', 'superadmin', 'staff'].includes(req.user.role);
    const filter = isAdmin ? {} : { active: true };

    const zones = await DeliveryZone.find(filter).sort({ fee: 1 });
    return sendSuccess(res, 200, 'Delivery zones retrieved', zones);
  } catch (error) {
    next(error);
  }
};

export const createDeliveryZone = async (req, res, next) => {
  try {
    const { name, fee, minOrder, estimatedMinutes, active } = req.body;

    const existing = await DeliveryZone.findOne({ name: new RegExp(`^${name.trim()}$`, 'i') });
    if (existing) {
      return sendError(res, 400, `A delivery zone named "${name}" already exists.`);
    }

    const zone = await DeliveryZone.create({
      name: name.trim(),
      fee: Number(fee),
      minOrder: Number(minOrder),
      estimatedMinutes: estimatedMinutes || '30-45 mins',
      active: active !== undefined ? Boolean(active) : true
    });

    return sendSuccess(res, 201, 'Delivery zone created successfully', zone);
  } catch (error) {
    next(error);
  }
};

export const updateDeliveryZone = async (req, res, next) => {
  try {
    const { id } = req.params;
    const zone = await DeliveryZone.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!zone) {
      return sendError(res, 404, 'Delivery zone not found.');
    }

    return sendSuccess(res, 200, 'Delivery zone updated successfully', zone);
  } catch (error) {
    next(error);
  }
};

export const deleteDeliveryZone = async (req, res, next) => {
  try {
    const { id } = req.params;
    const zone = await DeliveryZone.findByIdAndDelete(id);

    if (!zone) {
      return sendError(res, 404, 'Delivery zone not found.');
    }

    return sendSuccess(res, 200, 'Delivery zone deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const syncDeliveryZones = async (req, res, next) => {
  try {
    const { zones } = req.body;
    if (!Array.isArray(zones)) {
      return sendError(res, 400, 'Expected an array of delivery zones');
    }

    for (const z of zones) {
      if (z._id || z.id) {
        await DeliveryZone.findByIdAndUpdate(z._id || z.id, z, { upsert: true });
      } else {
        await DeliveryZone.findOneAndUpdate({ name: z.name }, z, { upsert: true });
      }
    }

    const allZones = await DeliveryZone.find().sort({ fee: 1 });
    return sendSuccess(res, 200, 'Delivery zones synchronized successfully', allZones);
  } catch (error) {
    next(error);
  }
};
