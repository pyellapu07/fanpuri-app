import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });
  const [currentUser, setCurrentUser] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setCurrentUser(user);
        // Load favorites for this specific user
        const userFavoritesKey = `favorites_${user.uid}`;
        const stored = localStorage.getItem(userFavoritesKey);
        if (stored) {
          try {
            const parsedFavorites = JSON.parse(stored);
            setFavorites(parsedFavorites);
            console.log(`Loaded favorites for user ${user.uid}:`, parsedFavorites);
          } catch (error) {
            console.error('Error parsing stored favorites:', error);
            setFavorites([]);
          }
        } else {
          setFavorites([]);
          console.log(`No stored favorites found for user ${user.uid}`);
        }
      } else {
        // User is signed out
        setCurrentUser(null);
        // Clear favorites when user logs out
        setFavorites([]);
        console.log('User logged out, favorites cleared');
      }
    });

    return () => unsubscribe();
  }, []);

  // Save favorites to localStorage whenever favorites changes
  useEffect(() => {
    if (currentUser) {
      // Save favorites for specific user
      const userFavoritesKey = `favorites_${currentUser.uid}`;
      localStorage.setItem(userFavoritesKey, JSON.stringify(favorites));
      console.log(`Saved favorites for user ${currentUser.uid}:`, favorites);
    } else {
      // Save favorites for anonymous users
      localStorage.setItem('favorites', JSON.stringify(favorites));
      console.log('Saved anonymous favorites:', favorites);
    }
  }, [favorites, currentUser]);

  const addToFavorites = (product) => {
    setFavorites((prev) => {
      // Prevent duplicates by id
      if (prev.find((item) => item.id === product.id)) return prev;
      return [...prev, { ...product, addedAt: new Date().toISOString() }];
    });
  };

  const removeFromFavorites = (productId) => {
    setFavorites((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearFavorites = () => setFavorites([]);

  const isInFavorites = (productId) => {
    return favorites.some((item) => item.id === productId);
  };

  const toggleFavorite = (product) => {
    if (isInFavorites(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      addToFavorites, 
      removeFromFavorites, 
      clearFavorites, 
      isInFavorites,
      toggleFavorite 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}; 