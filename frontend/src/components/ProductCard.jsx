// src/components/ProductCard.jsx
import React, { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';

// fallback image (local path)
const FALLBACK_IMG = '/mnt/data/Cart.png';

export default function ProductCard({ product, onAdd }) {
  const { items, addToCart, updateQuantity, removeItem } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  // find cart item for this product (if exists)
  const cartItem = useMemo(() => items.find(it => String(it.productId?._id || it.productId) === String(product._id)), [items, product._id]);

  const img = product.images?.[0] || FALLBACK_IMG;

  const handleAdd = async () => {
    setLoading(true);
    // prefer passed onAdd prop if provided (keeps backward compatibility)
    if (onAdd) {
      await onAdd(product._id);
      setLoading(false);
      return;
    }
    const res = await addToCart(product._id, 1);
    setLoading(false);
    return res;
  };

  const handleInc = async () => {
    if (!cartItem) return;
    await updateQuantity(cartItem._id, cartItem.quantity + 1);
  };

  const handleDec = async () => {
    if (!cartItem) return;
    const newQty = cartItem.quantity - 1;
    if (newQty <= 0) {
      // remove item entirely
      await removeItem(cartItem._id);
    } else {
      await updateQuantity(cartItem._id, newQty);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
      <Link to={`/product/${product._id}`} className="block">
        <div className="w-full h-44 bg-gray-100 flex items-center justify-center overflow-hidden">
          <img src={img} alt={product.title} className="object-cover w-full h-full" />
        </div>
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <Link to={`/product/${product._id}`} className="text-sm text-gray-500">{product.category}</Link>
        <h3 className="mt-1 font-medium text-gray-900 text-lg">{product.title}</h3>

        <div className="mt-2 flex items-center justify-between">
          <div className="text-indigo-600 font-semibold">₹{product.price}</div>

          {/* If item exists in cart -> show qty controls, else show Add */}
          {cartItem ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDec}
                className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
                aria-label="decrease"
              >−</button>

              <div className="px-3 py-1 border rounded">{cartItem.quantity}</div>

              <button
                onClick={handleInc}
                className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
                aria-label="increase"
              >+</button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              disabled={loading}
              className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
            >
              {loading ? 'Adding...' : 'Add'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
