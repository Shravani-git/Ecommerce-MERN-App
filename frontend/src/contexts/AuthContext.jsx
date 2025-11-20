// src/contexts/AuthContext.jsx
import React, { createContext, useEffect, useState, useCallback } from 'react';
import api, { setAuthToken } from '../api';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload || !payload.exp) return true;
    const expMs = payload.exp * 1000;
    return Date.now() > expMs;
  } catch (e) {
    // invalid token format
    return true;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // logout supports silent mode to avoid duplicate toasts (used by interceptor)
  const logout = useCallback((silent = false) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setAuthToken(null);
    if (!silent) toast.info('Logged out');
  }, []);

  // set axios header whenever token changes
  useEffect(() => {
    if (token) setAuthToken(token);
    else setAuthToken(null);
  }, [token]);

  // on app start: validate token from storage (auto-logout if expired)
  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) {
      if (isTokenExpired(t)) {
        // expired — clear silently and inform user
        logout(true);
        toast.info('Session expired — please log in again');
      } else {
        // valid token: restore to state & axios header
        setToken(t);
        try {
          const u = JSON.parse(localStorage.getItem('user'));
          setUser(u || null);
        } catch {
          setUser(null);
        }
        setAuthToken(t);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // attach response interceptor to auto-logout on 401 Unauthorized
  useEffect(() => {
    const id = api.interceptors.response.use(
      res => res,
      err => {
        if (err?.response?.status === 401) {
          // token invalid/expired server-side — silently clear and show message
          logout(true);
          toast.info('Session expired — please log in again');
        }
        return Promise.reject(err);
      }
    );

    return () => {
      api.interceptors.response.eject(id);
    };
  }, [logout]);

  // register
  const register = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { email, password });
      const { token: t, user: u } = res.data;
      localStorage.setItem('token', t);
      localStorage.setItem('user', JSON.stringify(u));
      setToken(t);
      setUser(u);
      toast.success('Registered — logged in!');
      return { ok: true, data: res.data };
    } catch (err) {
      const msg = err?.response?.data?.message || 'Register failed';
      toast.error(msg);
      return { ok: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // login
  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: t, user: u } = res.data;
      localStorage.setItem('token', t);
      localStorage.setItem('user', JSON.stringify(u));
      setToken(t);
      setUser(u);
      toast.success('Logged in successfully');
      return { ok: true, data: res.data };
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { ok: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
