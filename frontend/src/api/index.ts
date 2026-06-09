import { apiClient } from './client';
import type {
  Category,
  CheckoutFormData,
  DashboardMetrics,
  Order,
  PaginatedResponse,
  Product,
  SiteSettings,
  Testimonial,
} from '@/types';

export const productsApi = {
  list: (params?: Record<string, string | number>) =>
    apiClient.get<PaginatedResponse<Product>>('/products/', { params }),
  get: (slug: string) => apiClient.get<Product>(`/products/${slug}/`),
  featured: () => apiClient.get<Product[]>('/products/featured/'),
  bestsellers: () => apiClient.get<Product[]>('/products/bestsellers/'),
  newArrivals: () => apiClient.get<Product[]>('/products/new-arrivals/'),
  search: (q: string) => apiClient.get<{ results: Product[]; count: number }>('/products/search/', { params: { q } }),
  categories: () => apiClient.get<Category[]>('/products/categories/'),
  category: (slug: string) => apiClient.get<Category>(`/products/categories/${slug}/`),
};

export const siteApi = {
  settings: () => apiClient.get<SiteSettings>('/site/settings/'),
  assets: () => apiClient.get<Record<string, { image: string }>>('/site/assets/'),
  testimonials: () => apiClient.get<Testimonial[]>('/site/testimonials/'),
  contact: (data: { name: string; email: string; phone?: string; message: string }) =>
    apiClient.post('/site/contact/', data),
  newsletter: (email: string) => apiClient.post('/site/newsletter/', { email }),
};

export const ordersApi = {
  checkout: (data: CheckoutFormData) => apiClient.post<Order>('/orders/checkout/', data),
  get: (orderNumber: string) => apiClient.get<Order>(`/orders/${orderNumber}/`),
  adminList: (params?: Record<string, string>) =>
    apiClient.get<PaginatedResponse<Order>>('/orders/admin/list/', { params }),
  adminUpdate: (orderNumber: string, data: { status: string }) =>
    apiClient.patch(`/orders/admin/${orderNumber}/`, data),
};

export const paymentsApi = {
  initialize: (orderNumber: string, provider: 'paystack' | 'flutterwave') =>
    apiClient.post<{ authorization_url: string; reference: string }>('/payments/initialize/', {
      order_number: orderNumber,
      provider,
    }),
  verify: (reference: string, provider: string) =>
    apiClient.post('/payments/verify/', { reference, provider }),
  keys: () =>
    apiClient.get<{ paystack_public_key: string; flutterwave_public_key: string }>('/payments/keys/'),
};

export const authApi = {
  login: (username: string, password: string) =>
    apiClient.post<{ access: string; refresh: string }>('/accounts/login/', { username, password }),
  profile: () => apiClient.get('/accounts/profile/'),
};

export const analyticsApi = {
  dashboard: () => apiClient.get<DashboardMetrics>('/analytics/dashboard/'),
  salesTrend: (days = 30) => apiClient.get('/analytics/sales-trend/', { params: { days } }),
  topProducts: () => apiClient.get('/analytics/top-products/'),
};

export const notificationsApi = {
  list: () => apiClient.get('/notifications/admin/list/'),
  unreadCount: () => apiClient.get<{ count: number }>('/notifications/admin/unread-count/'),
  markRead: (id: number) => apiClient.post(`/notifications/admin/${id}/read/`),
};
