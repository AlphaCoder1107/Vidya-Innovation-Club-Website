const monthFmt = new Intl.DateTimeFormat('en-IN', { month: 'short' });

export default function EventCard({ event }) {
  const date = event?.event_date ? new Date(event.event_date) : null;
  const day = date ? String(date.getDate()).padStart(2, '0') : '--';
  const month = date ? monthFmt.format(date) : 'NA';

  return (
    <article className="card-shell p-5">
      <div className="flex gap-4">
        <div className="w-20 rounded-xl border border-cyan/25 bg-cyan/10 p-3 text-center">
          <p className="font-head text-2xl font-extrabold text-cyan">{day}</p>
          <p className="text-xs uppercase tracking-widest text-slate-600">{month}</p>
        </div>
        <div className="flex-1">
          <span className="chip border-amber/30 bg-amber/15 text-[#7d5a00]">
            {event.event_type || 'Event'}
          </span>
          <h3 className="mt-2 font-head text-xl font-extrabold text-slate-800">{event.title}</h3>
          <p className="mt-2 line-clamp-2 text-slate-600">{event.description}</p>
          <p className="mt-3 text-sm text-slate-600">{event.venue || 'TBA'} • {event.event_time || 'Time TBA'}</p>
          {event.registration_link ? (
            <a
              href={event.registration_link}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex bg-cyan px-4 py-2 font-head font-bold text-white transition-all hover:bg-cyan/90"
            >
              Register
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
