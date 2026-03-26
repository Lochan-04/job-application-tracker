import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login?logged_out=1");
  };

  return (
    <div className="min-h-screen bg-canvas font-body text-ink antialiased">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(217,236,255,0.9),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(243,185,79,0.22),_transparent_25%),linear-gradient(180deg,_#f8fbff_0%,_#f5f7fb_55%,_#edf3fb_100%)]"></div>
        <div className="absolute left-[-8rem] top-[-5rem] h-72 w-72 rounded-full bg-gold/30 blur-3xl"></div>
        <div className="absolute right-[-4rem] top-24 h-80 w-80 rounded-full bg-sky/80 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-coral/20 blur-3xl"></div>
      </div>

      {user && (
        <header className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-navy text-lg font-bold text-canvas shadow-card">PT</div>
            <div>
              <p className="font-display text-xl font-bold">Placement Tracker</p>
              <p className="text-sm text-slate">Keep track of applications, interviews, and follow-ups.</p>
            </div>
          </Link>
          <nav className="flex flex-wrap items-center gap-3 text-sm font-medium">
            <NavLink className="rounded-full border border-ink/10 bg-white/80 px-4 py-2 text-slate transition hover:-translate-y-0.5 hover:bg-white" to="/">
              Overview
            </NavLink>
            <NavLink className="rounded-full border border-ink/10 bg-white/80 px-4 py-2 text-slate transition hover:-translate-y-0.5 hover:bg-white" to="/applications">
              Applications
            </NavLink>
            <NavLink className="rounded-full bg-navy px-4 py-2 text-canvas transition hover:-translate-y-0.5" to="/applications/new">
              Add application
            </NavLink>
            <button className="rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-slate transition hover:bg-white" onClick={handleLogout} type="button">
              Log out
            </button>
          </nav>
        </header>
      )}

      <main className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
