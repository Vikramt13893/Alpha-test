import { useEffect, useState } from 'react';
import VideoGrid from '../components/VideoGrid.jsx';
import { fetchTrendingVideos } from '../api/client.js';

export default function Home() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    fetchTrendingVideos(24)
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
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">Trending</h1>
        <p className="mt-1 text-sm text-zinc-500">Sorted by views; newest among ties floats up.</p>
      </div>
      {error && (
        <p className="mb-4 rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          Could not load videos: {error}
        </p>
      )}
      {items === null ? (
        <p className="text-zinc-500">Loading…</p>
      ) : (
        <VideoGrid
          items={items}
          emptyMessage="No videos yet. Open My Space → Upload video to add one."
        />
      )}
    </div>
  );
}
