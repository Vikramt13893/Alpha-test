import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import VideoGrid from '../components/VideoGrid.jsx';
import { fetchTrendingVideos, searchVideos } from '../api/client.js';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q')?.trim() ?? '';
  const category = searchParams.get('category')?.trim() ?? '';

  const mode = useMemo(() => {
    if (q || category) return 'search';
    return 'trending';
  }, [q, category]);

  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);

    const load = async () => {
      try {
        if (mode === 'search') {
          const data = await searchVideos({ q: q || undefined, category: category || undefined, limit: 24 });
          if (!cancelled) setItems(data.items ?? []);
        } else {
          const data = await fetchTrendingVideos(24);
          if (!cancelled) setItems(data.items ?? []);
        }
      } catch (e) {
        if (!cancelled) setError(e.message ?? 'Failed to load');
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [mode, q, category]);

  function clearFilters() {
    setSearchParams({});
  }

  const title = mode === 'search' ? 'Search results' : 'Trending';
  const subtitle =
    mode === 'search'
      ? [q && `Title contains “${q}”`, category && `Category: ${category}`].filter(Boolean).join(' · ') ||
        'Filtered list'
      : 'Sorted by views; newest among ties floats up.';

  const emptyMessage =
    mode === 'search'
      ? 'No videos match your filters. Try different words or pick another category.'
      : 'No videos yet. Open My Space → Upload video to add one.';

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">{title}</h1>
          <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
        </div>
        {mode === 'search' && (
          <button
            type="button"
            onClick={clearFilters}
            className="shrink-0 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800"
          >
            Clear filters
          </button>
        )}
      </div>
      {error && (
        <p className="mb-4 rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          Could not load videos: {error}
        </p>
      )}
      {items === null ? (
        <p className="text-zinc-500">Loading…</p>
      ) : (
        <>
          <VideoGrid items={items} emptyMessage={emptyMessage} />
          {mode === 'search' && items.length > 0 && (
            <p className="mt-6 text-center text-sm text-zinc-600">
              Want the full catalog?{' '}
              <Link to="/" className="text-emerald-500 hover:text-emerald-400">
                Show trending
              </Link>
            </p>
          )}
        </>
      )}
    </div>
  );
}
