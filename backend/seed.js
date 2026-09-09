import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { MenuItem } from './models/MenuItem.js';
import { Category } from './models/Category.js';
import { Order } from './models/Order.js';
import { Reservation } from './models/Reservation.js';
import { Review } from './models/Review.js';
import { GalleryImage } from './models/GalleryImage.js';
import { DeliveryZone } from './models/DeliveryZone.js';
import { Coupon } from './models/Coupon.js';
import { RestaurantSettings } from './models/RestaurantSettings.js';
import { Counter } from './models/Counter.js';
import { logger } from './utils/logger.js';

dotenv.config();

const categoriesSeed = [
  { id: 'all', name: 'All Specialties', slug: 'all', icon: 'Flame', description: 'Our complete wood-fire menu' },
  { id: 'sajji', name: 'Balochi Sajji', slug: 'sajji', icon: 'Flame', description: 'Slow-roasted over authentic wood embers' },
  { id: 'bbq', name: 'Charcoal BBQ', slug: 'bbq', icon: 'UtensilsCrossed', description: 'Tender skewers grilled to perfection' },
  { id: 'seekh-kebab', name: 'Seekh & Kebabs', slug: 'seekh-kebab', icon: 'Flame', description: 'Hand-ground spiced minced meat specialties' },
  { id: 'karahi', name: 'Live Karahi & Handi', slug: 'karahi', icon: 'CookingPot', description: 'Sizzling woks prepared fresh on high flame' },
  { id: 'rice', name: 'Kabuli & Biryani', slug: 'rice', icon: 'UtensilsCrossed', description: 'Fragrant aged basmati rice creations' },
  { id: 'soup', name: 'Yakhni & Soups', slug: 'soup', icon: 'Coffee', description: 'Traditional bone broths and slow-simmered extracts' },
  { id: 'chai-coffee', name: 'Karak Chai & Kehwa', slug: 'chai-coffee', icon: 'Coffee', description: 'Peshawari green tea and slow-brewed beverages' },
  { id: 'specials', name: 'Chef Flame Specials', slug: 'specials', icon: 'Sparkles', description: 'Grand platters and royal feast platters' }
];

const menuItemsSeed = [
  {
    id: 'special-grand-platter',
    name: 'Ahmed Khan Royal BBQ Platter',
    slug: 'ahmed-khan-royal-bbq-platter',
    category: 'specials',
    description: 'The ultimate royal feast: 1/2 Balochi Sajji, 4 Seekh Kebabs, 6 Malai Boti, 4 Chapli Kebabs, 2 Kandahari Naans, Special Raita, and Grilled Chilis served on a sizzling ember tawa.',
    price: 4950,
    originalPrice: 5500,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 384,
    serving: '4-5 Persons',
    prepTime: '35-45 mins',
    spiceLevel: 'Medium',
    available: true,
    featured: true,
    isSpecial: true,
    tags: ['Royal Platter', 'Chef Signature', 'Grand Feast', 'Sharing'],
    ingredients: ['Half Chicken Sajji', 'Beef Seekh Kebabs', 'Chicken Malai Boti', 'Peshawari Chapli Kebabs', 'Kandahari Naan', 'Zeera Raita'],
    addOns: [
      { id: 'addon-naan', name: 'Extra Roghni Naan', price: 120 },
      { id: 'addon-raita', name: 'Zeera Pudina Raita', price: 150 },
      { id: 'addon-salad', name: 'Fresh Garden Salad', price: 180 }
    ]
  },
  {
    name: 'Special Chicken Sajji (Full)',
    slug: 'special-chicken-sajji-full',
    category: 'sajji',
    description: 'Whole spring chicken skewered and slow-roasted for 3 hours over glowing charcoal, marinated with rock salt and traditional pomegranate rub. Served with aromatic saffron-infused rice.',
    price: 1850,
    originalPrice: 2100,
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 512,
    serving: '2-3 Persons',
    prepTime: '25-30 mins',
    spiceLevel: 'Mild',
    available: true,
    featured: true,
    isSpecial: true,
    tags: ['Signature', 'Bestseller', 'Balochi Sajji', 'Charcoal Roasted'],
    ingredients: ['Whole Fresh Chicken', 'Aromatic Saffron Rice', 'Rock Salt Marinade', 'Anardana Rub', 'Lemon Juice'],
    addOns: [
      { id: 'addon-rice', name: 'Extra Portion Kabuli Rice', price: 350 },
      { id: 'addon-sauce', name: 'Tangy Sajji Chutney', price: 100 }
    ]
  },
  {
    name: 'Special Chicken Sajji (Half)',
    slug: 'special-chicken-sajji-half',
    category: 'sajji',
    description: 'Half chicken roasted over glowing charcoal embers, crispy skin with succulent meat inside. Served with fragrant rice and signature dips.',
    price: 980,
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 228,
    serving: '1-2 Persons',
    prepTime: '20-25 mins',
    spiceLevel: 'Mild',
    available: true,
    featured: false,
    tags: ['Balochi Sajji', 'Single Feast', 'Charcoal Roasted'],
    ingredients: ['Half Fresh Chicken', 'Saffron Rice', 'Secret Balochi Spice Blend']
  },
  {
    name: 'Royal Mutton Raan Sajji',
    slug: 'royal-mutton-raan-sajji',
    category: 'sajji',
    description: 'Tender whole leg of lamb (approx. 2kg) marinated in mountain herbs and slow-pit roasted over wild red-oak charcoal for 5 hours. Served on a bed of dry-fruit Kabuli Pulao.',
    price: 6800,
    originalPrice: 7500,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewsCount: 142,
    serving: '5-6 Persons',
    prepTime: '45-60 mins',
    spiceLevel: 'Mild',
    available: true,
    featured: true,
    isSpecial: true,
    tags: ['Royal Specialty', 'Slow Cooked', 'Pre-Order Recommended', 'Mutton Feast'],
    ingredients: ['Whole Mutton Raan (2kg)', 'Kabuli Rice', 'Almonds & Raisins', 'Wild Mountain Thyme']
  },
  {
    name: 'Shinwari Mutton Karahi (1 KG)',
    slug: 'shinwari-mutton-karahi-1kg',
    category: 'karahi',
    description: 'Authentic Peshawar Shinwari style: tender cuts of pasture-fed mutton cooked in its own natural tallow, fresh vine tomatoes, green chillies, and ginger slivers with rock salt. No artificial spice powders.',
    price: 3600,
    originalPrice: 3900,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 419,
    serving: '3-4 Persons',
    prepTime: '30-40 mins',
    spiceLevel: 'Medium',
    available: true,
    featured: true,
    tags: ['Authentic Shinwari', 'Khyber Heritage', 'Pure Ghee', 'Bestseller'],
    ingredients: ['Fresh Mutton', 'Fresh Tomatoes', 'Animal Fat / Desi Ghee', 'Green Chillies', 'Ginger Julienne']
  },
  {
    name: 'Shinwari Mutton Karahi (Half KG)',
    slug: 'shinwari-mutton-karahi-half-kg',
    category: 'karahi',
    description: 'Half kg authentic Shinwari mutton karahi made in cast iron wok on intense flame.',
    price: 1950,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 195,
    serving: '1-2 Persons',
    prepTime: '25-30 mins',
    spiceLevel: 'Medium',
    available: true,
    featured: false,
    tags: ['Shinwari Karahi', 'Desi Flavour']
  },
  {
    name: 'Desi Chicken Karahi (Full)',
    slug: 'desi-chicken-karahi-full',
    category: 'karahi',
    description: 'Free-range organic Desi Murgh cooked in pure butter, freshly ground black pepper, tomatoes, and aromatic fenugreek leaves in a sizzling black wok.',
    price: 2600,
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 287,
    serving: '3-4 Persons',
    prepTime: '35-40 mins',
    spiceLevel: 'Hot',
    available: true,
    featured: false,
    tags: ['Organic Desi Murgh', 'Black Pepper Special', 'Pure Butter']
  },
  {
    name: 'Peshawari Chapli Kebab (2 Pcs)',
    slug: 'peshawari-chapli-kebab-2pcs',
    category: 'seekh-kebab',
    description: 'Legendary Peshawar delicacy: hand-minced prime beef combined with crushed coriander, pomegranate seeds, marrow fat, diced tomatoes, and fried in pure animal fat on a gigantic round iron tava.',
    price: 750,
    originalPrice: 850,
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 468,
    serving: '1-2 Persons',
    prepTime: '15-20 mins',
    spiceLevel: 'Hot',
    available: true,
    featured: true,
    tags: ['Historic Peshawari', 'Crisp Edge', 'Juicy Center', 'Must Try'],
    ingredients: ['Hand-Minced Prime Beef', 'Bone Marrow Tallow', 'Anardana', 'Green Chillies', 'Farm Eggs', 'Cornmeal']
  },
  {
    name: 'Smoky Beef Seekh Kebab (4 Skewers)',
    slug: 'smoky-beef-seekh-kebab-4-skewers',
    category: 'seekh-kebab',
    description: 'Finely minced spiced beef blended with green papaya, browned onions, and roasted spices, pressed on flat skewers and grilled over white-hot embers.',
    price: 850,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 312,
    serving: '2 Persons',
    prepTime: '15-20 mins',
    spiceLevel: 'Medium',
    available: true,
    featured: false,
    tags: ['Charcoal Smoked', 'Melt in Mouth', 'High Protein']
  },
  {
    name: 'Chicken Malai Boti (8 Pcs)',
    slug: 'chicken-malai-boti-8-pcs',
    category: 'bbq',
    description: 'Boneless chicken breast cubes steeped overnight in heavy cream, green cardamom, white pepper, yoghurt, and garlic paste, then seared over gentle charcoal.',
    price: 920,
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 345,
    serving: '1-2 Persons',
    prepTime: '15-20 mins',
    spiceLevel: 'Mild',
    available: true,
    featured: true,
    tags: ['Creamy Marinade', 'Kids Favorite', 'Velvet Texture']
  },
  {
    name: 'Spicy Chicken Tikka Boti',
    slug: 'spicy-chicken-tikka-boti',
    category: 'bbq',
    description: 'Boneless succulent chicken thigh cubes coated in Kashmiri red chilli paste, mustard oil, and citrus marinade. Smoky, spicy, and intensely flavorful.',
    price: 780,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 198,
    serving: '1-2 Persons',
    prepTime: '15-20 mins',
    spiceLevel: 'Hot',
    available: true,
    featured: false,
    tags: ['Fiery Spices', 'Classic BBQ', 'Charred Edges']
  },
  {
    name: 'Ahmed Khan Special Kabuli Pulao',
    slug: 'ahmed-khan-special-kabuli-pulao',
    category: 'rice',
    description: 'Long-grain aged basmati rice simmered in slow-cooked mutton stock, crowned with glistening caramelized carrots, plump black raisins, roasted almonds, and a tender mutton shank.',
    price: 1350,
    originalPrice: 1500,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 376,
    serving: '2 Persons',
    prepTime: '20 mins',
    spiceLevel: 'Mild',
    available: true,
    featured: true,
    tags: ['Afghani Heritage', 'Sweet & Savory', 'Royal Rice'],
    ingredients: ['Aged Basmati Rice', 'Mutton Bone Stock', 'Caramelized Carrots', 'Kishmish', 'Tender Mutton Chunk']
  },
  {
    name: 'Khyber Shinwari Yakhni Soup',
    slug: 'khyber-shinwari-yakhni-soup',
    category: 'soup',
    description: 'Rich, warming mutton marrow bone broth simmered for 8 hours with whole black peppercorns, crushed ginger, and Himalayan rock salt. Perfect winter energizer.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 164,
    serving: '1 Person',
    prepTime: '10 mins',
    spiceLevel: 'Mild',
    available: true,
    featured: false,
    tags: ['Bone Broth', 'Marrow Extracted', 'Immunity Booster', 'Winter Favorite']
  },
  {
    name: 'Traditional Peshawari Qahwa with Cardamom',
    slug: 'traditional-peshawari-qahwa',
    category: 'chai-coffee',
    description: 'Aromatic green tea infused with cracked green cardamom, saffron threads, and served with traditional rock sugar cubes (Nabat). Essential after a heavy BBQ feast.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 290,
    serving: 'Pot for 2',
    prepTime: '5-10 mins',
    spiceLevel: 'Mild',
    available: true,
    featured: false,
    tags: ['Digestive Herbal', 'Peshawari Kehwa', 'Cardamom Infused']
  },
  {
    name: 'Royal Kashmiri Chai (Pink Tea)',
    slug: 'royal-kashmiri-chai-pink-tea',
    category: 'chai-coffee',
    description: 'Slow-brewed gunpowder tea aerated to produce a natural rosy hue, blended with whole buffalo milk, green cardamom, and topped with crushed pistachios and almonds.',
    price: 250,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 230,
    serving: '1 Cup',
    prepTime: '5-10 mins',
    spiceLevel: 'Mild',
    available: true,
    featured: true,
    tags: ['Winter Treat', 'Crushed Nuts', 'Pink Tea']
  },
  {
    name: 'Tandoori Roghni Naan',
    slug: 'tandoori-roghni-naan',
    category: 'specials',
    description: 'Fluffy leavened flatbread glazed with clarified butter (desi ghee), sprinkled with sesame seeds, and baked against the scorching clay walls of our clay tandoor.',
    price: 90,
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 180,
    serving: '1 Person',
    prepTime: '5-8 mins',
    spiceLevel: 'Mild',
    available: true,
    featured: false,
    tags: ['Clay Oven', 'Fresh Tandoor', 'Sesame Glazed']
  },
  {
    name: 'Garlic Butter Naan',
    slug: 'garlic-butter-naan',
    category: 'specials',
    description: 'Crisp-bottomed tandoori flatbread studded with charred minced garlic and coriander leaves, brushed with molten farmhouse butter.',
    price: 130,
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 154,
    serving: '1 Person',
    prepTime: '5-8 mins',
    spiceLevel: 'Mild',
    available: true,
    featured: false,
    tags: ['Garlic Infused', 'Fresh Tandoor']
  }
];

const deliveryZonesSeed = [
  { name: 'University Town & Abdara Road', fee: 100, minOrder: 800, estimatedMinutes: '20-30 mins', active: true },
  { name: 'Hayatabad (Phases 1 - 7)', fee: 200, minOrder: 1500, estimatedMinutes: '35-45 mins', active: true },
  { name: 'Peshawar Cantt & Saddar', fee: 180, minOrder: 1200, estimatedMinutes: '30-40 mins', active: true },
  { name: 'Danishabad & Rahatabad', fee: 120, minOrder: 1000, estimatedMinutes: '25-35 mins', active: true },
  { name: 'Ring Road & Gulbahar', fee: 250, minOrder: 1800, estimatedMinutes: '45-55 mins', active: true },
  { name: 'Warsak Road & Defense Colony', fee: 220, minOrder: 1600, estimatedMinutes: '40-50 mins', active: true },
  { name: 'Namak Mandi & City Core', fee: 220, minOrder: 1500, estimatedMinutes: '40-50 mins', active: true },
  { name: 'Regi Model Town & DHA Peshawar', fee: 350, minOrder: 2500, estimatedMinutes: '50-65 mins', active: true }
];

const couponsSeed = [
  {
    code: 'FLAME10',
    title: '10% Welcome Discount',
    description: 'Enjoy 10% off your online feast order (min. order Rs. 1,500, max discount Rs. 600)',
    discountType: 'percentage',
    discountValue: 10,
    minOrder: 1500,
    maxDiscount: 600,
    isActive: true
  },
  {
    code: 'BBQFEST',
    title: 'Flat Rs. 500 Off Family Feast',
    description: 'Flat Rs. 500 discount on big family orders exceeding Rs. 4,000',
    discountType: 'fixed',
    discountValue: 500,
    minOrder: 4000,
    isActive: true
  },
  {
    code: 'PESHAWAR15',
    title: '15% Off Peshawar Pride',
    description: '15% discount for local diners on orders above Rs. 2,500 (max discount Rs. 750)',
    discountType: 'percentage',
    discountValue: 15,
    minOrder: 2500,
    maxDiscount: 750,
    isActive: true
  },
  {
    code: 'SAJJI100',
    title: 'Flat Rs. 200 Off Any Sajji',
    description: 'Instant Rs. 200 discount when ordering any chicken or mutton sajji platter',
    discountType: 'fixed',
    discountValue: 200,
    minOrder: 1800,
    isActive: true
  }
];

const reviewsSeed = [
  {
    customerName: 'Muhammad Salman Khan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: 'February 24, 2025',
    comment: 'The Balochi Chicken Sajji here is without question the most authentic in Peshawar. The skin was exceptionally crispy while the meat was falling off the bone. Saffron rice was fragrant and generous. The rooftop flame ambiance at night is unparalleled.',
    dishesMentioned: ['Special Chicken Sajji (Full)', 'Peshawari Qahwa'],
    verifiedCustomer: true,
    status: 'approved'
  },
  {
    customerName: 'Dr. Ayesha Durrani',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: 'February 18, 2025',
    comment: 'Hosted a 12-person family dinner at their Traditional Dastarkhwan hall. The Royal BBQ Platter and Shinwari Mutton Karahi were magnificent. Fast thermal delivery to our table and hospitable staff. Will definitely return for Eid gatherings!',
    dishesMentioned: ['Ahmed Khan Royal BBQ Platter', 'Shinwari Mutton Karahi (1 KG)'],
    verifiedCustomer: true,
    status: 'approved'
  },
  {
    customerName: 'Hamza Farooq',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: 'January 30, 2025',
    comment: 'Chapli Kebabs with tandoori roghni naan had that perfect charred crisp edge with juicy center. You can tell they use genuine marrow fat. Worth every rupee.',
    dishesMentioned: ['Peshawari Chapli Kebab (2 Pcs)', 'Tandoori Roghni Naan'],
    verifiedCustomer: true,
    status: 'approved'
  },
  {
    customerName: 'Kashif Mehmood',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: 'January 15, 2025',
    comment: 'Ordered online to Hayatabad Phase 4. The insulated packaging was still steaming hot when the rider arrived in 35 minutes. Malai boti was melting in mouth!',
    dishesMentioned: ['Chicken Malai Boti (8 Pcs)', 'Garlic Butter Naan'],
    verifiedCustomer: true,
    status: 'approved'
  }
];

const gallerySeed = [
  {
    title: 'Live Charcoal Sajji Rotisserie Pit',
    category: 'sajji',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    description: 'Whole chicken skewered and turned over glowing wild oak charcoal for hours.'
  },
  {
    title: 'Rooftop Flame Lounge at Twilight',
    category: 'restaurant',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    description: 'Open air terrace overlooking University Town Peshawar with ember fire pits.'
  },
  {
    title: 'Grand Ahmed Khan Royal Platter',
    category: 'specials',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    description: 'Our signature feast platter with sajji, kebabs, boti, and naan.'
  },
  {
    title: 'Sizzling Shinwari Mutton Karahi',
    category: 'karahi',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    description: 'Prepared live on high flame with pure tallow and vine tomatoes.'
  },
  {
    title: 'Traditional Dastarkhwan Family Hall',
    category: 'restaurant',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    description: 'Authentic cushioned floor seating for private royal family banquets.'
  },
  {
    title: 'Hand-Pounded Chapli Kebabs Searing on Tava',
    category: 'kebab',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    description: 'Golden fried with fresh tomatoes and pomegranate seeds in animal tallow.'
  }
];

export const seedDatabase = async () => {
  try {
    await connectDB();
    logger.info('Starting full Ahmed Khan Restaurant database seed...');

    // 1. Seed Restaurant Settings
    await RestaurantSettings.deleteMany({});
    await RestaurantSettings.create({
      restaurantName: 'Ahmed Khan Restaurant',
      tagline: 'WHERE TASTE MEETS FLAME',
      subtagline: 'Authentic Charcoal Sajji, Live Karahi & Premium BBQ in Peshawar',
      phone: '03295664981',
      whatsapp: '923295664981',
      email: 'info.ahmadkhan.com@gmail.com',
      address: {
        street: 'Bilour Chowk, Rehman Baba Road, Abdara Road',
        area: 'University Town',
        city: 'Peshawar, Pakistan',
        fullAddress: 'Bilour Chowk, Rehman Baba Road, Abdara Road, University Town, Peshawar, Pakistan'
      },
      coordinates: { lat: 34.0044, lng: 71.5125 },
      openingHours: {
        weekdays: '12:00 PM – 01:00 AM',
        fridays: '02:00 PM – 02:00 AM',
        weekends: '12:00 PM – 02:00 AM'
      },
      socialLinks: {
        facebook: 'https://facebook.com/threeflamesrestaurant',
        instagram: 'https://instagram.com/threeflamespk',
        tiktok: 'https://tiktok.com/@threeflamespk',
        youtube: 'https://youtube.com/@threeflamespk'
      },
      deliverySettings: { minOrder: 800, freeDeliveryThreshold: 5000, estimatedTime: '35-50 mins' },
      stats: { rating: 4.9, reviewsCount: '3,800+', yearsOfLegacy: '12+', dailyGuests: '650+' }
    });
    logger.info('✅ Seeded Restaurant Settings');

    // 2. Seed Categories
    await Category.deleteMany({});
    await Category.insertMany(categoriesSeed);
    logger.info(`✅ Seeded ${categoriesSeed.length} Categories`);

    // 3. Seed Menu Items
    await MenuItem.deleteMany({});
    const insertedMenu = await MenuItem.insertMany(menuItemsSeed);
    logger.info(`✅ Seeded ${insertedMenu.length} Menu Items`);

    // 4. Seed Delivery Zones
    await DeliveryZone.deleteMany({});
    await DeliveryZone.insertMany(deliveryZonesSeed);
    logger.info(`✅ Seeded ${deliveryZonesSeed.length} Delivery Zones`);

    // 5. Seed Coupons
    await Coupon.deleteMany({});
    await Coupon.insertMany(couponsSeed);
    logger.info(`✅ Seeded ${couponsSeed.length} Coupons`);

    // 6. Seed Reviews
    await Review.deleteMany({});
    await Review.insertMany(reviewsSeed);
    logger.info(`✅ Seeded ${reviewsSeed.length} Reviews`);

    // 7. Seed Gallery
    await GalleryImage.deleteMany({});
    await GalleryImage.insertMany(gallerySeed);
    logger.info(`✅ Seeded ${gallerySeed.length} Gallery Images`);

    // 8. Seed Users (Demo Admin, Demo Staff, Demo Customer)
    await User.deleteMany({});
    
    // Superadmin
    const adminUser = await User.create({
      name: 'Chef Tariq Afridi (Head Pitmaster)',
      email: 'info.ahmadkhan.com@gmail.com',
      phone: '03295664981',
      password: 'Admin@123', // Hashed by User model pre-save hook
      role: 'superadmin',
      addresses: [{
        label: 'Restaurant Branch',
        address: 'Bilour Chowk, Rehman Baba Road, University Town',
        area: 'University Town',
        isDefault: true
      }]
    });

    // Staff
    await User.create({
      name: 'Gulzar Khan (Kitchen Dispatch)',
      email: 'staff@ahmadkhan.pk',
      phone: '0333-9123456',
      password: 'Staff@123',
      role: 'staff'
    });

    // Customer
    const customerUser = await User.create({
      name: 'Asfandyar Khan',
      email: 'asfandyar@example.com',
      phone: '0300-5912345',
      password: 'Customer@123',
      role: 'customer',
      addresses: [{
        id: 'addr-1',
        label: 'Home (Hayatabad)',
        address: 'House 42, Sector F-3, Phase 6, Hayatabad',
        area: 'Hayatabad (Phases 1 - 7)',
        landmark: 'Near Tatara Park',
        isDefault: true
      }]
    });
    logger.info('✅ Seeded Demo Users (Admin, Staff, Customer)');

    // 9. Reset Sequence Counters
    await Counter.deleteMany({});
    await Counter.create({ seqName: 'orderNumber', seq: 1042 });
    await Counter.create({ seqName: 'reservationNumber', seq: 805 });
    logger.info('✅ Initialized sequence counters');

    // 10. Seed Initial Demo Orders
    await Order.deleteMany({});
    await Order.create([
      {
        orderNumber: 'TF-1042',
        user: customerUser._id,
        customer: { name: 'Asfandyar Khan', phone: '0300-5912345', email: 'asfandyar@example.com' },
        orderType: 'delivery',
        deliveryDetails: {
          fullName: 'Asfandyar Khan',
          phone: '0300-5912345',
          email: 'asfandyar@example.com',
          address: 'House 42, Sector F-3, Phase 6',
          area: 'Hayatabad (Phases 1 - 7)',
          landmark: 'Near Tatara Park',
          instructions: 'Ring bell twice, keep sajji extra hot'
        },
        items: [
          {
            originalMenuItemId: insertedMenu[1]._id.toString(),
            name: insertedMenu[1].name,
            price: 1850,
            image: insertedMenu[1].image,
            category: 'sajji',
            quantity: 1,
            serving: '2-3 Persons',
            selectedAddOns: [{ id: 'addon-rice', name: 'Extra Portion Kabuli Rice', price: 350 }],
            itemTotal: 2200
          }
        ],
        subtotal: 2200,
        deliveryFee: 200,
        discount: 220,
        couponCode: 'FLAME10',
        total: 2180,
        paymentMethod: 'cash_on_delivery',
        paymentStatus: 'unpaid',
        status: 'preparing',
        estimatedTime: '35-45 mins',
        timeline: [
          { status: 'pending', title: 'Order Placed', timestamp: '19:42', completed: true },
          { status: 'confirmed', title: 'Confirmed by Pitmaster', timestamp: '19:44', completed: true },
          { status: 'preparing', title: 'On Charcoal Flame', timestamp: '19:46', completed: true },
          { status: 'ready', title: 'Packed for Delivery', timestamp: '', completed: false },
          { status: 'out_for_delivery', title: 'Out with Rider', timestamp: '', completed: false },
          { status: 'delivered', title: 'Delivered', timestamp: '', completed: false }
        ]
      },
      {
        orderNumber: 'TF-1041',
        user: customerUser._id,
        customer: { name: 'Dr. Bilal Tariq', phone: '0333-9876543', email: 'bilal@example.com' },
        orderType: 'dine-in',
        dineInDetails: {
          fullName: 'Dr. Bilal Tariq',
          phone: '0333-9876543',
          guests: 4,
          preferredTime: '20:30',
          tableNumber: 'Table T-08',
          specialRequests: 'High chair for toddler, rooftop terrace'
        },
        items: [
          {
            originalMenuItemId: insertedMenu[0]._id.toString(),
            name: insertedMenu[0].name,
            price: 4950,
            image: insertedMenu[0].image,
            category: 'specials',
            quantity: 1,
            serving: '4-5 Persons',
            itemTotal: 4950
          }
        ],
        subtotal: 4950,
        deliveryFee: 0,
        discount: 500,
        couponCode: 'BBQFEST',
        total: 4450,
        paymentMethod: 'card_at_counter',
        paymentStatus: 'unpaid',
        status: 'confirmed',
        estimatedTime: 'Table Ready',
        timeline: [
          { status: 'pending', title: 'Order Placed', timestamp: '19:15', completed: true },
          { status: 'confirmed', title: 'Confirmed by Pitmaster', timestamp: '19:18', completed: true },
          { status: 'preparing', title: 'On Flame', timestamp: '', completed: false }
        ]
      }
    ]);
    logger.info('✅ Seeded Demo Orders');

    // 11. Seed Initial Demo Reservations
    await Reservation.deleteMany({});
    await Reservation.create([
      {
        reservationNumber: 'RES-801',
        user: customerUser._id,
        fullName: 'Engr. Junaid Babar',
        phone: '0345-9012345',
        email: 'junaid@example.com',
        date: '2025-03-01',
        time: '20:00',
        guests: 6,
        seatingArea: 'Rooftop Flame Lounge',
        specialRequest: 'Anniversary celebration. Please place near ember pit.',
        status: 'confirmed',
        adminNotes: 'Table R-04 assigned, complimentary mint kehwa promised'
      },
      {
        reservationNumber: 'RES-802',
        user: customerUser._id,
        fullName: 'Zainab Afridi',
        phone: '0312-3456789',
        email: 'zainab@example.com',
        date: '2025-03-01',
        time: '21:00',
        guests: 8,
        seatingArea: 'Traditional Dastarkhwan',
        specialRequest: 'Family gathering with elderly grandparents. Ground floor.',
        status: 'pending'
      }
    ]);
    logger.info('✅ Seeded Demo Table Reservations');

    logger.info('====================================================');
    logger.info('🔥 AHMED KHAN RESTAURANT DATABASE SEEDED SUCCESSFULLY!');
    logger.info('Admin Credentials:');
    logger.info('  Email: info.ahmadkhan.com@gmail.com');
    logger.info('  Password: Admin@123');
    logger.info('Customer Credentials:');
    logger.info('  Email: asfandyar@example.com');
    logger.info('  Password: Customer@123');
    logger.info('====================================================');

    process.exit(0);
  } catch (error) {
    logger.error(`Seed failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
