import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product, onAdd }) {
  // product: {_id, title, price, images, category}
  const img = product.images?.[0] ;
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
          <button onClick={() => onAdd(product._id)} className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
