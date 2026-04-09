import React, { useState } from 'react';
import ReviewCard from '../components/ReviewCard';
import { Star, Send } from 'lucide-react';
import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([
    { 
      name: 'John Doe', 
      review: 'Amazing food and great service! The biryani was absolutely delicious. Will definitely come back again.', 
      rating: 5, 
      date: '2 days ago', 
      likes: 12 
    },
    { 
      name: 'Sarah Johnson', 
      review: 'Loved the ambiance and the butter chicken was perfect. Staff was very friendly and attentive.', 
      rating: 4, 
      date: '1 day ago', 
      likes: 8 
    },
    { 
      name: 'Mike Chen', 
      review: 'Authentic Indian flavors! The tandoori dishes were cooked to perfection. Highly recommended!', 
      rating: 5, 
      date: '3 days ago', 
      likes: 15 
    }
  ]);

  const [newReview, setNewReview] = useState({ 
    name: '', 
    review: '', 
    rating: 5 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.review.trim()) return;
    
    const reviewToAdd = {
      ...newReview,
      name: newReview.name.trim(),
      review: newReview.review.trim(),
      date: 'Just now',
      likes: 0
    };
    
    setReviews([reviewToAdd, ...reviews]);
    setNewReview({ name: '', review: '', rating: 5 });
  };

  return (
    <div className="reviews-page">
      <div className="reviews-page__inner">
        {/* Header */}
        <div className="reviews-page__header">
          <h1 className="reviews-page__title">Customer Reviews</h1>
          <p className="reviews-page__subtitle">Share your experience with us</p>
        </div>

        {/* New Review Form */}
        <section className="review-form-card">
          <h2 className="review-form-card__title">Leave a Review</h2>
          <form onSubmit={handleSubmit} className="review-form">
            <div className="review-form-grid">
              <div className="review-form-group">
                <label className="review-form-label">Your Name *</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={newReview.name}
                  onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                  className="review-form-input"
                  required
                />
              </div>
              <div className="review-form-group">
                <label className="review-form-label">Rating *</label>
                <div className="rating-group">
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className={`rating-star-btn ${star <= newReview.rating ? 'rating-star-btn--active' : ''}`}
                        aria-label={`${star} star${star !== 1 ? 's' : ''}`}
                      >
                        <Star size={18} />
                      </button>
                    ))}
                  </div>
                  <span className="rating-value">
                    {newReview.rating} star{newReview.rating !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            <div className="review-form-group">
              <label className="review-form-label">Your Review *</label>
              <textarea
                placeholder="Share your experience with our food and service..."
                value={newReview.review}
                onChange={e => setNewReview({ ...newReview, review: e.target.value })}
                rows={4}
                className="review-form-textarea"
                required
              />
            </div>

            <div className="review-submit-wrapper">
              <button type="submit" className="review-submit-btn">
                <Send size={18} />
                Submit Review
              </button>
            </div>
          </form>
        </section>

        {/* Reviews List */}
        <div className="reviews-list">
          {reviews.map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
