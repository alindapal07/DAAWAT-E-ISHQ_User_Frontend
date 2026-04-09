// Cart.js - Updated to work with your existing CartContext
import { ArrowLeft, Clock, Gift, Minus, Package, Plus, ShoppingBag, Sparkles, Trash2, TrendingUp, X } from 'lucide-react';
import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext.jsx'; // Adjust path as needed
import './Cart.css';


const Cart = () => {
  const { 
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTaxAmount,
    getFinalTotal
  } = useContext(CartContext);
 const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  const handleQuantityChange = (itemId, newQuantity) => {
    updateQuantity(itemId, newQuantity);
  };

  const deliveryFee = 50;

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="cart-empty-container">
        <div className="cart-empty-blob cart-empty-blob-1"></div>
        <div className="cart-empty-blob cart-empty-blob-2"></div>
        
        <div className="cart-empty-content">
          <div className="cart-empty-icon-wrapper">
            <div className="cart-empty-glow"></div>
            <ShoppingBag size={96} className="cart-empty-icon" strokeWidth={1.5} />
          </div>
          <h2 className="cart-empty-title">
            Your Cart is Empty
          </h2>
          <p className="cart-empty-text">
            Start exploring our amazing collection and fill your cart with favorites!
          </p>
          <a href="/menu" className="cart-empty-btn">
            <Package size={20} />
            Explore Menu
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-background-blob cart-blob-1"></div>
      <div className="cart-background-blob cart-blob-2"></div>
      
      {/* Header */}
      <div className="cart-header">
        <div className="cart-header-content">
          <div className="cart-header-inner">
            <a href="/menu" className="cart-back-btn">
              <div className="cart-back-btn-wrapper">
                <ArrowLeft size={18} />
              </div>
              <span>Back</span>
            </a>
            
            <h1 className="cart-title">
              <Sparkles size={24} />
              Your Cart
            </h1>
            
            <div className="cart-badge">
              <ShoppingBag size={18} />
              <span>{itemCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cart-main">
        <div className="cart-grid">
          {/* Cart Items */}
          <div className="cart-items-section">
            <div className="cart-items-card">
              <div className="cart-items-header">
                <h2 className="cart-items-title">
                  <Package size={20} />
                  Items ({itemCount})
                </h2>
                <button onClick={() => setShowClearConfirm(true)} className="clear-all-btn">
                  <Trash2 size={16} />
                  Clear All
                </button>
              </div>

              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="cart-item"
                  >
                    <div className="cart-item-content">
                      <div className="cart-item-details">
                        <div className="cart-item-header">
                          <div>
                            <h3 className="cart-item-name">
                              {item.name}
                              {item.quantity > 1 && (
                                <span className="cart-item-quantity-badge">
                                  ×{item.quantity}
                                </span>
                              )}
                            </h3>
                            <p className="cart-item-description">
                              {item.description}
                            </p>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="cart-item-remove">
                            <X size={18} />
                          </button>
                        </div>

                        <div className="cart-item-footer">
                          <div className="cart-item-price-wrapper">
                            <span className="cart-item-price">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                            {item.quantity > 1 && (
                              <span className="cart-item-unit-price">
                                (₹{item.price} each)
                              </span>
                            )}
                          </div>

                          <div className="cart-item-quantity">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="quantity-btn"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="quantity-value">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="quantity-btn"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="promo-section">
                <div className="promo-header">
                  <Gift size={20} />
                  <h3>Have a promo code?</h3>
                </div>
                <div className="promo-input-group">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code here"
                    className="promo-input"
                  />
                  <button className="promo-btn">Apply</button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="cart-summary-section">
            <div className="cart-summary-sticky">
              <div className="cart-summary-card">
                <h2 className="cart-summary-title">
                  <TrendingUp size={24} />
                  Summary
                </h2>

                <div className="cart-summary-items">
                  <div className="summary-item">
                    <span className="summary-label">
                      <div className="summary-dot dot-violet"></div>
                      Subtotal
                    </span>
                    <span className="summary-value">
                      ₹{getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">
                      <div className="summary-dot dot-fuchsia"></div>
                      Tax (5%)
                    </span>
                    <span className="summary-value">
                      ₹{getTaxAmount().toFixed(2)}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">
                      <div className="summary-dot dot-pink"></div>
                      Delivery
                    </span>
                    <span className="summary-value">₹{deliveryFee.toFixed(2)}</span>
                  </div>
                </div>

                <div className="cart-summary-total">
                  <div className="summary-total-row">
                    <span className="summary-total-label">Total</span>
                    <span className="summary-total-value">
                      ₹{(getFinalTotal() + deliveryFee).toFixed(2)}
                    </span>
                  </div>
                  <p className="summary-total-note">Inclusive of all taxes</p>
                </div>

                <button 
                  onClick={() => window.location.href = '/checkout'} 
                  className="checkout-btn"
                >
                  <span>Checkout Now</span>
                  <ArrowLeft className="checkout-arrow" size={20} />
                </button>

                <div className="savings-banner">
                  <p>
                    <Sparkles size={16} />
                    Save ₹{(getTotalPrice() * 0.1).toFixed(2)} on this order!
                  </p>
                </div>

                <div className="trust-badges">
                  <div className="trust-badge-item">
                    <div className="trust-badge-icon">✓</div>
                    <span>Secure checkout</span>
                  </div>
                  <div className="trust-badge-item">
                    <div className="trust-badge-icon">✓</div>
                    <span>Free cancellation</span>
                  </div>
                  <div className="trust-badge-item">
                    <div className="trust-badge-icon">
                      <Clock size={12} />
                    </div>
                    <span>30-45 min delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Cart Modal */}
      {showClearConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-body">
              <div className="modal-icon">
                <Trash2 size={32} />
              </div>
              <h3 className="modal-title">Clear Cart?</h3>
              <p className="modal-text">
                This will remove all items from your cart.
              </p>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowClearConfirm(false)} className="modal-btn-cancel">
                Cancel
              </button>
              <button
                onClick={() => {
                  clearCart();
                  setShowClearConfirm(false);
                }}
                className="modal-btn-confirm"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;