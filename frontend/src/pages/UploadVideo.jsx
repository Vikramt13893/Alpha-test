import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCategories, uploadVideo } from '../api/client.js';

export default function UploadVideo() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categoryOptions, setCategoryOptions] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchCategories()
      .then((data) => {
        if (!cancelled) setCategoryOptions(data.items ?? []);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message ?? 'Could not load categories');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    if (!file) {
      setError('Choose a video file.');
      return;
    }
    if (!category) {
      setError('Select a category.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await uploadVideo({ file, title, description, category });
      navigate('/');
    } catch (err) {
      setError(err.message ?? 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="mb-6">
        <Link to="/my-space" className="text-sm text-emerald-500 hover:text-emerald-400">
          ← Back to My Space
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-zinc-50">Upload video</h1>
        <p className="mt-1 text-sm text-zinc-500">Pick a category from the catalog. Files are stored on the server for playback.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300">Video file</label>
          <input
            type="file"
            accept="video/*,.mp4,.webm,.mov"
            required
            className="mt-1 block w-full text-sm text-zinc-300 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-zinc-100"
            onChange={(ev) => setFile(ev.target.files?.[0] ?? null)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300">Category</label>
          {categoryOptions === null ? (
            <p className="mt-1 text-sm text-zinc-500">Loading categories…</p>
          ) : (
            <select
              required
              value={category}
              onChange={(ev) => setCategory(ev.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              <option value="" disabled>
                Choose a category…
              </option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            placeholder="Optional"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            placeholder="Optional"
          />
        </div>
        {error && (
          <p className="rounded-md border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">{error}</p>
        )}
        <button
          type="submit"
          disabled={busy || categoryOptions === null}
          className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {busy ? 'Uploading…' : 'Upload'}
        </button>
      </form>
    </div>
  );
}
