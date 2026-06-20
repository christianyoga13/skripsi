import React, { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem("archetype_wishlist");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load wishlist from localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("archetype_wishlist", JSON.stringify(wishlist));
    } catch (error) {
      console.error("Failed to save wishlist to localStorage:", error);
    }
  }, [wishlist]);

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      // Ensure we compare the same type (typically numbers or strings)
      const numericId = Number(productId);
      if (prev.includes(numericId)) {
        return prev.filter((id) => id !== numericId);
      } else {
        return [...prev, numericId];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(Number(productId));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
