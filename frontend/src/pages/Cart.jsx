// src/pages/Cart.jsx
import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CartItem from "../components/CartItem";
import ProductCard from "../components/ProductCard"; // reuse earlier card
import Pagination from "../components/Pagination";
import api from "../api";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";

export default function CartPage() {
  const { items, total, loading, fetchCart, updateQuantity, removeItem } =
    useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [recommended, setRecommended] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // make sure cart is fetched (CartProvider already fetches on token change)
    fetchCart();
    // fetch recommended products (simple endpoint)
    (async () => {
      try {
        const res = await api.get("/products", {
          params: { limit: 3, page: 1 },
        });
        setRecommended(res.data.products || []);
      } catch (err) {
        console.error("recommended load", err);
      }
    })();
    // eslint-disable-next-line
  }, []);

  // compute discount example (10% if > 3 items) — tweak as you like
  const rawTotal = total || 0;
  const discount = rawTotal > 5000 ? Math.round(rawTotal * 0.1) : 0;
  const grandTotal = rawTotal - discount;

  const handleUpdateQuantity = (cartItemId, qty) => {
    updateQuantity(cartItemId, qty);
  };

  const handleRemove = (cartItemId) => {
    removeItem(cartItemId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={() => {}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: cart list */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-2xl font-semibold">Your Cart</h2>

            {loading ? (
              <div className="p-6 bg-white rounded shadow text-center">
                Loading cart...
              </div>
            ) : items.length === 0 ? (
              <div className="p-8 bg-white rounded shadow text-center">
                Your cart is empty.
              </div>
            ) : (
              items.map((it) => (
                <CartItem
                  key={it._id}
                  item={it}
                  onRemove={handleRemove}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              ))
            )}

            {/* Recommended */}
            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-4 border-t pt-6">
                Recommended Products
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommended.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: summary */}
          <aside className="lg:col-span-4">
            <div className="sticky top-20 space-y-4">
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-semibold text-lg mb-4">Order Summary</h4>

                <div className="space-y-3">
                  {/* list small rows */}
                  {items.slice(0, 6).map((it) => (
                    <div
                      key={it._id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex-1">
                        <div className="font-medium">
                          {it.productId?.title || "Product"}
                        </div>
                        <div className="text-gray-500 text-xs">
                          x{it.quantity}
                        </div>
                      </div>
                      <div className="font-semibold">
                        ₹{(it.productId?.price || 0) * it.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 border-t pt-4 text-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div>Total</div>
                    <div>₹{rawTotal}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Discount</div>
                    <div>- ₹{discount}</div>
                  </div>
                  <div className="flex items-center justify-between font-bold text-lg">
                    <div>Grand Total</div>
                    <div>₹{grandTotal}</div>
                  </div>

                  <button className="mt-4 w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800">
                    Checkout
                  </button>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h5 className="font-semibold mb-2">Need Help?</h5>
                <p className="text-sm text-gray-600">
                  Contact support or check our returns & delivery policy.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
