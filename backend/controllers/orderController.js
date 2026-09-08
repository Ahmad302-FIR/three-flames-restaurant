import { Order } from '../models/Order.js';
import { MenuItem } from '../models/MenuItem.js';
import { DeliveryZone } from '../models/DeliveryZone.js';
import { Coupon } from '../models/Coupon.js';
import { getNextSequence } from '../models/Counter.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { emitNewOrder } from '../sockets/orderSocket.js';
import { sendOrderConfirmationEmail } from '../services/emailService.js';

export const createOrder = async (req, res, next) => {
  try {
    const {
      customer,
      orderType,
      deliveryDetails,
      pickupDetails,
      dineInDetails,
      items,
      couponCode,
      paymentMethod,
      specialInstructions
    } = req.body;

    if (!items || !items.length) {
      return sendError(res, 400, 'Cannot place an empty order. Please select at least one dish.');
    }

    // 1. Fetch menu items from DB and verify availability & prices
    const verifiedItems = [];
    let calculatedSubtotal = 0;

    for (const clientItem of items) {
      const quantity = Math.max(1, parseInt(clientItem.quantity, 10) || 1);
      const rawId = clientItem.menuItemId || clientItem.id;

      let menuItem = null;
      if (rawId && rawId.match(/^[0-9a-fA-F]{24}$/)) {
        menuItem = await MenuItem.findById(rawId);
      }
      if (!menuItem && rawId) {
        menuItem = await MenuItem.findOne({ slug: rawId.toLowerCase() });
      }
      if (!menuItem && clientItem.name) {
        menuItem = await MenuItem.findOne({ name: clientItem.name });
      }

      if (!menuItem) {
        return sendError(res, 400, `The requested dish "${clientItem.name || rawId}" does not exist in our current menu catalog.`);
      }

      if (!menuItem.available) {
        return sendError(res, 400, `"${menuItem.name}" is currently sold out and unavailable for ordering. Please remove it from your cart.`);
      }

      // Calculate add-ons price from database schema if present
      let addOnsTotal = 0;
      const verifiedAddOns = [];

      if (Array.isArray(clientItem.selectedAddOns)) {
        for (const selectedAddOn of clientItem.selectedAddOns) {
          const matchedAddOn = (menuItem.addOns || []).find(
            a => a.id === selectedAddOn.id || a.name.toLowerCase() === selectedAddOn.name?.toLowerCase()
          );
          if (matchedAddOn) {
            addOnsTotal += matchedAddOn.price;
            verifiedAddOns.push({
              id: matchedAddOn.id,
              name: matchedAddOn.name,
              price: matchedAddOn.price
            });
          }
        }
      }

      const unitPrice = menuItem.price + addOnsTotal;
      const lineTotal = unitPrice * quantity;
      calculatedSubtotal += lineTotal;

      verifiedItems.push({
        menuItemId: menuItem._id,
        originalMenuItemId: menuItem._id.toString(),
        name: menuItem.name,
        price: unitPrice,
        image: menuItem.image,
        category: menuItem.category,
        quantity,
        serving: menuItem.serving,
        selectedAddOns: verifiedAddOns,
        specialInstructions: clientItem.specialInstructions || '',
        itemTotal: lineTotal
      });
    }

    // 2. Server-side delivery fee calculation
    let deliveryFee = 0;
    let estimatedTime = '35-45 mins';

    if (orderType === 'delivery') {
      const areaName = deliveryDetails?.area;
      if (areaName) {
        const zone = await DeliveryZone.findOne({
          name: new RegExp(`^${areaName}$`, 'i'),
          active: true
        });

        if (zone) {
          deliveryFee = zone.fee;
          estimatedTime = zone.estimatedMinutes || '35-50 mins';
        } else {
          deliveryFee = 150; // default Peshawar delivery tariff
        }
      } else {
        deliveryFee = 150;
      }
    } else if (orderType === 'pickup') {
      deliveryFee = 0;
      estimatedTime = '20-25 mins';
    } else if (orderType === 'dine-in') {
      deliveryFee = 0;
      estimatedTime = 'Table Ready';
    }

    // 3. Server-side coupon discount calculation
    let discount = 0;
    let validCouponCode = '';

    if (couponCode && couponCode.trim()) {
      const normalizedCode = couponCode.trim().toUpperCase();
      const coupon = await Coupon.findOne({ code: normalizedCode, isActive: true });

      if (coupon) {
        const now = new Date();
        const notExpired = !coupon.expiresAt || new Date(coupon.expiresAt) > now;
        const withinLimit = coupon.usageLimit === null || coupon.usedCount < coupon.usageLimit;
        const meetsMin = calculatedSubtotal >= coupon.minOrder;

        if (notExpired && withinLimit && meetsMin) {
          if (coupon.discountType === 'percentage') {
            discount = Math.round((calculatedSubtotal * coupon.discountValue) / 100);
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
              discount = coupon.maxDiscount;
            }
          } else {
            discount = Math.min(coupon.discountValue, calculatedSubtotal);
          }
          validCouponCode = normalizedCode;

          // Increment coupon usage
          await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
        }
      }
    }

    // 4. Calculate final total
    const total = Math.max(0, calculatedSubtotal + deliveryFee - discount);

    // 5. Generate human-readable Order Number (e.g., TF-1043)
    const seq = await getNextSequence('orderNumber', 1042);
    const orderNumber = `TF-${seq}`;

    // 6. Build Initial Timeline
    const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const timeline = [
      { status: 'pending', title: 'Order Received & Queued', timestamp: currentTimeStr, completed: true, note: 'Order placed by diner' },
      { status: 'confirmed', title: 'Order Confirmed by Pitmaster', timestamp: '', completed: false },
      { status: 'preparing', title: 'Grilling on Live Charcoal Flame', timestamp: '', completed: false },
      { status: 'ready', title: orderType === 'delivery' ? 'Packed in Insulated Thermal Box' : 'Ready for Pickup / Dine-in', timestamp: '', completed: false },
      { status: 'out_for_delivery', title: orderType === 'delivery' ? 'Out for Delivery (Rider Dispatched)' : 'Serving at Table', timestamp: '', completed: false },
      { status: 'delivered', title: orderType === 'delivery' ? 'Delivered & Savored' : 'Completed', timestamp: '', completed: false }
    ];

    const newOrder = await Order.create({
      orderNumber,
      user: req.user?._id || null,
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email.toLowerCase()
      },
      orderType,
      deliveryDetails: orderType === 'delivery' ? deliveryDetails : undefined,
      pickupDetails: orderType === 'pickup' ? pickupDetails : undefined,
      dineInDetails: orderType === 'dine-in' ? dineInDetails : undefined,
      items: verifiedItems,
      subtotal: calculatedSubtotal,
      deliveryFee,
      discount,
      couponCode: validCouponCode,
      tax: 0,
      total,
      paymentMethod: paymentMethod || (orderType === 'delivery' ? 'cash_on_delivery' : 'cash_on_pickup'),
      paymentStatus: 'unpaid',
      status: 'pending',
      estimatedTime,
      timeline
    });

    // 7. Emit real-time socket event to Admin kitchen queue
    emitNewOrder(newOrder);

    // 8. Send async confirmation email (non-blocking)
    sendOrderConfirmationEmail(newOrder).catch(() => {});

    return sendSuccess(res, 201, 'Order created successfully', newOrder);
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const query = {
      $or: [
        { user: req.user._id },
        { 'customer.email': req.user.email.toLowerCase() },
        { 'customer.phone': req.user.phone }
      ]
    };

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return sendSuccess(res, 200, 'Orders retrieved successfully', orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let order = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: id.toUpperCase() });
    }

    if (!order) {
      return sendError(res, 404, `Order #${id} not found.`);
    }

    // Role check: If not admin/staff, ensure user owns this order
    const isAdmin = req.user && ['admin', 'superadmin', 'staff'].includes(req.user.role);
    if (!isAdmin) {
      const isOwner =
        (req.user && order.user && order.user.toString() === req.user._id.toString()) ||
        (req.user && order.customer.email.toLowerCase() === req.user.email.toLowerCase());

      if (!isOwner) {
        return sendError(res, 403, 'Unauthorized access to this order details.');
      }
    }

    return sendSuccess(res, 200, 'Order retrieved successfully', order);
  } catch (error) {
    next(error);
  }
};

export const trackOrderByNumber = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const order = await Order.findOne({ orderNumber: orderNumber.toUpperCase() });

    if (!order) {
      return sendError(res, 404, `No order found with tracking number #${orderNumber}. Please verify the code.`);
    }

    return sendSuccess(res, 200, 'Order tracking retrieved', order);
  } catch (error) {
    next(error);
  }
};
