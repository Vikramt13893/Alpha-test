import { Link } from 'react-router-dom';

export default function Settings() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">Settings</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Account and app preferences will live here. For now this page is a placeholder.
      </p>
      <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
        <h2 className="text-sm font-medium text-zinc-300">Session</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Sign in or out from the header. JWT tokens are stored in the browser for API access.
        </p>
      </div>
      <p className="mt-8">
        <Link to="/" className="text-sm text-emerald-500 hover:text-emerald-400">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
