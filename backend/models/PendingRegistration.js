import mongoose from 'mongoose';

const pendingRegistrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required']
    },
    otpHash: {
      type: String,
      required: [true, 'OTP hash is required']
    },
    otpExpiresAt: {
      type: Date,
      required: true
    },
    otpAttempts: {
      type: Number,
      default: 0
    },
    lastResendAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// TTL index to automatically purge abandoned pending registrations after 24 hours (86400 seconds)
pendingRegistrationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export const PendingRegistration = mongoose.model('PendingRegistration', pendingRegistrationSchema);
