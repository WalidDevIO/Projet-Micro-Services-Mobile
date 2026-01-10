import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartService, articleService } from '../services/ecommService';
import { CartItem } from '../models/CartItem';
import { Article } from '../models/Article';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const items = await cartService.getCart();
      
      const enrichedItems = await Promise.all(
        items.map(async (item) => {
          try {
            const articleData = await articleService.getById(item.articleId);
            return new CartItem({
              ...item,
              article: new Article(articleData),
            });
          } catch (error) {
            return new CartItem(item);
          }
        })
      );
      
      setCartItems(enrichedItems);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (articleId, quantity = 1) => {
    try {
      await cartService.addItem(articleId, quantity);
      await loadCart();
      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to add item' };
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      if (quantity <= 0) {
        await removeItem(cartItemId);
      } else {
        await cartService.updateItem(cartItemId, quantity);
        await loadCart();
      }
      return { success: true };
    } catch (error) {
      console.error('Error updating quantity:', error);
      return { success: false, message: 'Failed to update quantity' };
    }
  };

  const incrementQuantity = async (cartItemId) => {
    const item = cartItems.find(i => i.id === cartItemId);
    if (item) {
      return await updateQuantity(cartItemId, item.quantity + 1);
    }
  };

  const decrementQuantity = async (cartItemId) => {
    const item = cartItems.find(i => i.id === cartItemId);
    if (item) {
      return await updateQuantity(cartItemId, item.quantity - 1);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await cartService.removeItem(cartItemId);
      await loadCart();
      return { success: true };
    } catch (error) {
      console.error('Error removing item:', error);
      return { success: false, message: 'Failed to remove item' };
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCartItems([]);
      return { success: true };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false, message: 'Failed to clear cart' };
    }
  };

  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    clearCart,
    refreshCart: loadCart,
    total: getTotal(),
    itemCount: getItemCount(),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
