function LinkedInIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-[30px] w-[30px]" xmlns="http://www.w3.org/2000/svg">
      <path fill="#0288D1" d="M42 37c0 2.762-2.238 5-5 5H11c-2.761 0-5-2.238-5-5V11c0-2.762 2.239-5 5-5h26c2.762 0 5 2.238 5 5z" />
      <path fill="#FFF" d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 50 50" aria-hidden="true" className="h-[30px] w-[30px]" xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="M11 4C7.134 4 4 7.134 4 11v28c0 3.866 3.134 7 7 7h28c3.866 0 7-3.134 7-7V11c0-3.866-3.134-7-7-7zm2.086 9h7.937l5.637 8.01L33.5 13H36l-8.211 9.613L37.914 37h-7.936l-6.541-9.293L15.5 37H13l9.309-10.897zM16.914 15l14.107 20h3.064L19.979 15z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-[30px] w-[30px]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="igGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#304ffe" />
          <stop offset="30%" stopColor="#8e24aa" />
          <stop offset="65%" stopColor="#f50057" />
          <stop offset="100%" stopColor="#ffc107" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="42" height="42" rx="11" fill="url(#igGradient)" />
      <rect x="13" y="13" width="22" height="22" rx="7" fill="none" stroke="#fff" strokeWidth="3" />
      <circle cx="24" cy="24" r="6" fill="none" stroke="#fff" strokeWidth="3" />
      <circle cx="33.5" cy="14.5" r="2.5" fill="#fff" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-[30px] w-[30px]" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="10" width="40" height="28" rx="9" fill="#FF0000" />
      <path d="M21 18.5L31 24L21 29.5V18.5Z" fill="#fff" />
    </svg>
  );
}

export default function Footer() {
  const socialLinks = [
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/vidyainnovationcentre',
      icon: <LinkedInIcon />,
      placeholder: false
    },
    {
      name: 'X',
      href: '#',
      icon: <XIcon />,
      placeholder: true
    },
    {
      name: 'YouTube',
      href: 'https://www.youtube.com/@VIC_VIDYA',
      icon: <YouTubeIcon />,
      placeholder: false
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/vidya_innovation_centre?igsh=ZnprcW5jMTNmaWRq',
      icon: <InstagramIcon />,
      placeholder: false
    }
  ];

  return (
    <footer className="mt-16 border-t border-gov-line bg-gov-panel text-gov-ink">
      <div className="institution-section grid gap-8 py-12 md:grid-cols-4">
        <div>
          <h3 className="mb-3 font-head text-xl font-semibold">Location</h3>
          <p className="text-sm leading-6 text-gov-muted">Vidya University Campus, 247, Baghpat Road, NCR, Meerut, Uttar Pradesh 250005</p>
          <p className="mt-3 text-sm text-gov-muted">+91 80773 10594</p>
          <p className="text-sm text-gov-muted">vic@vidya.edu.in</p>
        </div>
        <div>
          <h3 className="mb-3 font-head text-xl font-semibold">VIC In Media</h3>
          <div className="flex items-center gap-4">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                aria-label={`Visit VIC on ${item.name}`}
                className="inline-flex items-center justify-center text-gov-ink transition-transform hover:scale-105"
                {...(item.placeholder ? {} : { target: '_blank', rel: 'noreferrer' })}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-head text-xl font-semibold">Latest Activities</h3>
          <ul className="space-y-2 text-sm text-gov-muted">
            <li>Innovation Expo 2026</li>
            <li>Campus Startup Sprint</li>
            <li>Research & R&D Showcase</li>
            <li>Community STEM Outreach</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-head text-xl font-semibold">Visitor Info</h3>
          <p className="text-sm text-gov-muted">Office Hours: 9:00 AM - 5:00 PM</p>
          <p className="mt-2 text-sm text-gov-muted">Last Update: {new Date().toLocaleDateString('en-IN')}</p>
        </div>
      </div>

      <div className="border-t border-gov-line bg-gov-surface">
        <div className="institution-section flex flex-col items-start justify-between gap-2 py-4 text-xs text-gov-muted md:flex-row">
          <p>Supports: Chrome, Firefox, Safari, Edge</p>
          <p>Copyright © {new Date().getFullYear()} Vidya Innovation Club</p>
        </div>
      </div>
    </footer>
  );
}
