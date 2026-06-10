import { apiClient } from './client';
import { unwrapList } from '@/utils/api';
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
  featured: (): Promise<Product[]> =>
    apiClient
      .get<Product[] | PaginatedResponse<Product>>('/products/featured/')
      .then((r) => unwrapList<Product>(r.data)),
  bestsellers: (): Promise<Product[]> =>
    apiClient
      .get<Product[] | PaginatedResponse<Product>>('/products/bestsellers/')
      .then((r) => unwrapList<Product>(r.data)),
  newArrivals: (): Promise<Product[]> =>
    apiClient
      .get<Product[] | PaginatedResponse<Product>>('/products/new-arrivals/')
      .then((r) => unwrapList<Product>(r.data)),
  search: (q: string) =>
    apiClient.get<{ results: Product[]; count: number }>('/products/search/', { params: { q } }),
  categories: (): Promise<Category[]> =>
    apiClient
      .get<Category[] | PaginatedResponse<Category>>('/products/categories/')
      .then((r) => unwrapList<Category>(r.data)),
  category: (slug: string) => apiClient.get<Category>(`/products/categories/${slug}/`),
};

export const siteApi = {
  settings: () => apiClient.get<SiteSettings>('/site/settings/'),
  assets: () => apiClient.get<Record<string, { image: string }>>('/site/assets/'),
  testimonials: (): Promise<Testimonial[]> =>
    apiClient
      .get<Testimonial[] | PaginatedResponse<Testimonial>>('/site/testimonials/')
      .then((r) => unwrapList<Testimonial>(r.data)),
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
