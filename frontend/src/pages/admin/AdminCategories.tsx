import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  product_count: number;
  is_active: boolean;
  is_featured: boolean;
  order: number;
  image: string | null;
}

export default function AdminCategories() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/v1/products/admin/categories/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
  });

  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold text-brand-black">Categories Management</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-brand-pink text-white font-semibold py-2.5 px-6 rounded-xl hover:bg-brand-pink/90 transition-all shadow-lg shadow-brand-pink/30"
        >
          Add New Category
        </motion.button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-brand-gray-100"
      >
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
        />
      </motion.div>

      {/* Categories Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-pink border-t-transparent" />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="col-span-full text-center py-12 text-brand-accent/60">
            No categories found
          </div>
        ) : (
          filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-lg border border-brand-gray-100 overflow-hidden"
            >
              {category.image && (
                <div className="aspect-video bg-brand-gray-50">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-brand-black">{category.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    category.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {category.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-brand-accent/60 mb-4 line-clamp-2">
                  {category.description || 'No description'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-brand-accent/60">
                    {category.product_count} products
                  </span>
                  <div className="flex gap-2">
                    <button className="text-brand-pink hover:text-brand-pink/80 font-medium text-sm">
                      Edit
                    </button>
                    <button className="text-red-500 hover:text-red-700 font-medium text-sm">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}
