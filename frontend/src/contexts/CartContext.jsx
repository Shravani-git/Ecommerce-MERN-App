import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { token } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
  // 🛑 1. Skip API call if no token
  if (!token) {
    console.log("fetchCart: no token — skipping cart load");
    setItems([]);
    setTotal(0);
    return;
  }

  console.log("fetchCart: token found, calling /cart");

  setLoading(true);
  try {
    const res = await api.get("/cart");
    console.log("fetchCart: success", res.data);

    setItems(res.data.items || []);
    setTotal(res.data.total || 0);
  } catch (err) {
    console.error("fetchCart error:", err);

    // If backend returns 401 (token invalid / expired)
    if (err?.response?.status === 401) {
      console.warn("fetchCart: 401 Unauthorized — token invalid/expired");
      // you can optionally logout() here
      setItems([]);
      setTotal(0);
    }

    // If backend returns 500, log it so we can fix server
    if (err?.response?.status === 500) {
      console.error("Server crashed while fetching cart — check backend logs");
    }
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, [token]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      await api.post('/cart', { productId, quantity });
      await fetchCart();
      return { ok: true };
    } catch (err) {
      console.error('addToCart error', err);
      return { ok: false, error: err };
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      await api.put(`/cart/${cartItemId}`, { quantity });
      await fetchCart();
    } catch (err) {
      console.error('updateQuantity error', err);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await api.delete(`/cart/${cartItemId}`);
      await fetchCart();
    } catch (err) {
      console.error('removeItem error', err);
    }
  };

  return (
    <CartContext.Provider value={{ items, total, loading, fetchCart, addToCart, updateQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}
