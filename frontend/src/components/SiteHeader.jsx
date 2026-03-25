import { Link } from 'react-router-dom';
import vicLogo from '../../assets/VIC Logo.JPG';
import { useThemeMode } from '../context/ThemeContext';

export default function SiteHeader() {
  const { isDark } = useThemeMode();

  return (
    <header className={`border-b ${isDark ? 'border-[#2a3a52] bg-[#111a2c]' : 'border-slate-200 bg-white'}`}>
      <div className="institution-section flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <img src={vicLogo} alt="VIC Logo" className="h-24 w-24 object-cover" />
          <div>
            <p className={`text-xs uppercase tracking-[0.16em] ${isDark ? 'text-[#9aa9c0]' : 'text-slate-500'}`}>Vidya University, Meerut</p>
            <h1 className={`font-head text-3xl font-bold md:text-4xl ${isDark ? 'text-[#e5edf8]' : 'text-slate-900'}`}>Vidya Innovation Club</h1>
            <p className={`text-sm ${isDark ? 'text-[#9aa9c0]' : 'text-slate-500'}`}>Innovation, Research and Student Entrepreneurship Ecosystem</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/login"
            className={`inline-flex items-center border px-4 py-2 text-sm font-semibold hover:border-cyan hover:text-cyan ${isDark ? 'border-[#2a3a52] bg-[#172338] text-[#e5edf8]' : 'border-slate-300 bg-slate-100 text-slate-800'}`}
          >
            Admin Login
          </Link>
          <a
            href="https://www.vidya.edu.in"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center border border-cyan bg-cyan px-4 py-2 text-sm font-semibold text-white hover:bg-gov-brandStrong"
          >
            University Site
          </a>
        </div>
      </div>
    </header>
  );
}
