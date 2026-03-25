import { useSearchParams } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import SectionTag from '../components/SectionTag';
import EventCard from '../components/EventCard';
import Loader from '../components/Loader';
import { useEvents } from '../hooks/useData';

export default function Events() {
  const [params, setParams] = useSearchParams();
  const type = params.get('type') === 'past' ? 'past' : 'upcoming';
  const { data: events, loading } = useEvents(type);

  const setType = (next) => {
    if (next === 'upcoming') setParams({});
    else setParams({ type: 'past' });
  };

  return (
    <PageLayout title="Events">
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <SectionTag
          tag="Events"
          title={<>Campus <span className="text-cyan">Calendar</span></>}
          subtitle="Explore upcoming and past activities at the Vidya Innovation Club."
        />
        <div className="mb-8 flex gap-3 border-b border-slate-300 pb-3">
          <button
            onClick={() => setType('upcoming')}
            className={`px-5 py-2 text-sm font-semibold uppercase tracking-wide ${type === 'upcoming' ? 'border-b-2 border-cyan text-cyan' : 'text-slate-600'}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setType('past')}
            className={`px-5 py-2 text-sm font-semibold uppercase tracking-wide ${type === 'past' ? 'border-b-2 border-cyan text-cyan' : 'text-slate-600'}`}
          >
            Past Events
          </button>
        </div>

        {loading ? <Loader text="Loading events..." /> : null}

        {!loading && !events.length ? (
          <div className="border border-slate-300 bg-white py-16 text-center text-slate-600">📅 No events found</div>
        ) : null}

        {!loading ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : null}
      </section>
    </PageLayout>
  );
}
