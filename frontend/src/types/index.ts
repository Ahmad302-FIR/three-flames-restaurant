export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewsCount: number;
  serving: string;
  prepTime: string;
  spiceLevel?: 'Mild' | 'Medium' | 'Hot' | 'Extra Hot';
  available: boolean;
  featured: boolean;
  isSpecial?: boolean;
  tags: string[];
  ingredients?: string[];
  addOns?: {
    id: string;
    name: string;
    price: number;
  }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  itemCount?: number;
  image?: string;
}

export interface CartAddOn {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string; // menuItemId + addOns combined key
  menuItemId: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  serving: string;
  selectedAddOns?: CartAddOn[];
  specialInstructions?: string;
  itemTotal: number;
}

export type OrderType = 'delivery' | 'pickup' | 'dine-in';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cash_on_delivery' | 'cash_on_pickup' | 'card_at_counter' | 'online_easypaisa_jazzcash';

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  area: string;
  landmark?: string;
  instructions?: string;
}

export interface PickupDetails {
  fullName: string;
  phone: string;
  pickupTime: string;
  instructions?: string;
}

export interface DineInDetails {
  fullName: string;
  phone: string;
  guests: number;
  preferredTime: string;
  tableNumber?: string;
  specialRequests?: string;
}

export interface Order {
  id: string; // e.g. TF-1042
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  orderType: OrderType;
  deliveryDetails?: DeliveryAddress;
  pickupDetails?: PickupDetails;
  dineInDetails?: DineInDetails;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'unpaid' | 'paid';
  status: OrderStatus;
  estimatedTime: string;
  timeline: {
    status: OrderStatus;
    title: string;
    timestamp: string;
    completed: boolean;
    note?: string;
  }[];
}

export type ReservationStatus = 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  seatingArea: string;
  specialRequest?: string;
  status: ReservationStatus;
  createdAt: string;
  adminNotes?: string;
}

export interface Review {
  id: string;
  customerName: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  dishesMentioned?: string[];
  verifiedCustomer: boolean;
  status: 'approved' | 'pending' | 'hidden';
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'restaurant' | 'bbq' | 'sajji' | 'karahi' | 'kebab' | 'specials';
  image: string;
  featured: boolean;
  description?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'active' | 'vip' | 'inactive';
  joinedDate: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  minOrder: number;
  estimatedMinutes: string;
  active: boolean;
}

export interface Offer {
  id: string;
  code: string;
  title: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  expiresAt: string;
  isActive: boolean;
  description: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'customer' | 'admin' | 'superadmin' | 'staff';
  savedAddresses?: {
    id: string;
    label: string;
    address: string;
    area: string;
    landmark?: string;
  }[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
}
