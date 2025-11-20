// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
// import { CartProvider } from './contexts/CartContext'; // if created later, keep it
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
        <App />
      
    </AuthProvider>
    <ToastContainer position="top-right" autoClose={3000} />
  </React.StrictMode>
);
