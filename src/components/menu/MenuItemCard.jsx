import {
  Clock,
  Flame,
  Heart,
  ShoppingBag,
  Star,
  Check,
  Plus,
  Minus,
} from "lucide-react";
import { memo, useContext, useRef, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";

const MenuItemCard = memo(({ item }) => {
  const { addToCart, cartRef, updateQuantity, getItemQuantity } =
    useContext(CartContext);
  const { toggleWishlist, isItemInWishlist } = useContext(WishlistContext);

  const addBtnRef = useRef(null);
  const [added, setAdded] = useState(false);

  // Get current quantity from cart
  const quantity = getItemQuantity(item.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (added) return;

    if (cartRef?.current && addBtnRef.current) {
      cartRef.current.triggerFly(addBtnRef.current, () => {
        addToCart(item);
      });
    } else {
      addToCart(item);
    }

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  const handleIncrease = (e) => {
    e.stopPropagation();
    updateQuantity(item.id, quantity + 1);
  };

  const handleDecrease = (e) => {
    e.stopPropagation();
    updateQuantity(item.id, quantity - 1);
  };

  return (
    <div className="menu-card" ref={addBtnRef}>
      {/* Image Section */}
      <div className="card-image">
        <img src={item.image} alt={item.name} />

        <div className="card-badges">
          {item.tags.map((tag, index) => (
            <span key={index} className="badge">
              {tag}
            </span>
          ))}
        </div>

        <button
          className="like-btn"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(item);
          }}
        >
          <Heart
            size={18}
            fill={isItemInWishlist(item.id) ? "#ef4444" : "none"}
            color={isItemInWishlist(item.id) ? "#ef4444" : "#374151"}
          />
        </button>
      </div>

      {/* Content */}
      <div className="card-content">
        <div className="card-header">
          <h3 className="dish-name">{item.name}</h3>

          <div className="dish-indicators">
            <div className={`veg-indicator ${item.isVeg ? "veg" : "non-veg"}`}>
              <div className="veg-dot"></div>
            </div>
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

        {/* Footer */}
        <div className="card-footer">
          <div className="price-section">
            <span className="current-price">₹{item.price}</span>
          </div>

          {/* 🔥 CONDITIONAL UI */}
          {quantity > 0 ? (
            <div
              className="add-to-cart-btn"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",

                // 📱 responsive spacing
                gap: "8px",
                padding: "6px 10px",

                borderRadius: "999px",

                // 🎨 cleaner gradient (lighter for mobile)
                background: "linear-gradient(135deg, #2a4c4b, #223f3e)",

                border: "1px solid rgba(255,255,255,0.08)",

                // ⚡ optimized shadow (less heavy)
                boxShadow:
                  "inset 0 1px 1px rgba(255,255,255,0.06), 0 3px 10px rgba(0,0,0,0.25)",

                position: "relative",
                overflow: "hidden",

                transition: "all 0.25s ease",

                // 📱 prevents highlight on tap
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {/* ➖ MINUS */}
              <button
                onClick={handleDecrease}
                style={{
                  width: "30px", // 📱 bigger touch target
                  height: "30px",
                  borderRadius: "8px",
                  border: "none",
                  background: "rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",

                  transition: "all 0.15s ease",
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.background = "#ef4444";
                  e.currentTarget.style.transform = "scale(0.92)";
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <Minus size={16} color="#fff" />
              </button>

              {/* 🔢 DIGIT (IMPROVED ANIMATION) */}
              <div
                style={{
                  position: "relative",
                  height: "20px",
                  width: "26px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  key={quantity}
                  style={{
                    position: "absolute",
                    fontWeight: "700",
                    fontSize: "15px", // 📱 slightly bigger
                    color: "#fff",

                    // 🎯 smoother + faster animation
                    animation: "digitPop 0.2s ease",
                  }}
                >
                  {quantity}
                </span>
              </div>

              {/* ➕ PLUS */}
              <button
                onClick={handleIncrease}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  border: "none",
                  background: "rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",

                  transition: "all 0.15s ease",
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.background = "#22c55e";
                  e.currentTarget.style.transform = "scale(0.92)";
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <Plus size={16} color="#fff" />
              </button>

              {/* ✨ SUBTLE GLOW (LOW GPU IMPACT) */}
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: "-60%",
                  width: "50%",
                  height: "100%",
                  background:
                    "linear-gradient(120deg, transparent, rgba(255,255,255,0.18), transparent)",
                  transform: "skewX(-20deg)",
                  animation: "shineMobile 4s infinite",
                }}
              />

              {/* 🎬 MOBILE-FRIENDLY ANIMATIONS */}
              <style>
                {`
      @keyframes digitPop {
        0% {
          transform: scale(0.8);
          opacity: 0.5;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }

      @keyframes shineMobile {
        0% { left: -60%; }
        100% { left: 120%; }
      }
    `}
              </style>
            </div>
          ) : (
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.3s ease",
                background: added
                  ? "linear-gradient(135deg, #22c55e, #16a34a)"
                  : undefined,
                transform: added ? "scale(1.05)" : "scale(1)",
                boxShadow: added ? "0 0 10px rgba(34,197,94,0.6)" : undefined,
                cursor: added ? "default" : "pointer",
              }}
            >
              {added ? (
                <>
                  <Check size={16} />
                  Added
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  Add to Cart
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default MenuItemCard;
