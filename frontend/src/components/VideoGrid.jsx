import { Link } from 'react-router-dom';

export default function VideoGrid({ items, emptyMessage }) {
  if (!items?.length) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50 px-4 py-12 text-center text-zinc-500">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((v) => (
        <li key={v.id}>
          <Link
            to={`/watch/${v.id}`}
            className="group block overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80 transition hover:border-emerald-700/60"
          >
            <div className="aspect-video bg-zinc-950 flex items-center justify-center text-zinc-600">
              {v.thumbnailUrl ? (
                <img src={v.thumbnailUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm">Video</span>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-medium text-zinc-100 group-hover:text-emerald-400 line-clamp-2">{v.title}</h3>
              <p className="mt-1 text-xs text-zinc-500">
                {v.viewCount.toLocaleString()} views · {v.durationSeconds}s
                {v.category ? ` · ${v.category}` : ''}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
