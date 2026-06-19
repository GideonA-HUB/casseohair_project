import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

interface Product {
  id: number;
  name: string;
  slug: string;
  category_name: string;
  price: string;
  current_price: string;
  is_on_sale: boolean;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new_arrival: boolean;
  primary_image: string | null;
  created_at: string;
}

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['admin-products', statusFilter],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`/api/v1/products/admin/?status=${statusFilter}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.slug.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const toggleProductStatus = async (productId: number, isActive: boolean) => {
    const token = localStorage.getItem('access_token');
    await fetch(`/api/v1/products/admin/${productId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_active: !isActive }),
    });
    // Refetch products
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold text-brand-black">Products Management</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-brand-pink text-white font-semibold py-2.5 px-6 rounded-xl hover:bg-brand-pink/90 transition-all shadow-lg shadow-brand-pink/30"
        >
          Add New Product
        </motion.button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-brand-gray-100"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink outline-none"
          >
            <option value="all">All Products</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="featured">Featured</option>
            <option value="bestseller">Bestsellers</option>
            <option value="new">New Arrivals</option>
          </select>
        </div>
      </motion.div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-brand-gray-100 overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-pink border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Badges</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-accent">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray-100">
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-brand-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {product.primary_image && (
                          <img
                            src={product.primary_image}
                            alt={product.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-brand-black">{product.name}</p>
                          <p className="text-sm text-brand-accent/60">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-accent">{product.category_name}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-brand-accent">₦{product.current_price}</p>
                        {product.is_on_sale && (
                          <p className="text-sm text-brand-accent/40 line-through">₦{product.price}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleProductStatus(product.id, product.is_active)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          product.is_active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {product.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {product.is_featured && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-brand-pink/10 text-brand-pink">
                            Featured
                          </span>
                        )}
                        {product.is_bestseller && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Bestseller
                          </span>
                        )}
                        {product.is_new_arrival && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            New
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="text-brand-pink hover:text-brand-pink/80 font-medium text-sm">
                          Edit
                        </button>
                        <button className="text-red-500 hover:text-red-700 font-medium text-sm">
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
