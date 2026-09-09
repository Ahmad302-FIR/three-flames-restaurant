import mongoose from 'mongoose';

const restaurantSettingsSchema = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      default: 'Three Flames Restaurant'
    },
    tagline: {
      type: String,
      default: 'WHERE TASTE MEETS FLAME'
    },
    subtagline: {
      type: String,
      default: 'Authentic Charcoal Sajji, Live Karahi & Premium BBQ in Peshawar'
    },
    phone: {
      type: String,
      default: '03295664981'
    },
    whatsapp: {
      type: String,
      default: '923295664981'
    },
    email: {
      type: String,
      default: 'info@threeflames.pk'
    },
    address: {
      street: { type: String, default: 'Bilour Chowk, Rehman Baba Road, Abdara Road' },
      area: { type: String, default: 'University Town' },
      city: { type: String, default: 'Peshawar, Pakistan' },
      fullAddress: { type: String, default: 'Bilour Chowk, Rehman Baba Road, Abdara Road, University Town, Peshawar, Pakistan' }
    },
    coordinates: {
      lat: { type: Number, default: 34.0044 },
      lng: { type: Number, default: 71.5125 }
    },
    openingHours: {
      weekdays: { type: String, default: '12:00 PM – 01:00 AM' },
      fridays: { type: String, default: '02:00 PM – 02:00 AM' },
      weekends: { type: String, default: '12:00 PM – 02:00 AM' }
    },
    socialLinks: {
      facebook: { type: String, default: 'https://facebook.com/threeflamesrestaurant' },
      instagram: { type: String, default: 'https://instagram.com/threeflamespk' },
      tiktok: { type: String, default: 'https://tiktok.com/@threeflamespk' },
      youtube: { type: String, default: 'https://youtube.com/@threeflamespk' }
    },
    deliverySettings: {
      minOrder: { type: Number, default: 800 },
      freeDeliveryThreshold: { type: Number, default: 5000 },
      estimatedTime: { type: String, default: '35-50 mins' }
    },
    reservationSettings: {
      minAdvanceHours: { type: Number, default: 2 },
      maxGuestsPerSlot: { type: Number, default: 50 }
    },
    stats: {
      rating: { type: Number, default: 4.9 },
      reviewsCount: { type: String, default: '3,800+' },
      yearsOfLegacy: { type: String, default: '12+' },
      dailyGuests: { type: String, default: '650+' }
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const RestaurantSettings = mongoose.model('RestaurantSettings', restaurantSettingsSchema);
