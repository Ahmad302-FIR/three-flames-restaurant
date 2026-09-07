import { User } from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendError(res, 400, 'An account with this email address already exists.');
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: 'customer'
    });

    const token = generateToken(user._id, user.role);

    return sendSuccess(res, 201, 'Registration successful. Welcome to Three Flames!', {
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

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();

    // Must explicitly select password as schema sets select: false
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
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

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return sendError(res, 400, 'Incorrect current password provided.');
    }

    user.password = newPassword;
    await user.save();

    return sendSuccess(res, 200, 'Password updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  return sendSuccess(res, 200, 'Logged out successfully.');
};
