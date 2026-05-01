import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../api/client.js';

export default function Categories() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchCategories()
      .then((data) => {
        if (!cancelled) setItems(data.items ?? []);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">Categories</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Same catalog as upload. Open a category to filter the home feed by that label.
      </p>
      {error && (
        <p className="mt-4 rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">{error}</p>
      )}
      {items === null ? (
        <p className="mt-8 text-zinc-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-zinc-500">No categories returned from the API.</p>
      ) : (
        <ul className="mt-8 flex flex-wrap gap-2">
          {items.map((c) => (
            <li key={c}>
              <Link
                to={`/?category=${encodeURIComponent(c)}`}
                className="inline-block rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-200 transition hover:border-emerald-600/50 hover:text-emerald-400"
              >
                {c}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
