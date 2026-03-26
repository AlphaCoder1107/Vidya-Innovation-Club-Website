import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { useThemeMode } from '../context/ThemeContext';

const sitemapSections = [
  {
    title: 'Primary Navigation',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Events', to: '/events' },
      { label: 'Gallery', to: '/gallery' },
      { label: 'Blog', to: '/blog' },
      { label: 'About', to: '/about' },
      { label: 'Sitemap', to: '/sitemap' }
    ]
  },
  {
    title: 'VIC Initiatives',
    links: [
      { label: 'Mobile Innovation Lab', to: '/#mobile-innovation-lab' },
      { label: 'Innovation Hub', to: '/#innovation-hub' },
      { label: 'Virtual Gallery', to: '/#virtual-gallery' },
      { label: 'Research & R&D', to: '/#research-and-rd' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Government of India', href: 'https://www.mygov.in/', external: true },
      { label: 'UP Government', href: 'https://up.mygov.in/', external: true },
      { label: 'National Portal of India', href: 'https://www.india.gov.in/', external: true },
      { label: 'Open Government Data', href: 'https://data.gov.in/', external: true },
      { label: 'The Gazette of India', href: 'https://egazette.gov.in/', external: true }
    ]
  },
  {
    title: 'Information',
    links: [
      { label: 'Events Archive', to: '/events?type=past' },
      { label: 'Blog Archive', to: '/blog' },
      { label: 'Project Gallery', to: '/gallery' },
      { label: 'Team Directory', to: '/about' }
    ]
  },
  {
    title: 'Admin',
    links: [
      { label: 'Admin Login', to: '/admin/login' },
      { label: 'Admin Dashboard', to: '/admin' }
    ]
  }
];

export default function Sitemap() {
  const { isDark } = useThemeMode();

  return (
    <PageLayout title="Sitemap">
      <div id="main-content" />

      {/* Breadcrumb */}
      <div className={`border-b ${isDark ? 'border-[#2a3a52] bg-[#111a2c]' : 'border-slate-200 bg-white'}`}>
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="hover:text-cyan transition-colors">
              Home
            </Link>
            <span className={isDark ? 'text-[#9aa9c0]' : 'text-slate-400'}>|</span>
            <span className="font-semibold text-cyan">Sitemap</span>
          </nav>
        </div>
      </div>

      {/* Sitemap Content */}
      <div className={`py-12 ${isDark ? 'bg-[#0b1220]' : 'bg-[#f3f4f6]'}`}>
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-10 flex items-center gap-4">
            <div className={`text-5xl ${isDark ? 'text-[#e5edf8]' : 'text-slate-900'}`}>◰</div>
            <p className={`text-sm ${isDark ? 'text-[#9aa9c0]' : 'text-slate-600'}`}>
              Navigate through all sections and resources of VIC Club
            </p>
          </div>

          {/* Sections Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sitemapSections.map((section) => (
              <div
                key={section.title}
                className={`rounded-lg border p-6 ${
                  isDark
                    ? 'border-[#2a3a52] bg-[#111a2c]'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <h2 className="mb-4 font-head text-lg font-semibold text-cyan">
                  {section.title}
                </h2>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className={`text-sm transition-colors hover:text-cyan ${
                            isDark ? 'text-[#9aa9c0]' : 'text-slate-700'
                          }`}
                        >
                          {link.label} ↗
                        </a>
                      ) : (
                        <Link
                          to={link.to}
                          className={`text-sm transition-colors hover:text-cyan ${
                            isDark ? 'text-[#9aa9c0]' : 'text-slate-700'
                          }`}
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Additional Resources Section */}
          <div className={`mt-12 rounded-lg border p-8 ${
            isDark
              ? 'border-[#2a3a52] bg-[#111a2c]'
              : 'border-slate-200 bg-white'
          }`}>
            <h2 className="mb-4 font-head text-lg font-semibold text-cyan">
              Additional Information
            </h2>
            <div className={`space-y-3 text-sm ${isDark ? 'text-[#9aa9c0]' : 'text-slate-700'}`}>
              <p>
                <strong>About VIC Club:</strong> Vidya Innovation Club (VIC) is the university innovation platform that drives project-based learning, startup readiness, and applied engineering excellence.
              </p>
              <p>
                <strong>Contact:</strong> For inquiries, please visit the{' '}
                <Link to="/about" className="text-cyan hover:underline">
                  About page
                </Link>
              </p>
              <p>
                <strong>Latest Updates:</strong> Check the{' '}
                <Link to="/events" className="text-cyan hover:underline">
                  Events
                </Link>{' '}
                and{' '}
                <Link to="/blog" className="text-cyan hover:underline">
                  Blog
                </Link>{' '}
                sections for the latest updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
