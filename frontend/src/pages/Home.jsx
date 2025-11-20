import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import Pagination from '../components/Pagination';
import { CartContext } from '../contexts/CartContext';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToCart } = useContext(CartContext);

  const LIMIT = 10;

  const fetchProducts = async (p = page, q = search, c = category) => {
    setLoading(true);
    try {
      const res = await api.get('/products', { params: { page: p, limit: LIMIT, search: q, category: c } });
      setProducts(res.data.products || []);
      setPages(res.data.pages || 1);
      setPage(res.data.page || p);
      // extract categories from returned products (if categories not provided separately)
      const cats = Array.from(new Set((res.data.products || []).map(x => x.category || '').filter(Boolean)));
      setCategories(cats);
    } catch (err) {
      console.error('fetchProducts err', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, search, category);
    // eslint-disable-next-line
  }, [search, category]);

  const handlePage = (p) => {
    fetchProducts(p, search, category);
  };

  const handleSearch = (q) => {
    setSearch(q);
    setPage(1);
  };

  const handleAdd = async (productId) => {
    const res = await addToCart(productId, 1);
    if (!res.ok) {
      // could show toast here
      alert('Add to cart failed. Make sure you are logged in.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={handleSearch} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <CategoryFilter categories={categories} selected={category} onSelect={setCategory} />
          </div>

          {/* Main */}
          <div className="lg:col-span-9">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Products</h2>
              <div className="text-sm text-gray-600">Showing page {page} of {pages}</div>
            </div>

            {loading ? (
              <div className="p-8 bg-white rounded-lg shadow text-center">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(p => (
                  <ProductCard key={p._id} product={p} onAdd={handleAdd} />
                ))}
              </div>
            )}

            <Pagination page={page} pages={pages} onPage={handlePage} />
          </div>
        </div>
      </div>
    </div>
  );
}
