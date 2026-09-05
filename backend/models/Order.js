import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: false
    },
    originalMenuItemId: {
      type: String
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    image: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: ''
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    serving: {
      type: String,
      default: ''
    },
    selectedAddOns: [
      {
        id: String,
        name: String,
        price: Number
      }
    ],
    specialInstructions: {
      type: String,
      default: ''
    },
    itemTotal: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

const timelineSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    timestamp: {
      type: String,
      default: () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    completed: {
      type: Boolean,
      default: false
    },
    note: {
      type: String,
      default: ''
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true
    },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true }
    },
    orderType: {
      type: String,
      enum: ['delivery', 'pickup', 'dine-in'],
      required: true,
      index: true
    },
    deliveryDetails: {
      fullName: String,
      phone: String,
      email: String,
      address: String,
      area: String,
      landmark: String,
      instructions: String
    },
    pickupDetails: {
      fullName: String,
      phone: String,
      pickupTime: String,
      instructions: String
    },
    dineInDetails: {
      fullName: String,
      phone: String,
      guests: Number,
      preferredTime: String,
      tableNumber: String,
      specialRequests: String
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    couponCode: {
      type: String,
      default: ''
    },
    tax: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    paymentMethod: {
      type: String,
      enum: ['cash_on_delivery', 'cash_on_pickup', 'card_at_counter', 'online_easypaisa_jazzcash', 'stripe'],
      default: 'cash_on_delivery'
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'failed', 'refunded'],
      default: 'unpaid'
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending',
      index: true
    },
    estimatedTime: {
      type: String,
      default: '35-45 mins'
    },
    timeline: [timelineSchema]
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.orderNumber;
        ret._dbId = ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const Order = mongoose.model('Order', orderSchema);
