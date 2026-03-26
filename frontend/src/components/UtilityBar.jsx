import { Link } from 'react-router-dom';
import { useTicker } from '../hooks/useData';
import { useThemeMode } from '../context/ThemeContext';

export default function UtilityBar() {
  const { data } = useTicker();
  const { isDark, toggleMode } = useThemeMode();
  const now = new Date().toLocaleString('en-IN', { hour12: true });

  return (
    <div>
      <div className={`border-b text-[12px] ${isDark ? 'border-[#2a3a52] bg-[#172338] text-[#9aa9c0]' : 'border-slate-200 bg-slate-100 text-slate-600'}`}>
        <div className="institution-section flex items-center justify-between py-2">
          <p>{now}</p>
          <div className="flex items-center gap-5 font-medium">
            <Link
              to="/sitemap"
              aria-label="Sitemap"
              className={`inline-flex h-9 w-9 items-center justify-center border text-base transition-colors hover:border-cyan hover:text-cyan ${isDark ? 'border-[#2a3a52] bg-[#111a2c] text-[#e5edf8]' : 'border-slate-300 bg-white text-slate-800'}`}
              title="Sitemap"
            >
              ◰
            </Link>
            <button
              type="button"
              onClick={toggleMode}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className={`inline-flex h-9 w-9 items-center justify-center border text-base transition-colors hover:border-cyan hover:text-cyan ${isDark ? 'border-[#2a3a52] bg-[#111a2c] text-[#e5edf8]' : 'border-slate-300 bg-white text-slate-800'}`}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? '☀' : '☾'}
            </button>
            <a href="#main-content" className="hover:text-cyan">Skip to main content</a>
            <a href="#" className="hover:text-cyan">Accessibility</a>
          </div>
        </div>
      </div>

      {data?.length ? (
        <div className={`border-b ${isDark ? 'border-[#2a3a52] bg-[#111a2c] text-[#e5edf8]' : 'border-slate-200 bg-white text-slate-900'}`}>
          <div className="institution-section utility-marquee py-2.5 text-sm">
            {data.map((item) => (
              <span key={item.id} className="mr-8 inline-flex items-center">
                <span className="mr-2 text-cyan">Notice:</span>
                {item.link ? (
                  <a className={`font-medium underline-offset-2 hover:text-cyan hover:underline ${isDark ? 'text-[#e5edf8]' : 'text-slate-900'}`} href={item.link} target="_blank" rel="noreferrer">
                    {item.message}
                  </a>
                ) : (
                  <span className="font-medium">{item.message}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
