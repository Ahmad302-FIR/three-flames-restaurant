import React, { useEffect, Component } from 'react';
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
import { AdminMessagesPage } from './pages/admin/AdminMessages';
import { AdminDeliveryZonesPage } from './pages/admin/AdminDeliveryZones';
import { AdminOffersPage } from './pages/admin/AdminOffers';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalytics';
import { AdminCategoriesPage } from './pages/admin/AdminCategories';
import { AdminReviewsPage } from './pages/admin/AdminReviews';
import { AdminGalleryPage } from './pages/admin/AdminGallery';
import { AdminCustomersPage } from './pages/admin/AdminCustomers';
import { AdminSettingsPage } from './pages/admin/AdminSettings';
import { AdminProfilePage } from './pages/admin/AdminProfile';

import { FlameIcon } from './components/common/FlameIcon';

// Scroll to top helper on navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 text-center">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] shadow-2xl space-y-5">
            <div className="flex items-center justify-center mx-auto">
              <img src="/akr-logo.png" alt="AKR" className="h-14 w-auto object-contain" />
            </div>
            <h2 className="text-xl font-extrabold font-heading text-[#25201D]">
              Something Went Wrong
            </h2>
            <p className="text-xs text-[#6F6761] leading-relaxed">
              An unexpected error occurred while loading this view.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
                className="px-4 py-2.5 rounded-xl bg-[#B85C38] text-white text-xs font-bold hover:bg-[#8F432B] transition-colors shadow-sm"
              >
                Refresh Page
              </button>
              <button
                type="button"
                onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}
                className="px-4 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs font-semibold text-[#25201D] hover:bg-[#F3E4DC] transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Main App Router Layout Handler
const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#FFFDFC] text-[#25201D] flex flex-col font-sans selection:bg-[#F3E4DC] selection:text-[#B85C38]">
      <ScrollToTop />
      <ToastContainer />
      <CartDrawer />

      {/* Show public header on non-admin routes */}
      {!isAdminRoute && <Navbar />}

      <div className="flex-1">
        <ErrorBoundary>
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
            <Route path="messages" element={<AdminMessagesPage />} />
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
      </ErrorBoundary>
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
