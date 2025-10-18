import { useState, useEffect } from 'react';
import type { CartItem, Product } from '../lib/supabase';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cart.find(item => item.product.id === product.id);

    if (existingItem) {
      const newCart = cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      saveCart(newCart);
    } else {
      saveCart([...cart, { product, quantity }]);
    }
  };

  const removeFromCart = (productId: string) => {
    saveCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const newCart = cart.map(item =>
      item.product.id === productId
        ? { ...item, quantity }
        : item
    );
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount: cart.reduce((sum, item) => sum + item.quantity, 0)
  };
}
