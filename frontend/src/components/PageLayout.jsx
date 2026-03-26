import { useEffect } from 'react';
import UtilityBar from './UtilityBar';
import SiteHeader from './SiteHeader';
import Navbar from './Navbar';
import Footer from './Footer';
import { generateOrganizationSchema } from '../utils/schema';

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

function upsertSchemaScript(schemaId, schemaObject) {
  let script = document.querySelector(`script[data-schema-id="${schemaId}"]`);
  if (!schemaObject) {
    if (script) script.remove();
    return;
  }
  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-schema-id', schemaId);
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schemaObject);
}

export default function PageLayout({
  children,
  title = 'Home',
  description = 'Vidya Innovation Club drives innovation, research, entrepreneurship, and student project excellence at Vidya University.',
  canonicalPath = '/',
  schemaData = null
}) {
  useEffect(() => {
    const fullTitle = `${title} | Vidya Innovation Club`;
    const canonicalUrl = `https://vic.college${canonicalPath}`;
    const organizationSchema = generateOrganizationSchema({
      description
    });

    document.title = fullTitle;

    upsertMetaByName('description', description);
    upsertMetaByName('twitter:title', fullTitle);
    upsertMetaByName('twitter:description', description);

    upsertMetaByProperty('og:title', fullTitle);
    upsertMetaByProperty('og:description', description);
    upsertMetaByProperty('og:url', canonicalUrl);

    upsertCanonical(canonicalUrl);
    upsertSchemaScript('organization', organizationSchema);
    upsertSchemaScript('page', schemaData);
  }, [title, description, canonicalPath, schemaData]);

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
