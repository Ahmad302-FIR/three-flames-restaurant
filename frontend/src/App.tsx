import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';

// Layout & Common Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { CartDrawer } from './components/cart/CartDrawer';
import { ToastContainer } from './components/common/ToastContainer';
import { AdminLayout } from './components/admin/AdminLayout';

// Public Pages
import { HomePage } from './pages/Home';
import { MenuPage } from './pages/Menu';
import { FoodDetailsPage } from './pages/FoodDetails';
import { CartPage } from './pages/Cart';
import { CheckoutPage } from './pages/Checkout';
import { OrderSuccessPage } from './pages/OrderSuccess';
import { OrderTrackingPage } from './pages/OrderTracking';
import { ReservationPage } from './pages/Reservation';
import { AboutPage } from './pages/About';
import { GalleryPage } from './pages/Gallery';
import { ContactPage } from './pages/Contact';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { ProfilePage } from './pages/Profile';
import { NotFoundPage } from './pages/NotFound';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboard';
import { AdminOrdersPage } from './pages/admin/AdminOrders';
import { AdminMenuPage } from './pages/admin/AdminMenu';
import { AdminReservationsPage } from './pages/admin/AdminReservations';
import { AdminDeliveryZonesPage } from './pages/admin/AdminDeliveryZones';
import { AdminOffersPage } from './pages/admin/AdminOffers';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalytics';
import { AdminCategoriesPage } from './pages/admin/AdminCategories';
import { AdminReviewsPage } from './pages/admin/AdminReviews';
import { AdminGalleryPage } from './pages/admin/AdminGallery';
import { AdminCustomersPage } from './pages/admin/AdminCustomers';
import { AdminSettingsPage } from './pages/admin/AdminSettings';
import { AdminProfilePage } from './pages/admin/AdminProfile';

// Scroll to top helper on navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

// Main App Router Layout Handler
const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#080604] text-[#FFF7ED] flex flex-col font-sans selection:bg-[#F97316] selection:text-black">
      <ScrollToTop />
      <ToastContainer />
      <CartDrawer />

      {/* Show public header on non-admin routes */}
      {!isAdminRoute && <Navbar />}

      <div className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menu/:id" element={<FoodDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:id" element={<OrderSuccessPage />} />
          <Route path="/track-order" element={<OrderTrackingPage />} />
          <Route path="/track-order/:id" element={<OrderTrackingPage />} />
          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/account" element={<ProfilePage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="menu" element={<AdminMenuPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="reservations" element={<AdminReservationsPage />} />
            <Route path="reviews" element={<AdminReviewsPage />} />
            <Route path="gallery" element={<AdminGalleryPage />} />
            <Route path="offers" element={<AdminOffersPage />} />
            <Route path="delivery-zones" element={<AdminDeliveryZonesPage />} />
            <Route path="users" element={<AdminCustomersPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {/* Show public footer & mobile bottom nav on non-admin routes */}
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <MobileBottomNav />}
    </div>
  );
};

export function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
