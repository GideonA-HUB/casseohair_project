import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

interface HeroImage {
  id: number;
  image: string;
  alt_text: string;
  order: number;
  is_active: boolean;
}

export default function AdminHeroImages() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: heroImages, isLoading, refetch } = useQuery<HeroImage[]>({
    queryKey: ['admin-hero-images'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/v1/site/hero-images/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch hero images');
      return response.json();
    },
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('alt_text', 'Hero image');

    await fetch('/api/v1/site/hero-images/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    setSelectedFile(null);
    refetch();
  };

  const toggleActive = async (imageId: number, isActive: boolean) => {
    const token = localStorage.getItem('access_token');
    await fetch(`/api/v1/site/hero-images/${imageId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_active: !isActive }),
    });
    refetch();
  };

  const deleteImage = async (imageId: number) => {
    const token = localStorage.getItem('access_token');
    await fetch(`/api/v1/site/hero-images/${imageId}/`, {
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
        <h1 className="text-2xl font-bold text-brand-black">Hero Images Management</h1>
      </motion.div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-brand-gray-100"
      >
        <h3 className="text-lg font-semibold text-brand-black mb-4">Upload New Hero Image</h3>
        <div className="flex gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="flex-1 px-4 py-3 rounded-xl border border-brand-gray-200 focus:border-brand-pink outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUpload}
            disabled={!selectedFile}
            className="bg-brand-pink text-white font-semibold py-3 px-6 rounded-xl hover:bg-brand-pink/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upload
          </motion.button>
        </div>
      </motion.div>

      {/* Images Grid */}
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
        ) : heroImages && heroImages.length > 0 ? (
          heroImages.map((heroImage, index) => (
            <motion.div
              key={heroImage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-lg border border-brand-gray-100 overflow-hidden"
            >
              <div className="aspect-video bg-brand-gray-50">
                <img
                  src={heroImage.image}
                  alt={heroImage.alt_text}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    heroImage.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {heroImage.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-sm text-brand-accent/60">Order: {heroImage.order}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleActive(heroImage.id, heroImage.is_active)}
                    className="flex-1 bg-brand-gray-100 text-brand-accent py-2 rounded-lg hover:bg-brand-gray-200 transition-colors text-sm"
                  >
                    {heroImage.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => deleteImage(heroImage.id)}
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
            No hero images found
          </div>
        )}
      </motion.div>
    </div>
  );
}
