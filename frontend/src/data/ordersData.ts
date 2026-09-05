import { Order, Reservation } from '../types';

export const initialOrders: Order[] = [
  {
    id: 'TF-1042',
    createdAt: '2026-08-25T11:45:00Z',
    customer: {
      name: 'Asfandyar Khan',
      phone: '0333-9123456',
      email: 'asfandyar@example.com'
    },
    orderType: 'delivery',
    deliveryDetails: {
      fullName: 'Asfandyar Khan',
      phone: '0333-9123456',
      email: 'asfandyar@example.com',
      address: 'House #42, Street 3, Sector B-2, Phase 5',
      area: 'Hayatabad',
      landmark: 'Near Tatara Park Gate 2',
      instructions: 'Please call before arriving at the security barrier.'
    },
    items: [
      {
        id: 'sajji-chicken-full-1',
        menuItemId: 'sajji-chicken-full',
        name: 'Special Chicken Sajji (Full)',
        price: 1800,
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=900&auto=format&fit=crop',
        category: 'sajji',
        quantity: 1,
        serving: '3-4 Persons',
        selectedAddOns: [
          { id: 'addon-raita', name: 'Mint & Zeera Raita', price: 90 },
          { id: 'addon-naan', name: 'Roghni Roghani Naan (2 pcs)', price: 160 }
        ],
        itemTotal: 2050
      },
      {
        id: 'bbq-mutton-seekh-1',
        menuItemId: 'bbq-mutton-seekh',
        name: 'Charcoal Mutton Seekh Kebab',
        price: 1150,
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=900&auto=format&fit=crop',
        category: 'seekh-kebab',
        quantity: 2,
        serving: '4 Skewers (2 Persons)',
        selectedAddOns: [],
        itemTotal: 2300
      }
    ],
    subtotal: 4350,
    deliveryFee: 200,
    discount: 435,
    couponCode: 'FLAME10',
    tax: 0,
    total: 4115,
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'unpaid',
    status: 'preparing',
    estimatedTime: '30-45 minutes',
    timeline: [
      {
        status: 'pending',
        title: 'Order Received',
        timestamp: '11:45 AM',
        completed: true,
        note: 'Order successfully logged into Three Flames kitchen system.'
      },
      {
        status: 'confirmed',
        title: 'Order Confirmed by Restaurant',
        timestamp: '11:48 AM',
        completed: true,
        note: 'Head Chef confirmed fresh grill preparation.'
      },
      {
        status: 'preparing',
        title: 'Flaming & Grilling',
        timestamp: '11:52 AM',
        completed: true,
        note: 'Skewers currently roasting over glowing charcoal.'
      },
      {
        status: 'ready',
        title: 'Quality Check & Insulated Packing',
        timestamp: 'Pending',
        completed: false,
        note: 'Sealing in thermal foil containers.'
      },
      {
        status: 'out_for_delivery',
        title: 'Rider Out on Route',
        timestamp: 'Pending',
        completed: false,
        note: 'Delivery rider en route to Hayatabad.'
      },
      {
        status: 'delivered',
        title: 'Delivered Hot & Fresh',
        timestamp: 'Pending',
        completed: false,
        note: 'Order handed over to customer.'
      }
    ]
  },
  {
    id: 'TF-1041',
    createdAt: '2026-08-25T11:15:00Z',
    customer: {
      name: 'Maryam Khattak',
      phone: '0300-5544332',
      email: 'maryam@example.com'
    },
    orderType: 'pickup',
    pickupDetails: {
      fullName: 'Maryam Khattak',
      phone: '0300-5544332',
      pickupTime: '12:15 PM',
      instructions: 'Please pack the gravy karahi separately.'
    },
    items: [
      {
        id: 'karahi-chicken-half-1',
        menuItemId: 'karahi-chicken-half',
        name: 'Special Desi Ghee Chicken Karahi (Half kg)',
        price: 1100,
        image: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?q=80&w=900&auto=format&fit=crop',
        category: 'karahi',
        quantity: 1,
        serving: '2 Persons',
        itemTotal: 1100
      },
      {
        id: 'rice-kabuli-pulao-1',
        menuItemId: 'rice-kabuli-pulao',
        name: 'Special Peshawari Kabuli Pulao',
        price: 1250,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=900&auto=format&fit=crop',
        category: 'rice',
        quantity: 1,
        serving: '2 Persons',
        itemTotal: 1250
      }
    ],
    subtotal: 2350,
    deliveryFee: 0,
    discount: 0,
    tax: 0,
    total: 2350,
    paymentMethod: 'cash_on_pickup',
    paymentStatus: 'unpaid',
    status: 'ready',
    estimatedTime: 'Ready for Collection',
    timeline: [
      { status: 'pending', title: 'Order Received', timestamp: '11:15 AM', completed: true },
      { status: 'confirmed', title: 'Confirmed', timestamp: '11:18 AM', completed: true },
      { status: 'preparing', title: 'Cooked & Plated', timestamp: '11:35 AM', completed: true },
      { status: 'ready', title: 'Ready at Counter', timestamp: '11:42 AM', completed: true }
    ]
  },
  {
    id: 'TF-1040',
    createdAt: '2026-08-25T10:30:00Z',
    customer: {
      name: 'Dr. Bilal Yousafzai',
      phone: '0345-9876543',
      email: 'bilal@example.com'
    },
    orderType: 'delivery',
    deliveryDetails: {
      fullName: 'Dr. Bilal Yousafzai',
      phone: '0345-9876543',
      address: 'House #12, Abdara Road',
      area: 'University Town',
      landmark: 'Opposite Town Club',
      instructions: 'Deliver to front reception gate.'
    },
    items: [
      {
        id: 'special-grand-platter-1',
        menuItemId: 'special-grand-platter',
        name: 'Three Flames Royal BBQ Platter (Grand Feast)',
        price: 4900,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=900&auto=format&fit=crop',
        category: 'specials',
        quantity: 1,
        serving: '5-6 Persons',
        itemTotal: 4900
      }
    ],
    subtotal: 4900,
    deliveryFee: 150,
    discount: 500,
    couponCode: 'BBQFEST',
    tax: 0,
    total: 4550,
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'paid',
    status: 'delivered',
    estimatedTime: 'Delivered',
    timeline: [
      { status: 'pending', title: 'Order Received', timestamp: '10:30 AM', completed: true },
      { status: 'confirmed', title: 'Confirmed', timestamp: '10:32 AM', completed: true },
      { status: 'preparing', title: 'Prepared', timestamp: '10:55 AM', completed: true },
      { status: 'ready', title: 'Packed', timestamp: '11:05 AM', completed: true },
      { status: 'out_for_delivery', title: 'Out for Delivery', timestamp: '11:10 AM', completed: true },
      { status: 'delivered', title: 'Delivered', timestamp: '11:28 AM', completed: true }
    ]
  },
  {
    id: 'TF-1039',
    createdAt: '2026-08-24T20:15:00Z',
    customer: {
      name: 'Zainab Afridi',
      phone: '0321-1234567',
      email: 'zainab@example.com'
    },
    orderType: 'dine-in',
    dineInDetails: {
      fullName: 'Zainab Afridi',
      phone: '0321-1234567',
      guests: 4,
      preferredTime: '08:30 PM',
      tableNumber: 'Table 7 (Flame Lounge)'
    },
    items: [
      {
        id: 'karahi-mutton-shinwari-1',
        menuItemId: 'karahi-mutton-shinwari',
        name: 'Shinwari Mutton Karahi (Full kg)',
        price: 3400,
        image: 'https://images.unsplash.com/photo-1545247181-516773cae7be?q=80&w=900&auto=format&fit=crop',
        category: 'karahi',
        quantity: 1,
        serving: '3-4 Persons',
        itemTotal: 3400
      },
      {
        id: 'bbq-mutton-seekh-2',
        menuItemId: 'bbq-mutton-seekh',
        name: 'Charcoal Mutton Seekh Kebab',
        price: 1150,
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=900&auto=format&fit=crop',
        category: 'seekh-kebab',
        quantity: 1,
        serving: '4 Skewers (2 Persons)',
        itemTotal: 1150
      }
    ],
    subtotal: 4550,
    deliveryFee: 0,
    discount: 0,
    tax: 0,
    total: 4550,
    paymentMethod: 'card_at_counter',
    paymentStatus: 'paid',
    status: 'delivered',
    estimatedTime: 'Completed',
    timeline: [
      { status: 'pending', title: 'Placed at Table', timestamp: '08:15 PM', completed: true },
      { status: 'confirmed', title: 'Kitchen Accepted', timestamp: '08:17 PM', completed: true },
      { status: 'preparing', title: 'Wok Sizzling', timestamp: '08:25 PM', completed: true },
      { status: 'delivered', title: 'Served at Table', timestamp: '08:45 PM', completed: true }
    ]
  },
  {
    id: 'TF-1038',
    createdAt: '2026-08-24T19:40:00Z',
    customer: {
      name: 'Shahid Mehmood',
      phone: '0332-8877665',
      email: 'shahid@example.com'
    },
    orderType: 'delivery',
    deliveryDetails: {
      fullName: 'Shahid Mehmood',
      phone: '0332-8877665',
      address: 'Apartment 4B, Deans Heights, Saddar',
      area: 'Peshawar Cantt',
      landmark: 'Near Deans Trade Center'
    },
    items: [
      {
        id: 'bbq-chapli-kebab-1',
        menuItemId: 'bbq-chapli-kebab',
        name: 'Peshawari Special Chapli Kebab (Beef)',
        price: 950,
        image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=900&auto=format&fit=crop',
        category: 'seekh-kebab',
        quantity: 2,
        serving: '2 Large Patties (2 Persons)',
        itemTotal: 1900
      }
    ],
    subtotal: 1900,
    deliveryFee: 200,
    discount: 0,
    tax: 0,
    total: 2100,
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'paid',
    status: 'delivered',
    estimatedTime: 'Delivered',
    timeline: [
      { status: 'pending', title: 'Order Received', timestamp: '07:40 PM', completed: true },
      { status: 'delivered', title: 'Delivered', timestamp: '08:20 PM', completed: true }
    ]
  }
];

export const initialReservations: Reservation[] = [
  {
    id: 'RES-801',
    fullName: 'Hamza Tariq',
    phone: '0300-1122334',
    email: 'hamza.t@example.com',
    date: '2026-08-26',
    time: '08:00 PM',
    guests: 6,
    seatingArea: 'Rooftop Flame Lounge',
    specialRequest: 'Celebrating wedding anniversary. Requesting corner view table with flame heater.',
    status: 'confirmed',
    createdAt: '2026-08-25T10:00:00Z',
    adminNotes: 'Assigned Table R-04 with complimentary welcome kahwa.'
  },
  {
    id: 'RES-802',
    fullName: 'Zainab Afridi',
    phone: '0321-1234567',
    email: 'zainab@example.com',
    date: '2026-08-27',
    time: '07:30 PM',
    guests: 8,
    seatingArea: 'Traditional Dastarkhwan',
    specialRequest: 'Grand family dinner with elderly parents. Please ensure plush floor cushions.',
    status: 'confirmed',
    createdAt: '2026-08-25T09:15:00Z',
    adminNotes: 'Dastarkhwan Hall A booked.'
  },
  {
    id: 'RES-803',
    fullName: 'Dr. Bilal Yousafzai',
    phone: '0345-9876543',
    email: 'bilal@example.com',
    date: '2026-08-28',
    time: '01:30 PM',
    guests: 4,
    seatingArea: 'Executive Dining',
    specialRequest: 'Business lunch meeting. Quiet ambiance required.',
    status: 'pending',
    createdAt: '2026-08-25T11:20:00Z'
  },
  {
    id: 'RES-804',
    fullName: 'Sardar Usman Shinwari',
    phone: '0333-7788990',
    email: 'usman.s@example.com',
    date: '2026-08-29',
    time: '09:00 PM',
    guests: 12,
    seatingArea: 'Indoor Family Hall',
    specialRequest: 'Pre-order 2 Full Raan Sajji on arrival.',
    status: 'confirmed',
    createdAt: '2026-08-24T18:00:00Z'
  },
  {
    id: 'RES-805',
    fullName: 'Ayesha Durrani',
    phone: '0334-5566778',
    email: 'ayesha.d@example.com',
    date: '2026-08-25',
    time: '08:30 PM',
    guests: 2,
    seatingArea: 'Rooftop Flame Lounge',
    specialRequest: 'Romantic candlelight table.',
    status: 'confirmed',
    createdAt: '2026-08-25T08:30:00Z'
  }
];
