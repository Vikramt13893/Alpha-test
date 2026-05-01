import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Header() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, email, logout } = useAuth();
  const [qInput, setQInput] = useState(() => searchParams.get('q') ?? '');

  useEffect(() => {
    setQInput(searchParams.get('q') ?? '');
  }, [searchParams]);

  function onSearchSubmit(e) {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    const trimmed = qInput.trim();
    if (trimmed) next.set('q', trimmed);
    else next.delete('q');
    const qs = next.toString();
    navigate({ pathname: '/', search: qs ? `?${qs}` : '' });
  }

  return (
    <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-sm text-white">
              α
            </span>
            Alpha
          </Link>
          <form
            onSubmit={onSearchSubmit}
            className="hidden min-w-0 flex-1 sm:block"
            role="search"
          >
            <label className="sr-only" htmlFor="global-search">
              Search videos
            </label>
            <input
              id="global-search"
              type="search"
              name="q"
              placeholder="Search by title…"
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              autoComplete="off"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </form>
        </div>
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              [
                'rounded-md px-2 py-1 transition-colors',
                isActive ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200',
              ].join(' ')
            }
          >
            Categories
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              [
                'rounded-md px-2 py-1 transition-colors',
                isActive ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200',
              ].join(' ')
            }
          >
            Settings
          </NavLink>
          {isAuthenticated ? (
            <>
              <span className="hidden max-w-[12rem] truncate text-zinc-400 sm:inline" title={email}>
                {email}
              </span>
              <NavLink
                to="/my-space"
                className={({ isActive }) =>
                  [
                    'rounded-md px-3 py-1.5 font-medium transition-colors',
                    isActive ? 'bg-emerald-700 text-white' : 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700',
                  ].join(' ')
                }
              >
                My Space
              </NavLink>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="rounded-md bg-zinc-800 px-3 py-1.5 font-medium text-zinc-100 hover:bg-zinc-700"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md px-3 py-1.5 font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-zinc-800 px-3 py-1.5 font-medium text-zinc-100 hover:bg-zinc-700"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
      <form onSubmit={onSearchSubmit} className="border-t border-zinc-800 px-4 py-2 sm:hidden">
        <label className="sr-only" htmlFor="global-search-mobile">
          Search videos
        </label>
        <input
          id="global-search-mobile"
          type="search"
          placeholder="Search by title…"
          value={qInput}
          onChange={(e) => setQInput(e.target.value)}
          autoComplete="off"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
        />
      </form>
    </header>
  );
}
