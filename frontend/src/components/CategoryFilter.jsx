import React from 'react';

export default function CategoryFilter({ categories = [], selected, onSelect }) {
  return (
    <aside className="w-full max-w-xs">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h4 className="font-semibold mb-3">Categories</h4>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => onSelect('')}
              className={`text-sm block w-full text-left ${selected === '' ? 'font-semibold text-indigo-600' : 'text-gray-600'}`}
            >
              All
            </button>
          </li>
          {categories.map(cat => (
            <li key={cat}>
              <button
                onClick={() => onSelect(cat)}
                className={`text-sm block w-full text-left ${selected === cat ? 'font-semibold text-indigo-600' : 'text-gray-600'}`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
