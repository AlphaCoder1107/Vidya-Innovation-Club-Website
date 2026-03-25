const BASE = 'http://localhost:4000/api';

async function req(path, { method = 'GET', token, json, form } = {}) {
  const headers = {};
  let body;

  if (token) headers.Authorization = `Bearer ${token}`;
  if (json !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(json);
  }
  if (form) body = form;

  const res = await fetch(BASE + path, { method, headers, body });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    throw new Error(`${method} ${path} failed: ${res.status} ${JSON.stringify(data)}`);
  }

  return data;
}

async function seedAdmin() {
  const res = await fetch(BASE + '/auth/seed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}'
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const err = String(data?.error || '').toLowerCase();
    if (!err.includes('duplicate') && !err.includes('already')) {
      throw new Error(`seed failed: ${res.status} ${JSON.stringify(data)}`);
    }
  }
}

async function main() {
  await seedAdmin();
  console.log('SEED_OK_OR_EXISTS');

  const login = await req('/auth/login', {
    method: 'POST',
    json: { username: 'admin', password: 'change_me' }
  });

  const token = login.token;
  if (!token) throw new Error('No login token received');
  console.log('LOGIN_OK');

  const ticker = await req('/ticker', {
    method: 'POST',
    token,
    json: { message: 'Smoke ticker', link: 'https://example.com', sort_order: 99, is_active: true }
  });
  await req(`/ticker/${ticker.id}`, { method: 'PUT', token, json: { message: 'Smoke ticker updated' } });
  await req(`/ticker/${ticker.id}`, { method: 'DELETE', token });
  console.log('TICKER_OK');

  const ann = await req('/announcements', {
    method: 'POST',
    token,
    json: { title: 'Smoke Announcement', description: 'desc', is_active: true }
  });
  await req(`/announcements/${ann.id}`, { method: 'PUT', token, json: { title: 'Smoke Announcement Updated' } });
  await req(`/announcements/${ann.id}`, { method: 'DELETE', token });
  console.log('ANNOUNCEMENTS_OK');

  const ev = await req('/events', {
    method: 'POST',
    token,
    json: {
      title: 'Smoke Event',
      description: 'desc',
      event_type: 'Workshop',
      event_date: '2030-01-15',
      event_time: '10:00 AM',
      venue: 'Main Hall',
      is_active: true
    }
  });
  await req(`/events/${ev.id}`, { method: 'PUT', token, json: { venue: 'Innovation Lab' } });
  await req(`/events/${ev.id}`, { method: 'DELETE', token });
  console.log('EVENTS_OK');

  const imageBytes = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wn2R8QAAAAASUVORK5CYII=',
    'base64'
  );
  const photoForm = new FormData();
  photoForm.append('title', 'Smoke Photo');
  photoForm.append('caption', 'cap');
  photoForm.append('category', 'General');
  photoForm.append('sort_order', '0');
  photoForm.append('is_active', 'true');
  photoForm.append('image', new Blob([imageBytes], { type: 'image/png' }), 'smoke.png');
  const photo = await req('/gallery/photos', { method: 'POST', token, form: photoForm });
  await req(`/gallery/photos/${photo.id}`, { method: 'PUT', token, json: { caption: 'updated' } });
  await req(`/gallery/photos/${photo.id}`, { method: 'DELETE', token });
  console.log('GALLERY_PHOTOS_OK');

  const vid = await req('/gallery/videos', {
    method: 'POST',
    token,
    json: {
      title: 'Smoke Video',
      description: 'desc',
      youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      category: 'General',
      sort_order: 0,
      is_active: true
    }
  });
  await req(`/gallery/videos/${vid.id}`, { method: 'PUT', token, json: { title: 'Smoke Video Updated' } });
  await req(`/gallery/videos/${vid.id}`, { method: 'DELETE', token });
  console.log('GALLERY_VIDEOS_OK');

  const blog = await req('/blog', {
    method: 'POST',
    token,
    json: {
      title: 'Smoke Post',
      slug: `smoke-post-${Date.now()}`,
      excerpt: 'x',
      content: '<p>ok</p>',
      author_name: 'Team VIC',
      category: 'General',
      is_published: false
    }
  });
  await req(`/blog/${blog.id}`, { method: 'PUT', token, json: { title: 'Smoke Post Updated' } });
  await req(`/blog/${blog.id}`, { method: 'DELETE', token });
  console.log('BLOG_OK');

  const member = await req('/team', {
    method: 'POST',
    token,
    json: {
      name: 'Smoke Member',
      role: 'Tester',
      department: 'QA',
      bio: 'b',
      email: 'smoke@example.com',
      linkedin: 'https://linkedin.com/in/smoke',
      sort_order: 0,
      is_active: true
    }
  });
  await req(`/team/${member.id}`, { method: 'PUT', token, json: { department: 'Testing' } });
  await req(`/team/${member.id}`, { method: 'DELETE', token });
  console.log('TEAM_OK');

  await req('/ticker');
  await req('/announcements?limit=3');
  await req('/events?type=upcoming');
  await req('/gallery/photos');
  await req('/gallery/videos');
  await req('/blog?limit=3');
  await req('/team');
  console.log('PUBLIC_READ_OK');

  console.log('SMOKE_TESTS_COMPLETED');
}

main().catch((err) => {
  console.error('SMOKE_TESTS_FAILED');
  console.error(err.message || String(err));
  process.exit(1);
});
