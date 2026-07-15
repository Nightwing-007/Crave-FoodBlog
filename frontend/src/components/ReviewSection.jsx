import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ReviewSection = ({ recipeId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, [recipeId]);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/recipes/${recipeId}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to leave a review');
      return;
    }
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post(`/recipes/${recipeId}/reviews`, { rating, comment });
      setReviews([response.data, ...reviews]);
      setRating(0);
      setComment('');
      toast.success('Review added successfully!');
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const StarIcon = ({ fill, onMouseEnter, onMouseLeave, onClick }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={fill ? '#f59e0b' : 'none'}
      stroke={fill ? '#f59e0b' : '#d1d5db'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-8 h-8 cursor-pointer transition-colors duration-200"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Reviews ({reviews.length})</h3>
      
      {/* Review Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-10 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
          <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Leave a Review</h4>
          
          <div className="flex mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                fill={star <= (hover || rating)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(rating)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this recipe (optional)..."
            className="w-full p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 resize-none text-gray-700 dark:text-gray-300 mb-4"
            rows="3"
          />

          <button
            type="submit"
            disabled={submitting}
            className={`px-6 py-3 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all duration-200 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      ) : (
        <div className="mb-10 bg-orange-50 dark:bg-orange-900/10 p-6 rounded-2xl text-center">
          <p className="text-orange-800 dark:text-orange-400 font-medium">Please log in to leave a review.</p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full"></div>
            <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full"></div>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((rev) => (
            <div key={rev.id} className="p-6 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h5 className="font-bold text-gray-800 dark:text-gray-200">{rev.userName}</h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={i < rev.rating ? '#f59e0b' : 'none'}
                      stroke={i < rev.rating ? '#f59e0b' : '#d1d5db'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              </div>
              {rev.comment && <p className="text-gray-700 dark:text-gray-300">{rev.comment}</p>}
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">No reviews yet. Be the first to try this recipe!</p>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
