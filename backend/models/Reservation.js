import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    reservationNumber: {
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
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true
    },
    date: {
      type: String,
      required: [true, 'Reservation date is required'],
      index: true
    },
    time: {
      type: String,
      required: [true, 'Reservation time is required']
    },
    guests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'Guests must be at least 1'],
      max: [50, 'Guests cannot exceed 50']
    },
    seatingArea: {
      type: String,
      default: 'Indoor Family Hall'
    },
    specialRequest: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
      index: true
    },
    adminNotes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.reservationNumber;
        ret._dbId = ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

reservationSchema.index({ date: 1, time: 1, seatingArea: 1 });

export const Reservation = mongoose.model('Reservation', reservationSchema);
