import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initGA, trackPageView } from '../utils/analytics';

export default function AnalyticsTracker() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    const path = `${pathname}${search}`;

    // Exclude admin routes from analytics reporting.
    if (path.startsWith('/admin')) return;

    trackPageView(path);
  }, [pathname, search]);

  return null;
}
