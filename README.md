# 🔥 Three Flames Restaurant — Full-Stack MERN Platform
> *"WHERE TASTE MEETS FLAME"*

A production-grade full-stack MERN restaurant management and food ordering platform crafted for **Three Flames Restaurant** in Peshawar, Pakistan.

---

## 📋 Table of Contents
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Directory Structure](#project-directory-structure)
- [Environment Configuration](#environment-configuration)
- [Installation & Quickstart](#installation--quickstart)
- [Database Setup & Seeding](#database-setup--seeding)
- [Demo Credentials](#demo-credentials)
- [API Documentation & Endpoints](#api-documentation--endpoints)
- [Real-Time Socket.IO System](#real-time-socketio-system)
- [Security & Validation Architecture](#security--validation-architecture)
- [Production Deployment Guide](#production-deployment-guide)

---

## 🏛️ Architecture Overview

The system is architected around a decoupled client-server model:
1. **Frontend (Client)**: React 19, TypeScript, Vite, Tailwind CSS, Redux Toolkit, React Router v7, Lucide Icons, Canvas Confetti, Recharts.
2. **Backend (API & WebSockets)**: Node.js, Express.js (ES Modules), Mongoose, Socket.IO, Winston Logger.
3. **Database**: MongoDB (Atlas or local replica set) with 13 data models, indexing, and auto-increment sequence counters.
4. **Cloud Media**: Cloudinary SDK with Multer stream upload and asset lifecycle management.
5. **Transactional Email**: Nodemailer SMTP with branded HTML templates.

```
┌─────────────────────────────────────────────────────────┐
│              Client (React 19 + Redux)                  │
│   Public Storefront  │  Customer Portal  │ Admin Suite   │
└───────────────▲─────────────────────────▲───────────────┘
                │ HTTP REST (Axios)       │ WebSockets (Socket.IO)
┌───────────────▼─────────────────────────▼───────────────┐
│               Node.js + Express API                     │
│  Security: Helmet • CORS • Rate Limit • JWT • Bcrypt    │
│  Controllers • Validation • Error Handler • Winston     │
└───────────────▲─────────────────▲───────────────▲───────┘
                │                 │               │
        ┌───────▼──────┐  ┌───────▼──────┐  ┌─────▼─────┐
        │   MongoDB    │  │  Cloudinary  │  │   SMTP    │
        │ 13 Mongoose  │  │ Image Storage│  │Nodemailer │
        │    Models    │  │  & Delivery  │  │  Emails   │
        └──────────────┘  └──────────────┘  └───────────┘
```

---

## 💻 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Redux Toolkit |
| **Backend** | Node.js (v20+), Express.js 4.x (ESM) |
| **Database** | MongoDB 7.x, Mongoose 8.x |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js (12 salt rounds) |
| **Real-Time** | Socket.IO 4.x (Room-based isolation) |
| **Media Storage**| Cloudinary 2.x |
| **Notifications**| Nodemailer 6.x (HTML responsive templates) |
| **Security** | Helmet 8.x, Express-Rate-Limit 7.x, CORS, Input Sanitization |
| **Validation** | Express-Validator 7.x, Zod |
| **Logging** | Winston 3.x (Sensitive credential masking) |

---

## 📂 Project Directory Structure

```
three-flames-restaurant/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── authController.js     # Register, login, profile, password
│   │   ├── menuController.js     # Menu items CRUD & availability
│   │   ├── categoryController.js # Food categories
│   │   ├── orderController.js    # Order placement & price calculation
│   │   ├── adminOrderController.js# Admin kitchen queue & status transitions
│   │   ├── reservationController.js# Table booking & capacity checks
│   │   ├── reviewController.js   # Customer feedback & moderation
│   │   ├── galleryController.js  # Photo gallery & Cloudinary
│   │   ├── deliveryZoneController.js# Peshawar delivery logistics
│   │   ├── couponController.js   # Promo voucher validation & creation
│   │   ├── contactController.js  # Inquiry messages & email notifications
│   │   ├── settingsController.js # Restaurant business information
│   │   └── dashboardController.js# KPI aggregations & analytics
│   ├── middleware/
│   │   ├── auth.js               # authenticate, authorize, optionalAuthenticate
│   │   ├── errorHandler.js       # Centralized error handler
│   │   ├── upload.js             # Multer memory storage (5MB limit)
│   │   └── validate.js           # express-validator result handler
│   ├── models/
│   │   ├── User.js               # Customer, staff, admin, superadmin
│   │   ├── MenuItem.js           # Dishes, add-ons, pricing, spice levels
│   │   ├── Category.js           # Food categories
│   │   ├── Order.js              # Orders, items snapshot, timeline, status
│   │   ├── Reservation.js        # Table bookings & seating zones
│   │   ├── Review.js             # Verified diner reviews
│   │   ├── GalleryImage.js       # Visual gallery
│   │   ├── DeliveryZone.js       # Delivery sectors, fees & minimum orders
│   │   ├── Coupon.js             # Discount codes (percentage/fixed)
│   │   ├── ContactMessage.js     # Inquiries
│   │   ├── RestaurantSettings.js # Singleton restaurant profile
│   │   ├── Notification.js       # In-app notifications
│   │   └── Counter.js            # Auto-increment sequences (TF-1001, RES-801)
│   ├── routes/                   # Clean REST route definitions
│   ├── services/
│   │   ├── cloudinaryService.js  # Cloudinary upload & asset deletion
│   │   └── emailService.js       # Order & reservation confirmation emails
│   ├── sockets/
│   │   └── orderSocket.js        # Real-time WebSocket room manager
│   ├── utils/
│   │   ├── apiResponse.js        # Standardized { success, message, data }
│   │   ├── generateToken.js      # JWT token signer
│   │   └── logger.js             # Winston logger with data masking
│   ├── validators/               # Input validation chains
│   ├── app.js                    # Express app configuration
│   ├── server.js                 # HTTP & Socket.IO server entrypoint
│   ├── seed.js                   # Comprehensive database seed script
│   ├── package.json
│   └── .env.example
├── src/                          # Frontend React Application
│   ├── components/               # Admin, Cart, Common, Home, Layout, Menu
│   ├── pages/                    # 17 public & admin pages
│   ├── services/                 # Centralized Axios API & Socket client
│   ├── store/                    # Redux Toolkit (auth, cart, ui)
│   └── types/                    # Domain TypeScript interfaces
├── .env.example
├── package.json
└── vite.config.ts
```

---

## ⚙️ Environment Configuration

### Backend Environment Variables (`backend/.env`)

Copy `backend/.env.example` to `backend/.env`:

```env
# SERVER CONFIGURATION
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# DATABASE CONFIGURATION
# For local MongoDB: mongodb://127.0.0.1:27017/three-flames
# For MongoDB Atlas: mongodb+srv://<username>:<password>@cluster.mongodb.net/three-flames?retryWrites=true&w=majority
MONGODB_URI=mongodb://127.0.0.1:27017/three-flames

# AUTHENTICATION (JWT)
JWT_SECRET=threeflames_secret_jwt_key_restaurant_2026_production_grade
JWT_EXPIRES_IN=7d

# CLOUDINARY CONFIGURATION (Required for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# SMTP EMAIL CONFIGURATION (Optional - logs to console if omitted)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=Three Flames Restaurant <info@threeflames.pk>
```

### Frontend Environment Variables (`.env`)

Copy `.env.example` to `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🚀 Installation & Quickstart

### 1. Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Seed Database

Ensure your MongoDB instance is running (or configure `MONGODB_URI` in `backend/.env` with your MongoDB Atlas cluster URI), then run:

```bash
cd backend
npm run seed
cd ..
```

### 3. Run Development Servers

**Start Backend Server:**
```bash
cd backend
npm run dev
# Server running on http://localhost:5000
```

**Start Frontend Server:**
```bash
cd frontend
npm run dev
# Client running on http://localhost:3000
```

---

## 🔑 Demo Credentials

After running `npm run seed` in `backend/`:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Super Admin** | `admin@threeflames.pk` | `Admin@123` | Full Administrative & Operations Access |
| **Kitchen Staff** | `staff@threeflames.pk` | `Staff@123` | Kitchen Orders & Reservations Queue |
| **Diner (Customer)** | `asfandyar@example.com` | `Customer@123` | Orders, Reservations, Profile |

> ⚠️ **IMPORTANT**: Change demo passwords before deploying to a production public server.

---

## 📡 API Documentation & Endpoints

All responses conform to the standard schema:
- **Success**: `{ "success": true, "message": "...", "data": { ... } }`
- **Error**: `{ "success": false, "message": "...", "errors": [ ... ] }`

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new customer profile
- `POST /api/auth/login` — Sign in customer
- `POST /api/auth/admin-login` — Sign in admin/staff with role verification
- `POST /api/auth/logout` — Invalidate session
- `GET  /api/auth/me` — Get authenticated user details *(Bearer Token)*
- `PUT  /api/auth/profile` — Update address, phone, name *(Bearer Token)*
- `PUT  /api/auth/change-password` — Change password *(Bearer Token)*

### Menu Catalog (`/api/menu`)
- `GET    /api/menu` — List items (filter by `category`, `search`, `featured`, `available`)
- `GET    /api/menu/:id` — Get dish details by ID or slug
- `POST   /api/menu` — Create dish *(Admin/Staff + Multipart Image)*
- `PUT    /api/menu/:id` — Update dish *(Admin/Staff + Multipart Image)*
- `DELETE /api/menu/:id` — Delete dish *(Admin)*
- `PATCH  /api/menu/:id/availability` — Toggle In Stock / Sold Out *(Admin/Staff)*

### Categories (`/api/categories`)
- `GET    /api/categories` — List all categories
- `POST   /api/categories` — Create category *(Admin)*
- `PUT    /api/categories/:id` — Update category *(Admin)*
- `DELETE /api/categories/:id` — Delete category *(Admin)*

### Orders (`/api/orders`)
- `POST   /api/orders` — Place new order (calculates totals on server, verifies availability)
- `GET    /api/orders/my-orders` — Customer order history *(Bearer Token)*
- `GET    /api/orders/track/:orderNumber` — Public tracking radar (e.g. `TF-1042`)
- `GET    /api/orders/:id` — Full order details *(Owner or Admin)*

### Admin Orders (`/api/admin/orders`)
- `GET    /api/admin/orders` — Full kitchen queue (filters: `status`, `search`) *(Admin/Staff)*
- `GET    /api/admin/orders/:id` — Kitchen order ticket (KOT) details *(Admin/Staff)*
- `PATCH  /api/admin/orders/:id/status` — Advance status + emit Socket.IO event *(Admin/Staff)*

### Reservations (`/api/reservations`)
- `POST   /api/reservations` — Book table with conflict & capacity prevention
- `GET    /api/reservations/my-reservations` — Customer bookings *(Bearer Token)*
- `GET    /api/reservations/admin/all` — Admin reservation desk *(Admin/Staff)*
- `PATCH  /api/reservations/admin/:id/status` — Confirm, Complete, or Cancel *(Admin/Staff)*

### Delivery Zones (`/api/delivery-zones`)
- `GET    /api/delivery-zones` — Active delivery sectors & tariffs
- `POST   /api/delivery-zones` — Add delivery sector *(Admin)*
- `PUT    /api/delivery-zones/sync` — Bulk update sectors *(Admin)*
- `PUT    /api/delivery-zones/:id` — Toggle active / change fee *(Admin)*
- `DELETE /api/delivery-zones/:id` — Remove sector *(Admin)*

### Coupons & Offers (`/api/coupons`)
- `POST   /api/coupons/validate` — Server-side voucher verification & discount computation
- `GET    /api/coupons/admin/all` — List all promotions *(Admin)*
- `POST   /api/coupons/admin` — Create promotion *(Admin)*
- `PUT    /api/coupons/admin/:id` — Update / deactivate promotion *(Admin)*
- `DELETE /api/coupons/admin/:id` — Delete promotion *(Admin)*

### Reviews (`/api/reviews`)
- `GET    /api/reviews` — Approved diner reviews
- `POST   /api/reviews` — Submit verified review *(Bearer Token)*
- `GET    /api/reviews/admin/all` — Moderation dashboard *(Admin/Staff)*
- `PATCH  /api/reviews/admin/:id/status` — Approve or Hide review *(Admin/Staff)*
- `DELETE /api/reviews/admin/:id` — Delete review *(Admin)*

### Gallery (`/api/gallery`)
- `GET    /api/gallery` — Visual gallery items
- `POST   /api/gallery` — Upload photo with Cloudinary *(Admin/Staff)*
- `DELETE /api/gallery/:id` — Delete photo and remove from Cloudinary *(Admin)*

### Contact & Inquiries (`/api/contact`)
- `POST   /api/contact` — Submit inquiry + send email alert
- `GET    /api/contact/admin/all` — Inquiries desk *(Admin/Staff)*
- `PATCH  /api/contact/admin/:id/read` — Mark inquiry read *(Admin/Staff)*

### Restaurant Settings & Analytics (`/api/settings`, `/api/admin/dashboard`)
- `GET    /api/settings` — Public restaurant profile & opening hours
- `PUT    /api/settings` — Update restaurant information *(Admin)*
- `GET    /api/admin/dashboard/stats` — Real-time business KPIs *(Admin/Staff)*
- `GET    /api/admin/dashboard/charts` — Sales trends compatible with Recharts *(Admin/Staff)*
- `GET    /api/admin/dashboard/order-distribution` — Fulfillment breakdown *(Admin/Staff)*
- `GET    /api/admin/dashboard/popular-dishes` — Top-selling dishes *(Admin/Staff)*
- `GET    /api/admin/customers` — Customer CRM *(Admin/Staff)*

### System Health (`/api/health`)
- `GET    /api/health` — Service health status and database connectivity

---

## ⚡ Real-Time Socket.IO System

Order updates are transmitted via isolated rooms to avoid leaking customer data:

| Event | Direction | Target Room | Payload |
|---|---|---|---|
| `join:order` | Client ➔ Server | — | `orderNumber` (e.g. `TF-1042`) |
| `leave:order` | Client ➔ Server | — | `orderNumber` |
| `join:admin` | Admin ➔ Server | — | `admin:kitchen` |
| `order:created` | Server ➔ Admin | `admin:kitchen` | Complete new Order object |
| `order:status_updated` | Server ➔ Client | `order:<orderNumber>` | `{ orderNumber, status, timeline, estimatedTime }` |
| `order:<status>` | Server ➔ Client | `order:<orderNumber>` | `{ orderNumber, status }` (e.g. `order:preparing`) |
| `reservation:created` | Server ➔ Admin | `admin:kitchen` | New table reservation |

---

## 🛡️ Security & Validation Architecture

1. **Password Security**: Bcrypt with 12 salt rounds. Passwords stripped from responses via Mongoose `select: false` and `toJSON` transform.
2. **Server-Side Pricing**: Client prices, discounts, and delivery fees are strictly ignored during checkout. Subtotals, add-on rates, delivery tariffs, and coupon deductions are fetched and calculated directly from MongoDB.
3. **Availability Enforcement**: If an item is marked `available: false`, backend rejects order creation with a 400 Bad Request.
4. **Role-Based Authorization**:
   - `customer`: Can view and track own orders and reservations.
   - `staff`: Kitchen operations, order status updates, reservation management.
   - `admin` / `superadmin`: Full catalog, pricing, settings, delivery zones, vouchers, and metrics.
5. **Rate Limiting**: 50 attempts/15min on authentication routes; 300 requests/15min across general API.
6. **HTTP Headers**: Helmet enabled with secure CORS restricted to `CLIENT_URL`.

---

## 🚢 Production Deployment & Recovery Guide

### 1. Database (MongoDB Atlas)
1. Log into your MongoDB cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. **Network Access**: Add IP Address -> Select **Allow Access From Anywhere (`0.0.0.0/0`)** (mandatory for cloud dynamic IPs like Vercel and Render).
3. **Database Access**: Verify your database user exists with read/write permissions.
4. Copy your connection URI to `MONGO_URI` in `backend/.env`.

### 2. Image CDN (Cloudinary)
1. Log into [cloudinary.com](https://cloudinary.com).
2. Copy `Cloud Name`, `API Key`, and `API Secret`.
3. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
4. Dishes added via Admin (`Admin -> Add New Dish`) will automatically upload images from your computer to Cloudinary and store the secure URL in MongoDB.

### 3. GitHub Repository Setup (Fresh Deployment)
Since the previous GitHub repository was deleted, the local repository remote origin was cleared and is ready to connect to your new repo:
```bash
# 1. Create a new repository on GitHub (e.g. named three-flames-restaurant)
# 2. Stage and commit all audited changes:
git add .
git commit -m "feat: production readiness audit, multer 2.x, health checks, and vercel deployment config"

# 3. Link your new GitHub repository:
git remote add origin <YOUR_NEW_GITHUB_REPOSITORY_URL>
git branch -M main
git push -u origin main
```

### 4. Backend Deployment (Render / Railway / Persistent Container)
> 💡 **Why a persistent host for backend?** The Three Flames platform includes **real-time kitchen alerts and customer live order tracking via Socket.IO WebSockets**. Persistent Node hosts (like Render or Railway) keep WebSocket connections alive 24/7.

1. Create a new **Web Service** on [Render](https://render.com) or [Railway](https://railway.app) connected to your new GitHub repository.
2. Settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` (runs `node server.js`)
3. Add Backend Environment Variables:
   - `PORT=5000`
   - `NODE_ENV=production`
   - `CLIENT_URL=https://your-frontend-project.vercel.app` *(update once frontend is deployed)*
   - `MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/three-flames?retryWrites=true&w=majority`
   - `JWT_SECRET=your_strong_jwt_secret_min_32_characters`
   - `JWT_EXPIRES_IN=7d`
   - `CLOUDINARY_CLOUD_NAME=your_cloud_name`
   - `CLOUDINARY_API_KEY=your_api_key`
   - `CLOUDINARY_API_SECRET=your_api_secret`
   - `EMAIL_FROM=Three Flames Restaurant <noreply@threeflames.pk>`
4. Note your deployed backend URL (e.g. `https://three-flames-api.onrender.com`).
5. Run `npm run seed` via the service shell/one-off command if you need to initialize database records.

### 5. Frontend Deployment (Vercel)
1. Go to [Vercel Dashboard](https://vercel.com) -> **Add New...** -> **Project**.
2. Import your new GitHub repository.
3. In **Project Configuration**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `frontend` (⚠️ **CRITICAL STEP**)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, add:
   - `VITE_API_URL` = `https://your-backend-service.onrender.com/api` *(or your deployed backend URL)*
   - `VITE_SOCKET_URL` = `https://your-backend-service.onrender.com`
5. Click **Deploy**.
6. Once deployed, copy your production Vercel domain (e.g., `https://three-flames.vercel.app`) and update `CLIENT_URL` in your backend deployment settings.

---

## 📍 Restaurant Information (Configurable)

- **Restaurant Name**: Three Flames Restaurant
- **Tagline**: Where Taste Meets Flame
- **Address**: Bilour Chowk, Rehman Baba Road, Abdara Road, University Town, Peshawar, Pakistan
- **Hotline**: `0334-4226655`
- **WhatsApp**: `+92-334-4226655`
- **Email**: `info@threeflames.pk`#   t h r e e - f l a m e s - r e s t a u r a n t  
 