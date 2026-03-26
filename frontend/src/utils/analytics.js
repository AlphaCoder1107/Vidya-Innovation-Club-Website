const GA_MEASUREMENT_ID = 'G-BLDPBL98KV';

export function initGA() {
  if (typeof window === 'undefined') return;
  if (!GA_MEASUREMENT_ID) return;
  if (window.__gaInitialized) return;

  if (typeof window.gtag === 'function') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: false
    });
    window.__gaInitialized = true;
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false
  });

  window.__gaInitialized = true;
}

export function trackPageView(path) {
  if (typeof window === 'undefined') return;
  if (!window.gtag) return;

  window.gtag('event', 'page_view', {
    send_to: GA_MEASUREMENT_ID,
    page_title: document.title,
    page_path: path,
    page_location: window.location.href
  });
}
