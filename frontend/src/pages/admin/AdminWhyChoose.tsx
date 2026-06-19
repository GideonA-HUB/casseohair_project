import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

interface WhyChooseItem {
  id: number;
  title: string;
  description: string;
  image: string | null;
  alt_text: string;
  order: number;
  is_active: boolean;
}

export default function AdminWhyChoose() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    alt_text: '',
  });

  const { data: items, isLoading, refetch } = useQuery<WhyChooseItem[]>({
    queryKey: ['admin-why-choose'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/v1/site/why-choose/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch items');
      return response.json();
    },
  });

  const handleCreate = async () => {
    const token = localStorage.getItem('access_token');
    const formDataObj = new FormData();
    formDataObj.append('title', formData.title);
    formDataObj.append('description', formData.description);
    formDataObj.append('alt_text', formData.alt_text);
    if (selectedFile) {
      formDataObj.append('image', selectedFile);
    }

    await fetch('/api/v1/site/why-choose/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formDataObj,
    });

    setFormData({ title: '', description: '', alt_text: '' });
    setSelectedFile(null);
    refetch();
  };

  const toggleActive = async (itemId: number, isActive: boolean) => {
    const token = localStorage.getItem('access_token');
    await fetch(`/api/v1/site/why-choose/${itemId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_active: !isActive }),
    });
    refetch();
  };

  const deleteItem = async (itemId: number) => {
    const token = localStorage.getItem('access_token');
    await fetch(`/api/v1/site/why-choose/${itemId}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold text-brand-black">Why Choose Items Management</h1>
      </motion.div>

      {/* Create Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-brand-gray-100"
      >
        <h3 className="text-lg font-semibold text-brand-black mb-4">Add New Item</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-accent mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
              placeholder="Enter title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-accent mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all resize-none"
              rows={3}
              placeholder="Enter description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-accent mb-2">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-accent mb-2">Alt Text</label>
            <input
              type="text"
              value={formData.alt_text}
              onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
              placeholder="Enter alt text for image"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreate}
            disabled={!formData.title || !formData.description}
            className="bg-brand-pink text-white font-semibold py-3 px-6 rounded-xl hover:bg-brand-pink/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Item
          </motion.button>
        </div>
      </motion.div>

      {/* Items Grid */}
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
        ) : items && items.length > 0 ? (
          items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-lg border border-brand-gray-100 overflow-hidden"
            >
              {item.image && (
                <div className="aspect-video bg-brand-gray-50">
                  <img
                    src={item.image}
                    alt={item.alt_text}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-sm text-brand-accent/60">Order: {item.order}</span>
                </div>
                <h3 className="font-semibold text-brand-black mb-2">{item.title}</h3>
                <p className="text-sm text-brand-accent/60 mb-4 line-clamp-2">{item.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleActive(item.id, item.is_active)}
                    className="flex-1 bg-brand-gray-100 text-brand-accent py-2 rounded-lg hover:bg-brand-gray-200 transition-colors text-sm"
                  >
                    {item.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-brand-accent/60">
            No items found
          </div>
        )}
      </motion.div>
    </div>
  );
}
