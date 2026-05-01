import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, email, logout } = useAuth();

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
          <label className="hidden min-w-0 flex-1 sm:block">
            <span className="sr-only">Search</span>
            <input
              type="search"
              placeholder="Search videos…"
              disabled
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-400 placeholder:text-zinc-600"
            />
          </label>
        </div>
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-md px-2 py-1 text-zinc-500">Categories</span>
          <span className="rounded-md px-2 py-1 text-zinc-500">Settings</span>
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
    </header>
  );
}
