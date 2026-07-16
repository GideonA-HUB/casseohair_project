import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminFetch, adminFetchList } from '@/lib/adminApi';

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

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    category: '',
    price: '',
    sale_price: '',
    stock: '',
    description: '',
    short_description: '',
    length: '',
    density: '',
    lace_type: '',
    color: '',
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: false,
    images: [] as File[],
    videos: [] as File[],
  });
  const queryClient = useQueryClient();

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['admin-products', statusFilter],
    queryFn: () => adminFetchList<Product>('/api/v1/products/admin/'),
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => adminFetchList<Category>('/api/v1/products/categories/'),
  });

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.slug.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const toggleProductStatus = useMutation({
    mutationFn: async ({ productId, isActive }: { productId: number; isActive: boolean }) => {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`/api/v1/products/admin/${productId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: !isActive }),
      });
      if (!response.ok) throw new Error('Failed to update product status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/v1/products/admin/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to create product');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setIsAddModalOpen(false);
      setNewProduct({
        name: '',
        slug: '',
        category: '',
        price: '',
        sale_price: '',
        stock: '',
        description: '',
        short_description: '',
        length: '',
        density: '',
        lace_type: '',
        color: '',
        is_featured: false,
        is_bestseller: false,
        is_new_arrival: false,
        images: [],
        videos: [],
      });
    },
  });

  const handleAddProduct = () => {
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('slug', newProduct.slug);
    formData.append('category', newProduct.category);
    formData.append('price', newProduct.price);
    formData.append('sale_price', newProduct.sale_price || '0');
    formData.append('stock', newProduct.stock);
    formData.append('description', newProduct.description);
    formData.append('short_description', newProduct.short_description);
    formData.append('length', newProduct.length);
    formData.append('density', newProduct.density);
    formData.append('lace_type', newProduct.lace_type);
    formData.append('color', newProduct.color);
    formData.append('is_featured', newProduct.is_featured.toString());
    formData.append('is_bestseller', newProduct.is_bestseller.toString());
    formData.append('is_new_arrival', newProduct.is_new_arrival.toString());
    newProduct.images.forEach((image) => {
      formData.append('images', image);
    });
    newProduct.videos.forEach((video) => {
      formData.append('videos', video);
    });
    createProductMutation.mutate(formData);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load products</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-brand-pink text-white px-6 py-2 rounded-xl"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

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
          onClick={() => setIsAddModalOpen(true)}
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
                        onClick={() => toggleProductStatus.mutate({ productId: product.id, isActive: product.is_active })}
                        disabled={toggleProductStatus.isPending}
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

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto"
          onClick={() => setIsAddModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-brand-black mb-6">Add New Product</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-brand-accent mb-2">Name *</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
                  placeholder="Product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-accent mb-2">Slug *</label>
                <input
                  type="text"
                  value={newProduct.slug}
                  onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
                  placeholder="product-slug"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-accent mb-2">Category *</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
                >
                  <option value="">Select category</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-accent mb-2">Price *</label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-accent mb-2">Sale Price</label>
                <input
                  type="number"
                  value={newProduct.sale_price}
                  onChange={(e) => setNewProduct({ ...newProduct, sale_price: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-accent mb-2">Stock *</label>
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
                  placeholder="0"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-accent mb-2">Short Description</label>
                <textarea
                  value={newProduct.short_description}
                  onChange={(e) => setNewProduct({ ...newProduct, short_description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all resize-none"
                  rows={2}
                  placeholder="Short description"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-accent mb-2">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all resize-none"
                  rows={4}
                  placeholder="Full product description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-accent mb-2">Length</label>
                <input
                  type="text"
                  value={newProduct.length}
                  onChange={(e) => setNewProduct({ ...newProduct, length: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
                  placeholder="e.g., 12 inches"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-accent mb-2">Grams</label>
                <input
                  type="text"
                  value={newProduct.density}
                  onChange={(e) => setNewProduct({ ...newProduct, density: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
                  placeholder="e.g., 200g"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-accent mb-2">Lace Type</label>
                <input
                  type="text"
                  value={newProduct.lace_type}
                  onChange={(e) => setNewProduct({ ...newProduct, lace_type: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
                  placeholder="e.g., 13x4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-accent mb-2">Color</label>
                <input
                  type="text"
                  value={newProduct.color}
                  onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
                  placeholder="e.g., Natural Black"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-accent mb-2">Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setNewProduct({ ...newProduct, images: Array.from(e.target.files || []) })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-accent mb-2">Videos</label>
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={(e) => setNewProduct({ ...newProduct, videos: Array.from(e.target.files || []) })}
                  className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newProduct.is_featured}
                    onChange={(e) => setNewProduct({ ...newProduct, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded border-brand-gray-300 text-brand-pink focus:ring-brand-pink"
                  />
                  <span className="text-sm font-medium text-brand-accent">Featured</span>
                </label>
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newProduct.is_bestseller}
                    onChange={(e) => setNewProduct({ ...newProduct, is_bestseller: e.target.checked })}
                    className="w-4 h-4 rounded border-brand-gray-300 text-brand-pink focus:ring-brand-pink"
                  />
                  <span className="text-sm font-medium text-brand-accent">Bestseller</span>
                </label>
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newProduct.is_new_arrival}
                    onChange={(e) => setNewProduct({ ...newProduct, is_new_arrival: e.target.checked })}
                    className="w-4 h-4 rounded border-brand-gray-300 text-brand-pink focus:ring-brand-pink"
                  />
                  <span className="text-sm font-medium text-brand-accent">New Arrival</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 px-6 py-3 rounded-xl border border-brand-gray-200 text-brand-accent font-semibold hover:bg-brand-gray-50 transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddProduct}
                disabled={createProductMutation.isPending}
                className="flex-1 px-6 py-3 rounded-xl bg-brand-pink text-white font-semibold hover:bg-brand-pink/90 transition-all disabled:opacity-50"
              >
                {createProductMutation.isPending ? 'Adding...' : 'Add Product'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
