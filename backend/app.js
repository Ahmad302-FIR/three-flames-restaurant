import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

// Route imports
import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';
import adminOrderRoutes from './routes/adminOrders.js';
import reservationRoutes from './routes/reservations.js';
import adminReservationRoutes from './routes/adminReservations.js';
import reviewRoutes from './routes/reviews.js';
import galleryRoutes from './routes/gallery.js';
import deliveryZoneRoutes from './routes/deliveryZones.js';
import couponRoutes from './routes/coupons.js';
import contactRoutes from './routes/contact.js';
import settingsRoutes from './routes/settings.js';
import dashboardRoutes from './routes/dashboard.js';
import healthRoutes from './routes/health.js';

const app = express();

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS Configuration
const parseAllowedOrigins = () => {
  const defaults = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ];

  const clientUrls = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/+$/, '')).filter(Boolean)
    : [];

  return Array.from(new Set([...clientUrls, ...defaults]));
};

const allowedOrigins = parseAllowedOrigins();

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/+$/, '');

    // Allow in non-production, if origin matches configured list, or matches Vercel deployment preview domain
    const isAllowed =
      process.env.NODE_ENV !== 'production' ||
      allowedOrigins.includes(normalizedOrigin) ||
      (normalizedOrigin.endsWith('.vercel.app') && allowedOrigins.some((u) => u.includes('vercel.app')));

    if (isAllowed) {
      callback(null, true);
    } else {
      logger.warn(`Blocked by CORS policy: ${origin}`);
      callback(new Error('CORS policy violation: Origin not allowed.'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api', generalLimiter);
app.use('/api/auth', authLimiter);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Root Health Endpoint (Requirement 4)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Three Flames Restaurant API is running'
  });
});

// API Routes Mounting
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/admin/reservations', adminReservationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/delivery-zones', deliveryZoneRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/admin/customers', (req, res, next) => {
  // Shortcut redirect to dashboard/customers
  req.url = '/customers';
  dashboardRoutes(req, res, next);
});

// Handle 404 for unhandled API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Handler
app.use(errorHandler);

export default app;
