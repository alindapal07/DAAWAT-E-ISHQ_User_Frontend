import { Clock, Flame, ShoppingBag, Star, X } from 'lucide-react';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import './Wishlist.css';

const Wishlist = () => {
  const { addToCart } = useContext(CartContext);
  const {
    wishlistItems,
    removeFromWishlist,
    moveAllToCart,
    getWishlistTotal,
    isWishlistEmpty
  } = useContext(WishlistContext);

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  const handleMoveAllToCart = () => {
    moveAllToCart(addToCart);
  };

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <div className="container">
          <div className="header-content">
            <div className="header-text">
              <h1>My Wishlist</h1>
              <p>Your favorite dishes saved for later</p>
              <div className="wishlist-stats">
                <span className="item-count">{wishlistItems.length} items</span>
                <span className="total-value">
                  Total Value: ₹{wishlistItems.reduce((sum, item) => sum + item.price, 0)}
                </span>
              </div>
            </div>
            <div className="header-actions">
              <button onClick={handleMoveAllToCart} className="move-all-btn">
                <ShoppingBag size={20} />
                Move All to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="wishlist-content">
          <div className="wishlist-grid">
            {wishlistItems.map((item) => (
              <div key={item.id} className="wishlist-card">
                <div className="card-image">
                  <img src={item.image} alt={item.name} />
                  <div className="card-badges">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="badge">{tag}</span>
                    ))}
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="card-content">
                  <div className="card-header">
                    <h3 className="dish-name">{item.name}</h3>
                    <div className="dish-indicators">
                      <div className={`veg-indicator ${item.isVeg ? 'veg' : 'non-veg'}`}></div>
                      {item.isSpicy && <Flame size={14} className="spicy-indicator" />}
                    </div>
                  </div>

                  <p className="dish-description">{item.description}</p>

                  <div className="dish-meta">
                    <div className="rating">
                      <Star size={14} fill="currentColor" />
                      <span>{item.rating}</span>
                      <span className="review-count">({item.reviewCount})</span>
                    </div>
                    <div className="cook-time">
                      <Clock size={14} />
                      <span>{item.cookTime}</span>
                    </div>
                  </div>

                  <div className="card-footer">
                    <div className="price-section">
                      <span className="current-price">₹{item.price}</span>
                    </div>
                    
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingBag size={16} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="wishlist-summary">
            <div className="summary-card">
              <h3>Wishlist Summary</h3>
              <div className="summary-stats">
                <div className="stat">
                  <span className="stat-label">Total Items</span>
                  <span className="stat-value">{wishlistItems.length}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Total Value</span>
                  <span className="stat-value">₹{wishlistItems.reduce((sum, item) => sum + item.price, 0)}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Average Price</span>
                  <span className="stat-value">
                    ₹{Math.round(wishlistItems.reduce((sum, item) => sum + item.price, 0) / wishlistItems.length)}
                  </span>
                </div>
              </div>
              <div className="summary-actions">
                <button onClick={handleMoveAllToCart} className="primary-btn">
                  <ShoppingBag size={18} />
                  Add All to Cart
                </button>
                <a href="/menu" className="secondary-btn">
                  Continue Shopping
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
