import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import VideoGrid from '../components/VideoGrid.jsx';
import { fetchMyVideos } from '../api/client.js';

export default function MySpace() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    fetchMyVideos()
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
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">My Space</h1>
          <p className="mt-1 text-sm text-zinc-500">Videos you uploaded on this browser.</p>
        </div>
        <Link
          to="/my-space/upload"
          className="shrink-0 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Upload video
        </Link>
      </div>
      {error && (
        <p className="mb-4 rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}
      {items === null ? (
        <p className="text-zinc-500">Loading…</p>
      ) : (
        <VideoGrid items={items} emptyMessage="You have not uploaded any videos yet." />
      )}
    </div>
  );
}
