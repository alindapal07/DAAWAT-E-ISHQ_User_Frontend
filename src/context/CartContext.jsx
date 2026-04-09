import React, { createContext, useState, useEffect, useRef } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // ── NEW: cartRef lives here so both Navbar (attaches it) and
  // MenuItemCard (calls triggerFly) can reach it without prop drilling.
  // Nothing else in this file changes.
  const cartRef = useRef(null);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('daawat-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setCartItems([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem('daawat-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (item, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Update item quantity
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Get total number of items in cart
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Get total price of all items in cart
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Check if item is already in cart
  const isItemInCart = (itemId) => {
    return cartItems.some(item => item.id === itemId);
  };

  // Get quantity of specific item in cart
  const getItemQuantity = (itemId) => {
    const item = cartItems.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };

  // Toggle cart open/close
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Close cart
  const closeCart = () => {
    setIsCartOpen(false);
  };

  // Open cart
  const openCart = () => {
    setIsCartOpen(true);
  };

  // Apply discount (for future use)
  const applyDiscount = (discountCode) => {
    console.log('Discount code applied:', discountCode);
  };

  // Calculate tax (assuming 5% tax rate)
  const getTaxAmount = () => {
    return getTotalPrice() * 0.05;
  };

  // Get final total including tax
  const getFinalTotal = () => {
    return getTotalPrice() + getTaxAmount();
  };

  // Check if cart is empty
  const isCartEmpty = () => {
    return cartItems.length === 0;
  };

  // Get unique items count (different items, not quantities)
  const getUniqueItemsCount = () => {
    return cartItems.length;
  };

  // Move item to wishlist (for future implementation)
  const moveToWishlist = (itemId) => {
    console.log('Moving item to wishlist:', itemId);
  };

  // Save cart for later (for future implementation)
  const saveForLater = () => {
    localStorage.setItem('daawat-saved-cart', JSON.stringify(cartItems));
    console.log('Cart saved for later');
  };

  // Load saved cart (for future implementation)
  const loadSavedCart = () => {
    const savedCart = localStorage.getItem('daawat-saved-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
        console.log('Saved cart loaded');
      } catch (error) {
        console.error('Error loading saved cart:', error);
      }
    }
  };

  const value = {
    // State
    cartItems,
    isCartOpen,
    // NEW: expose cartRef so Navbar and MenuItemCard can use it
    cartRef,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    closeCart,
    openCart,
    applyDiscount,
    moveToWishlist,
    saveForLater,
    loadSavedCart,

    // Computed values
    getTotalItems,
    getTotalPrice,
    getTaxAmount,
    getFinalTotal,
    isItemInCart,
    getItemQuantity,
    isCartEmpty,
    getUniqueItemsCount,

    // Setters
    setIsCartOpen
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;