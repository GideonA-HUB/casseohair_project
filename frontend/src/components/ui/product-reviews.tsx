"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ProductReviewsProps {
  productSlug: string;
}

export default function ProductReviews({ productSlug }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productSlug]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/v1/products/${productSlug}/reviews/`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.comment) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/v1/products/${productSlug}/reviews/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", rating: 5, comment: "" });
        setTimeout(() => {
          setSubmitted(false);
          setShowForm(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: reviews.length > 0
      ? (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100
      : 0,
  }));

  return (
    <section className="w-full section-padding bg-brand-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-brand-black mb-4">
            Customer Reviews
          </h2>
          <p className="text-brand-accent/60">
            See what our customers are saying about this product
          </p>
        </div>

        {/* Rating Summary */}
        <div className="bg-white rounded-luxury shadow-card p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Average Rating */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-5xl md:text-6xl font-display font-semibold text-brand-pink mb-2">
                {averageRating}
              </div>
              <div className="flex gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-2xl ${
                      i < Math.round(Number(averageRating))
                        ? "text-brand-pink"
                        : "text-brand-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-sm text-brand-accent/60">
                Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-3">
              {ratingDistribution.map((item) => (
                <div key={item.rating} className="flex items-center gap-3">
                  <span className="text-sm text-brand-accent w-8">{item.rating} ★</span>
                  <div className="flex-1 h-2 bg-brand-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.percentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-brand-pink rounded-full"
                    />
                  </div>
                  <span className="text-sm text-brand-accent/60 w-8 text-right">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-brand-pink border-t-transparent" />
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-luxury shadow-card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-brand-black">{review.name}</h4>
                    <p className="text-xs text-brand-accent/40">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < review.rating ? "text-brand-pink" : "text-brand-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-brand-accent leading-relaxed">{review.comment}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-luxury shadow-card mb-8">
            <p className="text-brand-accent/60">No reviews yet. Be the first to review!</p>
          </div>
        )}

        {/* Write Review Button */}
        {!showForm && !submitted && (
          <div className="text-center">
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary px-8 py-3 rounded-full"
            >
              Write a Review
            </button>
          </div>
        )}

        {/* Review Form */}
        {showForm && !submitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-luxury shadow-card p-6 md:p-8 mt-8"
          >
            <h3 className="text-xl font-display font-semibold text-brand-black mb-6">
              Write Your Review
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-accent mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-luxury border border-brand-gray-200 focus:border-brand-pink outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-accent mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-luxury border border-brand-gray-200 focus:border-brand-pink outline-none transition-colors"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-accent mb-2">
                  Rating *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating })}
                      className={`text-3xl transition-colors ${
                        rating <= formData.rating ? "text-brand-pink" : "text-brand-gray-300"
                      } hover:text-brand-pink`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-accent mb-2">
                  Your Review *
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 rounded-luxury border border-brand-gray-200 focus:border-brand-pink outline-none transition-colors resize-none"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-8 py-3 rounded-full disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-ghost px-8 py-3 rounded-full"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Success Message */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-brand-pink text-white text-center py-8 px-6 rounded-luxury shadow-card mt-8"
          >
            <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
            <p className="text-white/90">
              Your review has been submitted and will be visible after approval.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
