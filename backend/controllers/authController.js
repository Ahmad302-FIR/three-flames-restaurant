import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { PendingRegistration } from '../models/PendingRegistration.js';
import { generateOtp, hashOtp, verifyOtpHash } from '../utils/otpHelper.js';
import { sendOtpVerificationEmail } from '../services/emailService.js';
import { generateToken } from '../utils/generateToken.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();

    // 1. Check whether email is already registered and verified in User collection
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return sendError(res, 400, 'An account with this email address already exists.');
    }

    // 2. Hash user password with bcrypt before storing in PendingRegistration
    const passwordHash = await bcrypt.hash(password, 12);

    // 3. Generate secure 6-digit OTP and store its hash
    const otp = generateOtp();
    const otpHash = hashOtp(otp, normalizedEmail);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 4. Upsert pending registration record (replaces any previous unverified attempt for this email)
    await PendingRegistration.findOneAndUpdate(
      { email: normalizedEmail },
      {
        name: (name || '').trim(),
        email: normalizedEmail,
        phone: (phone || '').trim(),
        passwordHash,
        otpHash,
        otpExpiresAt,
        otpAttempts: 0,
        lastResendAt: new Date()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // 5. Send OTP to the user's email address
    const emailResult = await sendOtpVerificationEmail({
      name: (name || '').trim(),
      email: normalizedEmail,
      otp
    });

    if (!emailResult) {
      // Clean up pending record if email failed to send
      await PendingRegistration.deleteOne({ email: normalizedEmail });
      return sendError(res, 500, 'Failed to deliver verification email. Please check your email address or try again later.');
    }

    return sendSuccess(res, 200, 'An OTP has been sent to your email address. Please enter it to verify your account.', {
      email: normalizedEmail
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmailOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();
    const cleanOtp = (otp || '').trim();

    const pending = await PendingRegistration.findOne({ email: normalizedEmail });
    if (!pending) {
      return sendError(res, 400, 'No pending registration found or your session has expired. Please register again.');
    }

    // Check expiration
    if (new Date() > pending.otpExpiresAt) {
      return sendError(res, 400, 'Your verification code has expired. Please request a new OTP.');
    }

    // Check maximum attempts (5 attempts limit)
    if (pending.otpAttempts >= 5) {
      return sendError(res, 429, 'Too many incorrect attempts. Please request a new verification code.');
    }

    // Verify OTP hash
    const isOtpValid = verifyOtpHash(cleanOtp, normalizedEmail, pending.otpHash);
    if (!isOtpValid) {
      pending.otpAttempts += 1;
      await pending.save();
      const remaining = 5 - pending.otpAttempts;
      return sendError(
        res,
        400,
        remaining > 0
          ? `Invalid verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
          : 'Too many incorrect attempts. Please request a new verification code.'
      );
    }

    // Check if account was created concurrently
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      await PendingRegistration.deleteOne({ _id: pending._id });
      return sendError(res, 400, 'An account with this email address is already verified. Please log in.');
    }

    // Create permanent customer account in MongoDB
    await User.create({
      name: pending.name,
      email: pending.email,
      phone: pending.phone,
      password: pending.passwordHash,
      role: 'customer',
      emailVerified: true,
      isActive: true
    });

    // Delete pending registration record
    await PendingRegistration.deleteOne({ _id: pending._id });

    // Return success without JWT token (forces manual login)
    return sendSuccess(
      res,
      200,
      'Email verified successfully. Your account has been created. Please log in with your email and password.'
    );
  } catch (error) {
    next(error);
  }
};

export const resendEmailOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();

    // Check if already registered
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return sendError(res, 400, 'An account with this email address is already registered. Please log in.');
    }

    const pending = await PendingRegistration.findOne({ email: normalizedEmail });
    if (!pending) {
      return sendError(res, 404, 'No pending registration found for this email. Please register again.');
    }

    // Enforce 45-second cooldown
    const COOLDOWN_MS = 45 * 1000;
    const elapsed = Date.now() - new Date(pending.lastResendAt).getTime();
    if (elapsed < COOLDOWN_MS) {
      const waitSeconds = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
      return sendError(res, 429, `Please wait ${waitSeconds}s before requesting a new verification code.`);
    }

    // Generate fresh OTP and update expiration
    const newOtp = generateOtp();
    pending.otpHash = hashOtp(newOtp, normalizedEmail);
    pending.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    pending.otpAttempts = 0;
    pending.lastResendAt = new Date();
    await pending.save();

    // Dispatch fresh email
    const emailResult = await sendOtpVerificationEmail({
      name: pending.name,
      email: pending.email,
      otp: newOtp
    });

    if (!emailResult) {
      return sendError(res, 500, 'Failed to send new verification email. Please try again later.');
    }

    return sendSuccess(res, 200, 'A new verification code has been sent to your email.');
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();

    // Must explicitly select password as schema sets select: false
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      // Check if registration is still pending verification
      const pending = await PendingRegistration.findOne({ email: normalizedEmail });
      if (pending) {
        return sendError(res, 403, 'Your email has not been verified yet. Please complete email OTP verification.');
      }
      return sendError(res, 401, 'Invalid email or password.');
    }

    if (!user.isActive) {
      return sendError(res, 403, 'Your account has been deactivated. Please contact restaurant administration.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid email or password.');
    }

    const token = generateToken(user._id, user.role);

    return sendSuccess(res, 200, 'Login successful. Welcome back!', {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        savedAddresses: user.addresses || []
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return sendError(res, 401, 'Invalid administrator credentials.');
    }

    if (!['admin', 'superadmin', 'staff'].includes(user.role)) {
      return sendError(res, 403, 'Access denied. You do not possess administrative clearance.');
    }

    if (!user.isActive) {
      return sendError(res, 403, 'This administrator account is currently suspended.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid administrator credentials.');
    }

    const token = generateToken(user._id, user.role);

    return sendSuccess(res, 200, 'Administrative authentication verified.', {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  return sendSuccess(res, 200, 'Profile fetched successfully', {
    user: {
      id: req.user._id.toString(),
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      avatar: req.user.avatar,
      savedAddresses: req.user.addresses || []
    }
  });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar, savedAddresses } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (avatar !== undefined) updates.avatar = avatar;
    if (savedAddresses) updates.addresses = savedAddresses;

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    return sendSuccess(res, 200, 'Profile updated successfully', {
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        savedAddresses: updatedUser.addresses || []
      }
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return sendError(res, 404, 'User account could not be found.');
    }

    let isMatch = await user.comparePassword(currentPassword);
    // If exact match fails, check trimmed currentPassword in case of accidental copy-paste whitespace
    if (!isMatch && typeof currentPassword === 'string' && currentPassword.trim() !== currentPassword) {
      isMatch = await user.comparePassword(currentPassword.trim());
    }

    if (!isMatch) {
      return sendError(res, 400, 'Incorrect current password provided.');
    }

    user.password = typeof newPassword === 'string' ? newPassword.trim() : newPassword;
    await user.save();

    return sendSuccess(res, 200, 'Password updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  return sendSuccess(res, 200, 'Logged out successfully.');
};
