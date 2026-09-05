import mongoose from 'mongoose';

const deliveryZoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Zone name is required'],
      unique: true,
      trim: true
    },
    fee: {
      type: Number,
      required: [true, 'Delivery fee is required'],
      min: [0, 'Fee cannot be negative']
    },
    minOrder: {
      type: Number,
      required: [true, 'Minimum order amount is required'],
      min: [0, 'Minimum order cannot be negative']
    },
    estimatedMinutes: {
      type: String,
      default: '30-45 mins'
    },
    active: {
      type: Boolean,
      default: true,
      index: true
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

export const DeliveryZone = mongoose.model('DeliveryZone', deliveryZoneSchema);
