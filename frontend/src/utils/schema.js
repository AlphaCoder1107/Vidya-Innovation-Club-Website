const BASE_URL = 'https://vic.college';

function safeDate(value) {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

export function htmlToPlainText(html = '') {
  return String(html)
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function generateOrganizationSchema({
  name = 'Vidya Innovation Club',
  url = BASE_URL,
  description,
  logo,
  sameAs
} = {}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url
  };

  if (description) schema.description = description;
  if (logo) schema.logo = logo;
  if (Array.isArray(sameAs) && sameAs.length) schema.sameAs = sameAs;

  return schema;
}

export function generateBlogPostingSchema(post = {}, slug = '') {
  const published = safeDate(post.published_at || post.created_at);
  const modified = safeDate(post.updated_at || post.published_at || post.created_at);
  const description = (post.excerpt || htmlToPlainText(post.content || '')).slice(0, 180);
  const articleBody = htmlToPlainText(post.content || '');
  const canonicalSlug = slug || post.slug || '';
  const pageUrl = canonicalSlug ? `${BASE_URL}/blog/${canonicalSlug}` : `${BASE_URL}/blog`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: pageUrl,
    headline: post.title || 'Vidya Innovation Club Blog',
    description: description || 'Innovation stories and updates from Vidya Innovation Club.',
    author: {
      '@type': 'Person',
      name: post.author_name || 'Team VIC Club'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vidya Innovation Club',
      url: BASE_URL
    },
    articleSection: post.category || 'General'
  };

  if (post.cover_image) schema.image = post.cover_image;
  if (published) schema.datePublished = published;
  if (modified) schema.dateModified = modified;
  if (articleBody) schema.articleBody = articleBody;

  return schema;
}

export function generateEventSchema(event = {}) {
  const datePart = event.event_date || '';
  const timePart = event.event_time || '00:00';
  const candidateDate = datePart ? `${datePart}T${timePart}` : '';
  const startDate = safeDate(candidateDate || datePart);
  const eventUrl = event.registration_link || `${BASE_URL}/events`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title || 'VIC Club Event',
    description: event.description || 'Event organized by Vidya Innovation Club.',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.venue || 'Vidya University'
    },
    organizer: {
      '@type': 'Organization',
      name: 'Vidya Innovation Club',
      url: BASE_URL
    },
    url: eventUrl
  };

  if (startDate) {
    schema.startDate = startDate;
    schema.endDate = startDate;
  }
  if (event.cover_image) schema.image = event.cover_image;

  return schema;
}

export function generateBlogCollectionSchema(posts = []) {
  const itemListElement = (Array.isArray(posts) ? posts : []).map((post, index) => {
    const slug = post?.slug || post?.id || `item-${index + 1}`;
    const url = `${BASE_URL}/blog/${slug}`;

    return {
      '@type': 'ListItem',
      position: index + 1,
      url,
      item: {
        '@type': 'BlogPosting',
        headline: post?.title || 'Blog Article',
        url
      }
    };
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Vidya Innovation Club Blog',
    url: `${BASE_URL}/blog`,
    mainEntity: {
      '@type': 'ItemList',
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      numberOfItems: itemListElement.length,
      itemListElement
    }
  };
}
