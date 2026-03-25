import { useEffect } from 'react';
import UtilityBar from './UtilityBar';
import SiteHeader from './SiteHeader';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PageLayout({ children, title = 'Home' }) {
  useEffect(() => {
    document.title = `${title} | Vidya Innovation Club`;
  }, [title]);

  return (
    <div className="min-h-screen bg-gov-bg text-gov-ink">
      <UtilityBar />
      <SiteHeader />
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
    </div>
  );
}
