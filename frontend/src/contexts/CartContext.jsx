import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { token } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // small token expiry helper (kept local to avoid circular import)
  const isTokenExpiredLocal = (t) => {
    if (!t) return true;
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      if (!payload || !payload.exp) return true;
      return Date.now() > payload.exp * 1000;
    } catch {
      return true;
    }
  };

  // helper to check if axios has the auth header set
  const authHeaderPresent = () => !!(api.defaults && api.defaults.headers && api.defaults.headers.common && api.defaults.headers.common['Authorization']);

  // fetch cart - wrapped in useCallback so identity is stable across renders
  const fetchCart = useCallback(async () => {
    // If there's no token, skip
    if (!token) {
      console.log('fetchCart: no token — skipping cart load');
      setItems([]);
      setTotal(0);
      return { ok: true, items: [], total: 0 };
    }

    // If token exists but is expired, skip and let AuthContext handle logout+toast
    if (isTokenExpiredLocal(token)) {
      console.log('fetchCart: token expired — skipping cart load');
      setItems([]);
      setTotal(0);
      return { ok: false, error: 'token_expired' };
    }

    // small guard: wait a short time if axios header not yet attached (race safety)
    if (!authHeaderPresent()) {
      let waited = 0;
      while (!authHeaderPresent() && waited < 300) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 50));
        waited += 50;
      }
      console.log('fetchCart: waited', waited, 'ms for auth header');

      // if header still not present, abort to avoid spamming requests that will 401
      if (!authHeaderPresent()) {
        console.warn('fetchCart: auth header still missing after wait — aborting fetchCart');
        setItems([]);
        setTotal(0);
        return { ok: false, error: 'no_auth_header' };
      }
    }

    setLoading(true);
    let mounted = true;
    try {
      const res = await api.get('/cart');
      if (mounted) {
        setItems(res.data.items || []);
        setTotal(res.data.total || 0);
      }
      return { ok: true, items: res.data.items || [], total: res.data.total || 0 };
    } catch (err) {
      console.error('fetchCart error', err);
      if (err?.response?.status === 401) {
        console.warn('fetchCart: 401 Unauthorized — likely token expired');
        setItems([]);
        setTotal(0);
        return { ok: false, error: 'unauthorized' };
      }
      return { ok: false, error: err };
    } finally {
      if (mounted) setLoading(false);
    }
  }, [token]);

  // effect to call fetchCart when token changes
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // small microtask delay to let auth setup (only if needed); not usually required
      await new Promise((r) => setTimeout(r, 0));
      if (!cancelled) await fetchCart();
    })();

    return () => { cancelled = true; };
  }, [token, fetchCart]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    try {
      await api.post('/cart', { productId, quantity });
      await fetchCart();
      return { ok: true };
    } catch (err) {
      console.error('addToCart error', err);
      return { ok: false, error: err };
    }
  }, [fetchCart]);

  const updateQuantity = useCallback(async (cartItemId, quantity) => {
    try {
      await api.put(`/cart/${cartItemId}`, { quantity });
      await fetchCart();
      return { ok: true };
    } catch (err) {
      console.error('updateQuantity error', err);
      return { ok: false, error: err };
    }
  }, [fetchCart]);

  const removeItem = useCallback(async (cartItemId) => {
    try {
      await api.delete(`/cart/${cartItemId}`);
      await fetchCart();
      return { ok: true };
    } catch (err) {
      console.error('removeItem error', err);
      return { ok: false, error: err };
    }
  }, [fetchCart]);

  return (
    <CartContext.Provider value={{ items, total, loading, fetchCart, addToCart, updateQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}
