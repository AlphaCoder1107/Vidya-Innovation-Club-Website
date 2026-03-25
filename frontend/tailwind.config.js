/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gov: {
          bg: 'var(--gov-bg)',
          surface: 'var(--gov-surface)',
          panel: 'var(--gov-panel)',
          line: 'var(--gov-line)',
          ink: 'var(--gov-ink)',
          muted: 'var(--gov-muted)',
          brand: 'var(--gov-brand)',
          brandStrong: 'var(--gov-brand-strong)',
          accent: 'var(--gov-accent)'
        },
        navy: {
          DEFAULT: '#f3f4f6',
          light: '#ffffff',
          mid: '#eef2f5'
        },
        cyan: {
          DEFAULT: '#124f5c'
        },
        amber: {
          DEFAULT: '#a97816'
        }
      },
      fontFamily: {
        head: ['Georgia', 'Times New Roman', 'serif'],
        body: ['DM Sans', 'sans-serif']
      },
      boxShadow: {
        institutional: '0 1px 3px rgba(17, 24, 39, 0.08)'
      },
      fontSize: {
        h1: ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        h2: ['2rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        h3: ['1.5rem', { lineHeight: '1.3' }],
        h4: ['1.25rem', { lineHeight: '1.35' }]
      }
    }
  },
  plugins: []
};
