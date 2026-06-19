import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string | null;
  is_featured: boolean;
  is_active: boolean;
  order: number;
}

export default function AdminTestimonials() {
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/v1/site/admin/testimonials/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      return response.json();
    },
  });

  const toggleActive = async (testimonialId: number, isActive: boolean) => {
    const token = localStorage.getItem('access_token');
    await fetch(`/api/v1/site/admin/testimonials/${testimonialId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_active: !isActive }),
    });
    // Refetch testimonials
  };

  const toggleFeatured = async (testimonialId: number, isFeatured: boolean) => {
    const token = localStorage.getItem('access_token');
    await fetch(`/api/v1/site/admin/testimonials/${testimonialId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_featured: !isFeatured }),
    });
    // Refetch testimonials
  };

  const deleteTestimonial = async (testimonialId: number) => {
    const token = localStorage.getItem('access_token');
    await fetch(`/api/v1/site/admin/testimonials/${testimonialId}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Refetch testimonials
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < rating ? 'text-brand-pink' : 'text-brand-gray-300'}>
        ★
      </span>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold text-brand-black">Testimonials Management</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-brand-pink text-white font-semibold py-2.5 px-6 rounded-xl hover:bg-brand-pink/90 transition-all shadow-lg shadow-brand-pink/30"
        >
          Add New Testimonial
        </motion.button>
      </motion.div>

      {/* Testimonials Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-pink border-t-transparent" />
          </div>
        ) : testimonials && testimonials.length > 0 ? (
          testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-lg border border-brand-gray-100 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  {testimonial.image && (
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-brand-black">{testimonial.name}</h3>
                    <p className="text-sm text-brand-accent/60">{testimonial.role}</p>
                    <div className="flex gap-1 mt-2">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                </div>
                <p className="text-brand-accent mb-4 line-clamp-3">{testimonial.content}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      testimonial.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {testimonial.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {testimonial.is_featured && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-brand-pink/10 text-brand-pink">
                        Featured
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-brand-accent/60">Order: {testimonial.order}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleActive(testimonial.id, testimonial.is_active)}
                    className="flex-1 bg-brand-gray-100 text-brand-accent py-2 rounded-lg hover:bg-brand-gray-200 transition-colors text-sm"
                  >
                    {testimonial.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => toggleFeatured(testimonial.id, testimonial.is_featured)}
                    className="flex-1 bg-brand-gray-100 text-brand-accent py-2 rounded-lg hover:bg-brand-gray-200 transition-colors text-sm"
                  >
                    {testimonial.is_featured ? 'Unfeature' : 'Feature'}
                  </button>
                  <button
                    onClick={() => deleteTestimonial(testimonial.id)}
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
            No testimonials found
          </div>
        )}
      </motion.div>
    </div>
  );
}
