import { restaurantInfo } from '../data/restaurantData';
import { CartItem, OrderType } from '../types';

export interface WhatsAppOrderDetails {
  customerName?: string;
  phone?: string;
  orderType: OrderType;
  deliveryAddress?: string;
  deliveryArea?: string;
  landmark?: string;
  items: CartItem[];
  subtotal: number;
  deliveryCharges?: number;
  discount?: number;
  couponCode?: string;
  total: number;
  specialInstructions?: string;
}

/**
 * Formats order items and customer delivery details into the required WhatsApp order message.
 */
export const buildWhatsAppOrderMessage = (details: WhatsAppOrderDetails): string => {
  const itemsText = (details.items || [])
    .map((item) => `${item.name} x ${item.quantity} — Rs. ${item.itemTotal.toLocaleString()}`)
    .join('\n');

  const customerName = details.customerName?.trim() || 'Guest';
  const customerPhone = details.phone?.trim() || 'N/A';

  let formattedAddress = 'N/A';
  if (details.orderType === 'delivery') {
    const parts = [
      details.deliveryAddress?.trim(),
      details.deliveryArea?.trim(),
      details.landmark?.trim() ? `Near: ${details.landmark.trim()}` : null,
    ].filter(Boolean);
    formattedAddress = parts.length > 0 ? parts.join(', ') : 'Delivery address not provided';
  } else if (details.orderType === 'pickup') {
    formattedAddress = 'Store Pickup (Bilour Chowk, University Town, Peshawar)';
  } else {
    formattedAddress = 'Dine-In Reservation';
  }

  const lines = [
    'Three Flames Restaurant - New Order',
    `Customer Name: ${customerName}`,
    'Order Items:',
    itemsText,
    `Subtotal: Rs. ${details.subtotal.toLocaleString()}`,
    `Delivery Charges: Rs. ${(details.deliveryCharges || 0).toLocaleString()}`,
  ];

  if (details.discount && details.discount > 0) {
    lines.push(`Discount${details.couponCode ? ` (${details.couponCode})` : ''}: - Rs. ${details.discount.toLocaleString()}`);
  }

  lines.push(
    `Total: Rs. ${details.total.toLocaleString()}`,
    `Delivery / Pickup: ${details.orderType === 'delivery' ? 'Delivery' : details.orderType === 'pickup' ? 'Pickup' : 'Dine-In'}`,
    `Address: ${formattedAddress}`,
    `Phone: ${customerPhone}`
  );

  if (details.specialInstructions?.trim()) {
    lines.push(`Special Instructions: ${details.specialInstructions.trim()}`);
  }

  lines.push('Please confirm my order.');

  return lines.join('\n');
};

/**
 * Encodes the WhatsApp message and returns the full wa.me link.
 */
export const getWhatsAppOrderUrl = (details: WhatsAppOrderDetails): string => {
  const message = buildWhatsAppOrderMessage(details);
  return `https://wa.me/${restaurantInfo.whatsapp}?text=${encodeURIComponent(message)}`;
};

/**
 * Encodes the WhatsApp message and opens WhatsApp Web / mobile app.
 */
export const openWhatsAppOrder = (details: WhatsAppOrderDetails): string => {
  const whatsappUrl = getWhatsAppOrderUrl(details);
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  return whatsappUrl;
};
