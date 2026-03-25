import { NavLink } from 'react-router-dom';
import { useThemeMode } from '../context/ThemeContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' }
];

export default function Navbar() {
  const { isDark } = useThemeMode();

  return (
    <nav className={`sticky top-0 z-40 border-b ${isDark ? 'border-[#2a3a52] bg-[#111a2c]' : 'border-slate-200 bg-white'}`}>
      <div className="institution-section flex gap-1 overflow-x-auto py-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `whitespace-nowrap border-b-2 px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors ${
                isActive
                  ? 'border-cyan text-cyan'
                  : isDark
                    ? 'border-transparent text-[#9aa9c0] hover:text-[#e5edf8]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
