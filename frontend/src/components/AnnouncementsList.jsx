import Loader from './Loader';

export default function AnnouncementsList({ items = [], loading }) {
  if (loading) return <Loader text="Loading announcements..." />;

  return (
    <section className="institution-card p-5">
      <header className="mb-4 flex items-center justify-between border-b border-gov-line pb-3">
        <h3 className="font-head text-h4 font-semibold text-gov-ink">Latest Notices</h3>
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-gov-muted">Official Updates</span>
      </header>

      {!items.length ? (
        <div className="py-8 text-center text-gov-muted">No notices available</div>
      ) : (
        <div className="notice-scroll max-h-[420px] space-y-3 overflow-y-auto pr-2">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.file_url || '#'}
              target={item.file_url ? '_blank' : undefined}
              rel={item.file_url ? 'noreferrer' : undefined}
              className="block rounded-xl border border-gov-line bg-gov-panel p-3 transition-all hover:-translate-y-0.5 hover:border-cyan"
            >
              <div className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 rounded-full bg-cyan" />
                <div>
                  <p className="font-semibold text-gov-ink">{item.title}</p>
                  <p className="text-xs text-gov-muted">{new Date(item.published_at || item.created_at).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
