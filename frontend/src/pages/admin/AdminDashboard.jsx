import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAnnouncements, useAdminBlog, useAdminEvents, useAdminPhotos, useAdminTeam, useAdminTicker, useAdminVideos } from '../../hooks/useData';
import Loader from '../../components/Loader';

function localDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function safeTime(value) {
  const ts = new Date(value || 0).getTime();
  return Number.isFinite(ts) ? ts : 0;
}

function ratio(part, total) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

export default function AdminDashboard() {
  const ticker = useAdminTicker();
  const announcements = useAdminAnnouncements();
  const events = useAdminEvents();
  const photos = useAdminPhotos();
  const videos = useAdminVideos();
  const posts = useAdminBlog();
  const team = useAdminTeam();
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const loading = [ticker, announcements, events, photos, videos, posts, team].some((r) => r.loading);

  const todayKey = localDateKey();

  const upcomingEvents = useMemo(() => events.data.filter((e) => (e.event_date || '') >= todayKey), [events.data, todayKey]);
  const activeAnnouncements = useMemo(() => announcements.data.filter((a) => a.is_active), [announcements.data]);
  const publishedPosts = useMemo(() => posts.data.filter((p) => p.is_published), [posts.data]);
  const activeTicker = useMemo(() => ticker.data.filter((t) => t.is_active), [ticker.data]);

  const mediaCount = photos.data.length + videos.data.length;
  const totalContent = ticker.data.length + announcements.data.length + events.data.length + posts.data.length;

  const publishRatio = ratio(publishedPosts.length, posts.data.length);
  const eventUpcomingRatio = ratio(upcomingEvents.length, events.data.length);
  const teamCoverageRatio = ratio(team.data.filter((m) => m.is_active).length, team.data.length);

  const activityFeed = useMemo(() => {
    const a = announcements.data.map((item) => ({
      id: `ann-${item.id}`,
      title: item.title,
      when: item.published_at || item.created_at,
      kind: 'Announcement',
      status: item.is_active ? 'Live' : 'Draft'
    }));
    const b = posts.data.map((item) => ({
      id: `blog-${item.id}`,
      title: item.title,
      when: item.published_at || item.created_at,
      kind: 'Blog',
      status: item.is_published ? 'Published' : 'Draft'
    }));
    const c = events.data.map((item) => ({
      id: `event-${item.id}`,
      title: item.title,
      when: item.created_at || item.event_date,
      kind: 'Event',
      status: (item.event_date || '') >= todayKey ? 'Upcoming' : 'Past'
    }));
    return [...a, ...b, ...c].sort((x, y) => safeTime(y.when) - safeTime(x.when)).slice(0, 8);
  }, [announcements.data, posts.data, events.data, todayKey]);

  useEffect(() => {
    setLastUpdated(new Date());
  }, [
    ticker.data.length,
    announcements.data.length,
    events.data.length,
    photos.data.length,
    videos.data.length,
    posts.data.length,
    team.data.length
  ]);

  useEffect(() => {
    const id = setInterval(() => {
      ticker.refetch();
      announcements.refetch();
      events.refetch();
      photos.refetch();
      videos.refetch();
      posts.refetch();
      team.refetch();
    }, 30000);
    return () => clearInterval(id);
  }, [ticker.refetch, announcements.refetch, events.refetch, photos.refetch, videos.refetch, posts.refetch, team.refetch]);

  if (loading) return <Loader text="Loading dashboard..." />;

  return (
    <div className="space-y-6">
      <div className="admin-panel p-4 md:p-5">
        <div className="admin-grid-header">
          <div>
            <p className="admin-label">Realtime overview</p>
            <h2 className="font-head text-2xl font-semibold text-gov-ink">Content Operations Dashboard</h2>
          </div>
          <p className="text-xs text-gov-muted">Auto refresh every 30s • Last update {lastUpdated.toLocaleTimeString('en-IN')}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Link to="/admin/announcements" className="admin-kpi">
            <p className="admin-label">Live announcements</p>
            <p className="admin-value">{activeAnnouncements.length}</p>
            <p className="mt-1 text-sm text-gov-muted">{announcements.data.length} total records</p>
          </Link>

          <Link to="/admin/events" className="admin-kpi">
            <p className="admin-label">Upcoming events</p>
            <p className="admin-value">{upcomingEvents.length}</p>
            <p className="mt-1 text-sm text-gov-muted">{eventUpcomingRatio}% event pipeline active</p>
          </Link>

          <Link to="/admin/blog" className="admin-kpi">
            <p className="admin-label">Published posts</p>
            <p className="admin-value">{publishedPosts.length}</p>
            <p className="mt-1 text-sm text-gov-muted">{publishRatio}% publishing ratio</p>
          </Link>

          <Link to="/admin/gallery" className="admin-kpi">
            <p className="admin-label">Media assets</p>
            <p className="admin-value">{mediaCount}</p>
            <p className="mt-1 text-sm text-gov-muted">Photos + videos combined</p>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
        <section className="admin-panel p-5">
          <div className="admin-grid-header">
            <h3 className="font-head text-xl font-semibold text-gov-ink">Operational Activity</h3>
            <span className="chip text-gov-muted">{activityFeed.length} recent updates</span>
          </div>

          <div className="space-y-3">
            {activityFeed.map((item) => (
              <article key={item.id} className="rounded-xl border border-gov-line bg-gov-panel p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="line-clamp-1 font-medium text-gov-ink">{item.title}</p>
                  <span className="chip text-gov-muted">{item.status}</span>
                </div>
                <p className="mt-1 text-xs text-gov-muted">{item.kind} • {new Date(item.when || Date.now()).toLocaleString('en-IN')}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="admin-panel p-5">
            <h3 className="mb-3 font-head text-xl font-semibold text-gov-ink">Content Health</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="mb-1 flex items-center justify-between"><span className="text-gov-muted">Post publishing</span><span className="font-semibold text-gov-ink">{publishRatio}%</span></div>
                <div className="admin-mini-bar"><span style={{ width: `${publishRatio}%` }} /></div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between"><span className="text-gov-muted">Event pipeline</span><span className="font-semibold text-gov-ink">{eventUpcomingRatio}%</span></div>
                <div className="admin-mini-bar"><span style={{ width: `${eventUpcomingRatio}%` }} /></div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between"><span className="text-gov-muted">Team visibility</span><span className="font-semibold text-gov-ink">{teamCoverageRatio}%</span></div>
                <div className="admin-mini-bar"><span style={{ width: `${teamCoverageRatio}%` }} /></div>
              </div>
            </div>
          </div>

          <div className="admin-panel p-5">
            <h3 className="mb-3 font-head text-xl font-semibold text-gov-ink">Module Snapshot</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl border border-gov-line bg-gov-panel p-3"><p className="text-gov-muted">Ticker</p><p className="font-semibold text-gov-ink">{activeTicker.length}/{ticker.data.length}</p></div>
              <div className="rounded-xl border border-gov-line bg-gov-panel p-3"><p className="text-gov-muted">Announcements</p><p className="font-semibold text-gov-ink">{announcements.data.length}</p></div>
              <div className="rounded-xl border border-gov-line bg-gov-panel p-3"><p className="text-gov-muted">Blog Posts</p><p className="font-semibold text-gov-ink">{posts.data.length}</p></div>
              <div className="rounded-xl border border-gov-line bg-gov-panel p-3"><p className="text-gov-muted">Team</p><p className="font-semibold text-gov-ink">{team.data.length}</p></div>
            </div>
            <p className="mt-3 text-xs text-gov-muted">Total managed content items: {totalContent}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
