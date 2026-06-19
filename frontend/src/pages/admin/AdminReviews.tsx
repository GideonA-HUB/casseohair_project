import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

interface Review {
  id: number;
  name: string;
  email: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
  product_name: string;
}

export default function AdminReviews() {
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ['admin-reviews', statusFilter],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`/api/v1/products/reviews/admin/?status=${statusFilter}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return response.json();
    },
  });

  const approveReview = async (reviewId: number) => {
    const token = localStorage.getItem('access_token');
    await fetch(`/api/v1/products/reviews/${reviewId}/approve/`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Refetch reviews
  };

  const rejectReview = async (reviewId: number) => {
    const token = localStorage.getItem('access_token');
    await fetch(`/api/v1/products/reviews/${reviewId}/reject/`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Refetch reviews
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
        <h1 className="text-2xl font-bold text-brand-black">Product Reviews</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-brand-gray-200 focus:border-brand-pink outline-none"
        >
          <option value="all">All Reviews</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </motion.div>

      {/* Reviews List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-pink border-t-transparent" />
          </div>
        ) : reviews && reviews.length > 0 ? (
          reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-lg border border-brand-gray-100 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-brand-black">{review.name}</h3>
                  <p className="text-sm text-brand-accent/60">{review.email}</p>
                  <p className="text-sm text-brand-accent/40 mt-1">{review.product_name}</p>
                </div>
                <div className="flex gap-1">
                  {renderStars(review.rating)}
                </div>
              </div>
              <p className="text-brand-accent mb-4">{review.comment}</p>
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  review.is_approved
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {review.is_approved ? 'Approved' : 'Pending'}
                </span>
                <div className="flex gap-2">
                  {!review.is_approved && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => approveReview(review.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Approve
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => rejectReview(review.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Reject
                      </motion.button>
                    </>
                  )}
                  {review.is_approved && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => rejectReview(review.id)}
                      className="bg-gray-200 text-brand-accent px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Revoke
                    </motion.button>
                  )}
                </div>
              </div>
              <p className="text-xs text-brand-accent/40 mt-4">
                {new Date(review.created_at).toLocaleString()}
              </p>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 text-brand-accent/60">
            No reviews found
          </div>
        )}
      </motion.div>
    </div>
  );
}
