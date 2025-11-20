import React from 'react';

export default function Pagination({ page, pages, onPage }) {
  const prev = () => onPage(Math.max(1, page - 1));
  const next = () => onPage(Math.min(pages, page + 1));

  // simple range
  const start = Math.max(1, page - 2);
  const end = Math.min(pages, start + 4);

  const pagesArr = [];
  for (let i = start; i <= end; i++) pagesArr.push(i);

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button onClick={prev} disabled={page === 1} className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50">Prev</button>
      {start > 1 && <span className="px-2">...</span>}
      {pagesArr.map(p => (
        <button key={p} onClick={() => onPage(p)} className={`px-3 py-1 rounded ${p === page ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>{p}</button>
      ))}
      {end < pages && <span className="px-2">...</span>}
      <button onClick={next} disabled={page === pages} className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50">Next</button>
    </div>
  );
}
