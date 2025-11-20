import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import { HiOutlineShoppingCart, HiLogout } from 'react-icons/hi';

export default function Navbar({ onSearch }) {
  const { user, logout } = useContext(AuthContext);
  const { items } = useContext(CartContext);
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const cartCount = items?.length || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(q);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 px-3 py-1 rounded-t-full rounded-b-lg rounded-r-lg rounded-l-full ">
            <Link to="/" className="text-2xl font-extrabold text-purple-900 ">satva</Link>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4 hidden sm:flex">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 border rounded-l-lg focus:outline-none"
            />
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-r-lg">Search</button>
          </form>

          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/cart')} className="relative p-2 rounded hover:bg-gray-100">
              <HiOutlineShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-orange-500 text-white rounded-full px-1.5">{cartCount}</span>
              )}
            </button>

            {user ? (
              <>
                <div className="text-sm hidden sm:block">Hello, <span className="font-medium">{user.email}</span></div>
                <button
                  onClick={() => { logout(); navigate('/login'); }}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
                >
                  <HiLogout className="w-5 h-5" /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="px-3 py-1 bg-indigo-600 text-white rounded">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
