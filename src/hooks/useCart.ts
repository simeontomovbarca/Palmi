import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { CartItem, Product } from '../lib/supabase';

function getSessionId(): string {
  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sessionId] = useState(getSessionId());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);

    await supabase
      .from('cart_sessions')
      .upsert({ session_id: sessionId }, { onConflict: 'session_id' });

    const { data: cartItemsData } = await supabase
      .from('cart_items')
      .select(`
        quantity,
        product_id,
        products (
          id,
          category_id,
          name,
          description,
          price,
          image_url,
          stock_quantity,
          slug,
          created_at
        )
      `)
      .eq('session_id', sessionId);

    if (cartItemsData) {
      const cartItems: CartItem[] = cartItemsData
        .filter(item => item.products)
        .map(item => ({
          product: item.products as any,
          quantity: item.quantity
        }));
      setCart(cartItems);
    }

    setLoading(false);
  };

  const syncCartItem = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('session_id', sessionId)
        .eq('product_id', productId);
    } else {
      await supabase
        .from('cart_items')
        .upsert(
          {
            session_id: sessionId,
            product_id: productId,
            quantity
          },
          { onConflict: 'session_id,product_id' }
        );
    }

    await supabase
      .from('cart_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('session_id', sessionId);
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    const existingItem = cart.find(item => item.product.id === product.id);

    let newCart: CartItem[];
    if (existingItem) {
      newCart = cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCart = [...cart, { product, quantity }];
    }

    setCart(newCart);
    const item = newCart.find(i => i.product.id === product.id);
    if (item) {
      await syncCartItem(product.id, item.quantity);
    }
  };

  const removeFromCart = async (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
    await syncCartItem(productId, 0);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    const newCart = cart.map(item =>
      item.product.id === productId
        ? { ...item, quantity }
        : item
    );
    setCart(newCart);
    await syncCartItem(productId, quantity);
  };

  const clearCart = async () => {
    setCart([]);
    await supabase
      .from('cart_items')
      .delete()
      .eq('session_id', sessionId);
  };

  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    loading
  };
}
