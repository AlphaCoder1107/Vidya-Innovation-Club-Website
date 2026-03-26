import { useEffect } from 'react';
import UtilityBar from './UtilityBar';
import SiteHeader from './SiteHeader';
import Navbar from './Navbar';
import Footer from './Footer';

function upsertMetaByName(name, content) {
  if (!content) return;
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertMetaByProperty(property, content) {
  if (!content) return;
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertCanonical(url) {
  if (!url) return;
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export default function PageLayout({
  children,
  title = 'Home',
  description = 'Vidya Innovation Club drives innovation, research, entrepreneurship, and student project excellence at Vidya University.',
  canonicalPath = '/'
}) {
  useEffect(() => {
    const fullTitle = `${title} | Vidya Innovation Club`;
    const canonicalUrl = `https://vic.college${canonicalPath}`;

    document.title = fullTitle;

    upsertMetaByName('description', description);
    upsertMetaByName('twitter:title', fullTitle);
    upsertMetaByName('twitter:description', description);

    upsertMetaByProperty('og:title', fullTitle);
    upsertMetaByProperty('og:description', description);
    upsertMetaByProperty('og:url', canonicalUrl);

    upsertCanonical(canonicalUrl);
  }, [title, description, canonicalPath]);

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
