import React, { useState } from 'react';
import { Star, MessageCircle, ThumbsUp, Calendar } from 'lucide-react';
import './review.css';

const ReviewCard = ({ name = "Anonymous", review, rating = 5, date = "2 days ago", likes = 12, avatar }) => {
 const [liked, setLiked] = useState(false);
 const [showComments, setShowComments] = useState(false);
 const [newComment, setNewComment] = useState('');
 const [comments, setComments] = useState([
   { user: "Admin", text: "Thank you for your feedback!", time: "1 day ago" },
   { user: "John D.", text: "I totally agree!", time: "6 hours ago" }
 ]);

 // Generate initials from name with fallback
 const getInitials = (name) => {
   if (!name || typeof name !== 'string') return 'A';
   return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'A';
 };

 const handleReply = () => {
   if (newComment.trim() === '') return;
   setComments([
     ...comments,
     { user: 'You', text: newComment, time: 'Just now' }
   ]);
   setNewComment('');
 };

 return (
   <article className="review-card">
     <div className="review-card__header">
       <div className="review-card__avatar">{getInitials(name)}</div>
       <div className="review-card__author-block">
         <h4 className="review-card__author">{name}</h4>
         <div className="review-card__meta">
           <Calendar className="review-card__meta-icon" />
           <span>{date}</span>
         </div>
         <div className="review-card__badge">Verified Buyer</div>
       </div>
       <div className="review-card__stars">
         {[...Array(5)].map((_, i) => (
           <Star
             key={i}
             size={16}
             className={`review-card__star ${i < rating ? 'review-card__star--active' : ''}`}
           />
         ))}
         <span className="review-card__rating-value">{rating.toFixed(1)}</span>
       </div>
     </div>

     <p className="review-card__text">"{review}"</p>

     <div className="review-card__actions">
       <button
         type="button"
         onClick={() => setLiked(!liked)}
         className={`review-card__button ${liked ? 'review-card__button--liked' : ''}`}
       >
         <ThumbsUp size={16} className="review-card__button-icon" />
         <span>{likes + (liked ? 1 : 0)}</span>
       </button>

       <button
         type="button"
         onClick={() => setShowComments(!showComments)}
         className="review-card__button review-card__button--secondary"
       >
         <MessageCircle size={16} className="review-card__button-icon" />
         <span>{comments.length} replies</span>
       </button>
     </div>

     {showComments && (
       <div className="review-card__comments">
         {comments.map((comment, i) => (
           <div key={i} className="review-card__comment">
             <div className="review-card__comment-avatar">
               {comment.user[0] || 'A'}
             </div>
             <div className="review-card__comment-body">
               <p className="review-card__comment-author">{comment.user}</p>
               <p className="review-card__comment-text">{comment.text}</p>
               <p className="review-card__comment-time">{comment.time}</p>
             </div>
           </div>
         ))}

         <div className="review-card__reply-form">
           <input
             value={newComment}
             onChange={(e) => setNewComment(e.target.value)}
             placeholder="Add a reply..."
             className="review-card__reply-input"
           />
           <button
             type="button"
             className="review-card__reply-button"
             onClick={handleReply}
           >
             Reply
           </button>
         </div>
       </div>
     )}
   </article>
 );
};

export default ReviewCard;