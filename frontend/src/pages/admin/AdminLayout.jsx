import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../context/ThemeContext';

const links = [
  { to: '/admin', label: 'Dashboard', icon: 'DB' },
  { to: '/admin/ticker', label: 'Ticker Items', icon: 'TK' },
  { to: '/admin/announcements', label: 'Announcements', icon: 'AN' },
  { to: '/admin/events', label: 'Events', icon: 'EV' },
  { to: '/admin/gallery', label: 'Gallery', icon: 'GL' },
  { to: '/admin/blog', label: 'Blog Posts', icon: 'BL' },
  { to: '/admin/team', label: 'Team Members', icon: 'TM' }
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { isAdminDark, toggleAdminMode } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();

  const current = links.find((l) => l.to === location.pathname)?.label || 'Dashboard';
  const now = new Date().toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' });
  const adminThemeVars = isAdminDark
    ? {
        '--gov-bg': '#0b1220',
        '--gov-surface': '#111a2c',
        '--gov-panel': '#172338',
        '--gov-ink': '#e5edf8',
        '--gov-muted': '#9aa9c0',
        '--gov-line': '#2a3a52'
      }
    : {
        '--gov-bg': '#f3f4f6',
        '--gov-surface': '#ffffff',
        '--gov-panel': '#eef2f5',
        '--gov-ink': '#111827',
        '--gov-muted': '#4b5563',
        '--gov-line': '#cbd5e1'
      };

  return (
    <div className="admin-shell min-h-screen text-gov-ink md:flex" style={adminThemeVars}>
      <aside className={`w-full border-b border-gov-line md:fixed md:inset-y-0 md:w-72 md:border-b-0 md:border-r ${isAdminDark ? 'bg-[#0f1a30]' : 'bg-gov-surface'}`}>
        <div className="p-6">
          <div className={`mb-6 rounded-2xl border p-4 shadow-[0_12px_28px_-20px_rgba(18,79,92,0.65)] ${isAdminDark ? 'border-cyan/25 bg-gov-panel' : 'border-cyan/20 bg-gradient-to-b from-cyan/10 to-gov-panel'}`}>
            <div className="mb-2 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl border font-head font-semibold text-cyan ${isAdminDark ? 'border-cyan/35 bg-[#10243d]' : 'border-cyan/30 bg-cyan/10'}`}>VIC</div>
              <div>
                <h2 className="font-head text-lg font-semibold text-gov-ink">Admin Workspace</h2>
                <p className="text-xs text-gov-muted">Operational Console</p>
              </div>
            </div>
            <p className="text-xs text-gov-muted">Track, edit, and publish club content in realtime.</p>
          </div>

          <nav className="grid gap-1 md:block">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/admin'}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? 'border-cyan/35 bg-cyan/10 text-cyan'
                      : 'border-transparent text-gov-muted hover:border-gov-line hover:bg-gov-panel hover:text-gov-ink'
                  }`
                }
              >
                <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg border border-gov-line bg-gov-surface text-[11px] font-semibold tracking-wide text-gov-muted group-hover:border-cyan/30 group-hover:text-cyan">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="border-t border-gov-line p-6">
          <p className="text-sm font-semibold text-gov-ink">{user?.full_name}</p>
          <p className="text-xs text-gov-muted">{now}</p>
          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="mt-3 w-full rounded-xl border border-gov-line bg-gov-surface px-4 py-2 text-sm font-semibold text-gov-ink hover:border-cyan hover:text-cyan"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="md:ml-72 md:flex-1">
        <header className="sticky top-0 z-30 border-b border-gov-line bg-gov-surface px-4 py-4 backdrop-blur md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="admin-label">VIC Admin</p>
              <h1 className="font-head text-3xl font-semibold text-gov-ink">{current}</h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleAdminMode}
                aria-label={isAdminDark ? 'Switch admin to light mode' : 'Switch admin to dark mode'}
                className="rounded-xl border border-gov-line bg-gov-surface px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gov-ink hover:border-cyan hover:text-cyan"
                title={isAdminDark ? 'Light mode' : 'Dark mode'}
              >
                {isAdminDark ? 'Light' : 'Dark'}
              </button>
              <div className="hidden items-center rounded-xl border border-gov-line bg-gov-panel px-3 py-2 md:flex">
                <input
                  type="text"
                  placeholder="Search modules..."
                  className="w-44 bg-transparent text-sm text-gov-ink outline-none placeholder:text-gov-muted"
                />
              </div>
              <a href="/" target="_blank" rel="noreferrer" className="rounded-xl border border-gov-line bg-gov-surface px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan hover:border-cyan/35">
                View Site
              </a>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
