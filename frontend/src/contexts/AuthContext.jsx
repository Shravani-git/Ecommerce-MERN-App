// src/contexts/AuthContext.jsx
import React, { createContext, useEffect, useState, useCallback, useRef } from 'react';
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

  // ref to ensure we show the session-expired toast only once per "session end".
  const sessionExpiredShownRef = useRef(false);

  // logout supports silent mode so callers can decide whether toast is shown.
  const logout = useCallback((silent = false) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setAuthToken(null);
    if (!silent && !sessionExpiredShownRef.current) {
      toast.info('Logged out');
    }
  }, []);

  // set axios auth header whenever token changes
  useEffect(() => {
    if (token) setAuthToken(token);
    else setAuthToken(null);
  }, [token]);

  // on mount: validate token & show ONE "session expired" toast if needed
  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) {
      if (isTokenExpired(t)) {
        // mark shown so interceptor doesn't duplicate
        sessionExpiredShownRef.current = true;
        // silently clear auth state then show a single toast
        logout(true);
        toast.info('Session expired — please log in again');
      } else {
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
  }, []); // run once

  // interceptor: if server responds 401, logout silently and show toast only if not already shown
  useEffect(() => {
    const id = api.interceptors.response.use(
      res => res,
      err => {
        if (err?.response?.status === 401) {
          // ensure we only show the session-expired toast once
          if (!sessionExpiredShownRef.current) {
            sessionExpiredShownRef.current = true;
            logout(true); // clear without "Logged out" toast
            toast.info('Session expired — please log in again');
          } else {
            // already shown; just logout silently
            logout(true);
          }
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
      // attach token immediately to axios to avoid race
      setAuthToken(t);
      sessionExpiredShownRef.current = false; // reset the toast guard for new session
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
      // attach token immediately
      setAuthToken(t);
      sessionExpiredShownRef.current = false; // reset guard
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
