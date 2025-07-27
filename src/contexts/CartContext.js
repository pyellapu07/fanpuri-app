import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });
  const [currentUser, setCurrentUser] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setCurrentUser(user);
        // Load cart for this specific user
        const userCartKey = `cart_${user.uid}`;
        const stored = localStorage.getItem(userCartKey);
        if (stored) {
          try {
            const parsedCart = JSON.parse(stored);
            setCart(parsedCart);
            console.log(`Loaded cart for user ${user.uid}:`, parsedCart);
          } catch (error) {
            console.error('Error parsing stored cart:', error);
            setCart([]);
          }
        } else {
          setCart([]);
          console.log(`No stored cart found for user ${user.uid}`);
        }
      } else {
        // User is signed out
        setCurrentUser(null);
        // Clear cart when user logs out
        setCart([]);
        console.log('User logged out, cart cleared');
      }
    });

    return () => unsubscribe();
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    if (currentUser) {
      // Save cart for specific user
      const userCartKey = `cart_${currentUser.uid}`;
      localStorage.setItem(userCartKey, JSON.stringify(cart));
      console.log(`Saved cart for user ${currentUser.uid}:`, cart);
    } else {
      // Save cart for anonymous users
      localStorage.setItem('cart', JSON.stringify(cart));
      console.log('Saved anonymous cart:', cart);
    }
  }, [cart, currentUser]);

  const addToCart = (product) => {
    setCart((prev) => {
      // Prevent duplicates by id
      if (prev.find((item) => item.id === product.id)) return prev;
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) return;
    setCart((prev) => prev.map((item) => item.id === productId ? { ...item, quantity: newQty } : item));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}; 