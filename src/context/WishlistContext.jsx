import React, { createContext, useEffect, useState } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  /* =========================
     LOAD FROM LOCAL STORAGE
  ========================== */
  useEffect(() => {
    const savedWishlist = localStorage.getItem('daawat-wishlist');
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Failed to parse wishlist:', error);
        setWishlistItems([]);
      }
    }
  }, []);

  /* =========================
     SAVE TO LOCAL STORAGE
  ========================== */
  useEffect(() => {
    localStorage.setItem('daawat-wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  /* =========================
     HELPERS
  ========================== */
  const getItemId = (item) => item?.id || item?._id;

  /* =========================
     ACTIONS
  ========================== */
  const addToWishlist = (item) => {
    const id = getItemId(item);
    if (!id) return;

    setWishlistItems((prev) => {
      if (prev.some((i) => getItemId(i) === id)) return prev;
      return [...prev, { ...item, id }];
    });
  };

  const removeFromWishlist = (itemId) => {
    setWishlistItems((prev) =>
      prev.filter((item) => getItemId(item) !== itemId)
    );
  };

  const isItemInWishlist = (itemId) => {
    return wishlistItems.some((item) => getItemId(item) === itemId);
  };

  const toggleWishlist = (item) => {
    const id = getItemId(item);
    if (!id) return;

    if (isItemInWishlist(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist(item);
    }
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  /* =========================
     COMPUTED VALUES
  ========================== */
  const getWishlistCount = () => wishlistItems.length;

  const getWishlistTotal = () =>
    wishlistItems.reduce((sum, item) => sum + (item.price || 0), 0);

  const isWishlistEmpty = () => wishlistItems.length === 0;

  const moveAllToCart = (addToCart) => {
    wishlistItems.forEach((item) => addToCart(item));
    clearWishlist();
  };

  /* =========================
     CONTEXT VALUE
  ========================== */
  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    moveAllToCart,
    isItemInWishlist,
    getWishlistCount,
    getWishlistTotal,
    isWishlistEmpty
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
