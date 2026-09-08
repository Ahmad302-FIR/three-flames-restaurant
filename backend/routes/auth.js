import express from 'express';
import {
  register,
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
  loginValidation,
  updateProfileValidation,
  changePasswordValidation
} from '../validators/authValidators.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', validate(loginValidation), login);
router.post('/admin-login', validate(loginValidation), adminLogin);
router.post('/logout', logout);

router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, validate(updateProfileValidation), updateProfile);
router.put('/change-password', authenticate, validate(changePasswordValidation), changePassword);

export default router;
