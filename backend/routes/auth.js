import express from 'express';
import {
  register,
  verifyEmailOtp,
  resendEmailOtp,
  login,
  adminLogin,
  getMe,
  updateProfile,
  changePassword,
  logout
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  registerValidation,
  verifyOtpValidation,
  resendOtpValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation
} from '../validators/authValidators.js';

const router = express.Router();

router.post('/register', validate(registerValidation), register);
router.post('/verify-email-otp', validate(verifyOtpValidation), verifyEmailOtp);
router.post('/resend-email-otp', validate(resendOtpValidation), resendEmailOtp);
router.post('/login', validate(loginValidation), login);
router.post('/admin-login', validate(loginValidation), adminLogin);
router.post('/logout', logout);

router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, validate(updateProfileValidation), updateProfile);
router.put('/change-password', authenticate, validate(changePasswordValidation), changePassword);

export default router;
