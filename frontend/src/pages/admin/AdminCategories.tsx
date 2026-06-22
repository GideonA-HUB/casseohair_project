import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminFetch, adminFetchList } from '@/lib/adminApi';

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', image: null as File | null });
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading, error, refetch } = useQuery<Category[]>({
    queryKey: ['admin-categories'],
    queryFn: () => adminFetchList<Category>('/api/v1/products/admin/categories/'),
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/v1/products/admin/categories/', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.name?.[0] || body.detail || 'Failed to create category');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setIsAddModalOpen(false);
      setNewCategory({ name: '', description: '', image: null });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) =>
      adminFetch(`/api/v1/products/admin/categories/${id}/`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-categories'] }),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) =>
      adminFetch(`/api/v1/products/admin/categories/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-categories'] }),
  });

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;
    const formData = new FormData();
    formData.append('name', newCategory.name.trim());
    formData.append('description', newCategory.description);
    if (newCategory.image) formData.append('image', newCategory.image);
    createCategoryMutation.mutate(formData);
  };

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50">
        <p className="mb-2 font-medium text-red-600">Failed to load categories</p>
        <p className="mb-4 text-sm text-red-500">{(error as Error).message}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-xl bg-brand-pink px-6 py-2 text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <p className="text-sm text-slate-500">Manage product categories for your store</p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="rounded-xl bg-gradient-to-r from-brand-pink to-brand-pink-dark px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-pink/30"
        >
          + Add Category
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20"
        />
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-pink border-t-transparent" />
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center text-slate-400">
          No categories found. Add your first category to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="aspect-video bg-slate-100">
                {category.image ? (
                  <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">No image</div>
                )}
              </div>
              <div className="p-5">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-900">{category.name}</h3>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      category.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {category.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="mb-3 line-clamp-2 text-sm text-slate-500">
                  {category.description || 'No description'}
                </p>
                <p className="mb-4 text-xs text-slate-400">{category.product_count} products</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      toggleActiveMutation.mutate({ id: category.id, is_active: !category.is_active })
                    }
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-brand-pink/30 hover:text-brand-pink"
                  >
                    {category.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete "${category.name}"?`)) deleteCategoryMutation.mutate(category.id);
                    }}
                    className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-5 text-xl font-bold text-slate-900">Add New Category</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">Name *</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-pink"
                  placeholder="Category name"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">Description</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-pink"
                  rows={3}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewCategory({ ...newCategory, image: e.target.files?.[0] || null })}
                  className="w-full text-sm"
                />
              </div>
              {createCategoryMutation.isError && (
                <p className="text-sm text-red-500">{(createCategoryMutation.error as Error).message}</p>
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCategory}
                disabled={createCategoryMutation.isPending || !newCategory.name.trim()}
                className="flex-1 rounded-xl bg-brand-pink py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                {createCategoryMutation.isPending ? 'Adding...' : 'Add Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
