import { RestaurantSettings } from '../models/RestaurantSettings.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getSettings = async (req, res, next) => {
  try {
    let settings = await RestaurantSettings.findOne();
    if (!settings) {
      settings = await RestaurantSettings.create({
        restaurantName: 'Three Flames Restaurant',
        tagline: 'WHERE TASTE MEETS FLAME',
        phone: '0334-4226655',
        whatsapp: '923344226655',
        email: 'info@threeflames.pk',
        address: {
          street: 'Bilour Chowk, Rehman Baba Road, Abdara Road',
          area: 'University Town',
          city: 'Peshawar, Pakistan',
          fullAddress: 'Bilour Chowk, Rehman Baba Road, Abdara Road, University Town, Peshawar, Pakistan'
        }
      });
    }

    return sendSuccess(res, 200, 'Restaurant settings retrieved', settings);
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    let settings = await RestaurantSettings.findOne();
    if (!settings) {
      settings = await RestaurantSettings.create(req.body);
    } else {
      settings = await RestaurantSettings.findByIdAndUpdate(settings._id, req.body, { new: true, runValidators: true });
    }

    return sendSuccess(res, 200, 'Restaurant settings updated successfully', settings);
  } catch (error) {
    next(error);
  }
};
