import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import LoadingSpinner from '@/components/LoadingSpinner';

const HomePage = lazy(() => import('@/pages/HomePage'));
const ShopPage = lazy(() => import('@/pages/ShopPage'));
const ProductPage = lazy(() => import('@/pages/ProductPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const CheckoutVerifyPage = lazy(() => import('@/pages/CheckoutVerifyPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const PolicyPage = lazy(() => import('@/pages/PolicyPage'));
const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminOrdersPage = lazy(() => import('@/pages/admin/AdminOrdersPage'));
const AdminReportsPage = lazy(() => import('@/pages/admin/AdminReportsPage'));

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="shop/category/:slug" element={<ShopPage />} />
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
