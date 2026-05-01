import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchPlaybackUrl, fetchVideo, recordView } from '../api/client.js';

export default function Watch() {
  const { videoId } = useParams();
  const [meta, setMeta] = useState(null);
  const [src, setSrc] = useState(null);
  const [error, setError] = useState(null);
  const viewSent = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setMeta(null);
    setSrc(null);
    viewSent.current = false;

    async function load() {
      try {
        const m = await fetchVideo(videoId);
        if (cancelled) return;
        if (!m) {
          setError('Video not found.');
          return;
        }
        setMeta(m);
        const p = await fetchPlaybackUrl(videoId);
        if (cancelled) return;
        if (!p?.url) {
          setError('Playback unavailable.');
          return;
        }
        setSrc(p.url);
      } catch (e) {
        if (!cancelled) setError(e.message ?? 'Failed to load');
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [videoId]);

  function onPlayOnce() {
    if (viewSent.current || !videoId) return;
    viewSent.current = true;
    recordView(videoId).catch(() => {});
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/" className="text-sm text-emerald-500 hover:text-emerald-400">
        ← Home
      </Link>
      {error && (
        <p className="mt-6 rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">{error}</p>
      )}
      {meta && (
        <div className="mt-6">
          <h1 className="text-xl font-semibold text-zinc-50">{meta.title}</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {meta.viewCount.toLocaleString()} views · {meta.durationSeconds}s
            {meta.category ? ` · ${meta.category}` : ''}
          </p>
          {meta.description && <p className="mt-4 text-zinc-400">{meta.description}</p>}
        </div>
      )}
      <div className="mt-6 overflow-hidden rounded-xl border border-zinc-800 bg-black">
        {src ? (
          <video
            className="aspect-video w-full bg-black"
            controls
            playsInline
            src={src}
            onPlaying={onPlayOnce}
          />
        ) : (
          !error && <div className="aspect-video flex items-center justify-center text-zinc-600">Loading player…</div>
        )}
      </div>
    </div>
  );
}
