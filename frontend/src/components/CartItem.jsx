// src/components/CartItem.jsx
import React from 'react';
import { HiTrash } from 'react-icons/hi';

export default function CartItem({ item, onRemove, onUpdateQuantity }) {
  // item assumed: { _id, productId: { _id, title, price, images, category, stock }, quantity }
  const product = item.productId || {};
  const img = product.images?.[0] || '/mnt/data/Cart.png';

  return (
    <div className="flex gap-4 bg-white p-4 rounded-lg shadow-sm">
      <div className="w-28 h-28 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
        <img src={img} alt={product.title} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{product.title}</h3>
            <div className="text-sm text-gray-500">{product.category}</div>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-400 line-through">{product.originalPrice ? `₹${product.originalPrice}` : ''}</div>
            <div className="text-lg font-bold text-indigo-700">₹{product.price}</div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
            <p className="text-sm text-gray-600">{product.description}</p>
        </div>

        {/* <div className="mt-4 flex items-center gap-4">
          
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600">Color</div>
            <select className="border rounded px-2 py-1 text-sm">
              <option>Brown</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600">Size</div>
            <select className="border rounded px-2 py-1 text-sm">
              <option>XL</option>
            </select>
          </div>
        </div> */}

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center border rounded">
            <button onClick={() => onUpdateQuantity(item._id, Math.max(1, item.quantity - 1))} className="px-3 py-1">-</button>
            <div className="px-4">{item.quantity}</div>
            <button onClick={() => onUpdateQuantity(item._id, item.quantity + 1)} className="px-3 py-1">+</button>
          </div>

          <button onClick={() => onRemove(item._id)} className="p-2 rounded border text-gray-600 hover:bg-gray-50">
            <HiTrash className="w-5 h-5" />
          </button>

        </div>
      </div>
    </div>
  );
}
