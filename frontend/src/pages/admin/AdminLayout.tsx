import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
  { id: 'orders', label: 'Orders', icon: '🛒', path: '/dashboard/orders' },
  { id: 'products', label: 'Products', icon: '📦', path: '/dashboard/products' },
  { id: 'categories', label: 'Categories', icon: '📁', path: '/dashboard/categories' },
  { id: 'reviews', label: 'Reviews', icon: '⭐', path: '/dashboard/reviews' },
  { id: 'notifications', label: 'Notifications', icon: '🔔', path: '/dashboard/notifications' },
  { id: 'contacts', label: 'Contact Submissions', icon: '📧', path: '/dashboard/contacts' },
  { id: 'hero-images', label: 'Hero Images', icon: '🖼️', path: '/dashboard/hero-images' },
  { id: 'newsletter', label: 'Newsletter', icon: '📬', path: '/dashboard/newsletter' },
  { id: 'testimonials', label: 'Testimonials', icon: '💬', path: '/dashboard/testimonials' },
  { id: 'why-choose', label: 'Why Choose', icon: '✨', path: '/dashboard/why-choose' },
  { id: 'settings', label: 'Site Settings', icon: '⚙️', path: '/dashboard/settings' },
  { id: 'activity-logs', label: 'Activity Logs', icon: '📝', path: '/dashboard/activity-logs' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const adminUser = localStorage.getItem('admin_user');
    if (!adminUser) {
      navigate('/dashboard/login');
    } else {
      setUser(JSON.parse(adminUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('admin_user');
    navigate('/dashboard/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-brand-gray-50 flex">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-72 bg-white border-r border-brand-gray-200 fixed h-full z-30 overflow-y-auto"
          >
            {/* Logo */}
            <div className="p-6 border-b border-brand-gray-200">
              <h1 className="text-2xl font-display font-bold text-brand-pink">
                CasseoHair
              </h1>
              <p className="text-sm text-brand-accent/60 mt-1">Admin Dashboard</p>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive(item.path)
                      ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/30'
                      : 'text-brand-accent hover:bg-brand-gray-100'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              ))}
            </nav>

            {/* User Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-brand-gray-200 bg-white">
              {user && (
                <div className="mb-4">
                  <p className="font-medium text-brand-black">{user.username}</p>
                  <p className="text-sm text-brand-accent/60">{user.email}</p>
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full bg-brand-gray-100 text-brand-accent font-medium py-2.5 px-4 rounded-xl hover:bg-brand-gray-200 transition-all"
              >
                Logout
              </motion.button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-72' : 'ml-0'} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white border-b border-brand-gray-200 px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-brand-gray-100 transition-colors"
              >
                <svg
                  className="w-6 h-6 text-brand-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {sidebarOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </motion.button>
              <h2 className="text-xl font-semibold text-brand-black">
                {navItems.find((item) => isActive(item.path))?.label || 'Dashboard'}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="text-sm text-brand-accent hover:text-brand-pink transition-colors"
              >
                View Website
              </motion.button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
