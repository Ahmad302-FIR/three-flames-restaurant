import { Offer } from '../types';

export const initialOffers: Offer[] = [
  {
    id: 'offer-1',
    code: 'FLAME10',
    title: 'First Flame 10% Off',
    discountType: 'percentage',
    discountValue: 10,
    minOrder: 1500,
    maxDiscount: 600,
    expiresAt: '2026-12-31',
    isActive: true,
    description: 'Get 10% discount on orders above Rs. 1,500'
  },
  {
    id: 'offer-2',
    code: 'BBQFEST',
    title: 'Grand Platter Saver',
    discountType: 'fixed',
    discountValue: 500,
    minOrder: 4000,
    expiresAt: '2026-10-31',
    isActive: true,
    description: 'Flat Rs. 500 OFF on grand family BBQ platters and sajji feasts above Rs. 4,000'
  },
  {
    id: 'offer-3',
    code: 'PESHAWAR15',
    title: 'University Town Special',
    discountType: 'percentage',
    discountValue: 15,
    minOrder: 2500,
    maxDiscount: 750,
    expiresAt: '2026-09-30',
    isActive: true,
    description: '15% discount for dine-in and online orders over Rs. 2,500'
  },
  {
    id: 'offer-4',
    code: 'SAJJI100',
    title: 'Weekend Sajji Delight',
    discountType: 'fixed',
    discountValue: 200,
    minOrder: 1800,
    expiresAt: '2026-11-15',
    isActive: true,
    description: 'Rs. 200 OFF on any Full Chicken or Raan Sajji order'
  }
];
