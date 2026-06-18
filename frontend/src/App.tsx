import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import ProductPage from '@/pages/ProductPage';
import CheckoutPage from '@/pages/CheckoutPage';
import CheckoutVerifyPage from '@/pages/CheckoutVerifyPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import CategoriesPage from '@/pages/CategoriesPage';
import PolicyPage from '@/pages/PolicyPage';

const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminOrdersPage = lazy(() => import('@/pages/admin/AdminOrdersPage'));
const AdminReportsPage = lazy(() => import('@/pages/admin/AdminReportsPage'));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen={false} />}>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="shop/category/:slug" element={<ShopPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="product/:slug" element={<ProductPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="checkout/verify" element={<CheckoutVerifyPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="privacy" element={<PolicyPage />} />
          <Route path="terms" element={<PolicyPage />} />
          <Route path="refund" element={<PolicyPage />} />
        </Route>

        <Route path="admin-dashboard/login" element={<AdminLoginPage />} />
        <Route path="admin-dashboard" element={<AdminDashboardPage />} />
        <Route path="admin-dashboard/orders" element={<AdminOrdersPage />} />
        <Route path="admin-dashboard/reports" element={<AdminReportsPage />} />
      </Routes>
    </Suspense>
  );
}
