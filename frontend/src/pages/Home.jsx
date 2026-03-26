import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import SectionTag from '../components/SectionTag';
import EventCard from '../components/EventCard';
import BlogCard from '../components/BlogCard';
import AnnouncementsList from '../components/AnnouncementsList';
import Loader from '../components/Loader';
import { useAnnouncements, useBlog, useEvents } from '../hooks/useData';
import heroVideo from '../../assets/vidyauniversity.mp4';
import vuLogo from '../../assets/VU LOGO PNG.png';
import thumb1 from '../../assets/resource-logos/thumb-1.jpg';
import thumb2 from '../../assets/resource-logos/thumb-2.jpg';
import thumb3 from '../../assets/resource-logos/thumb-3.jpg';
import thumb4 from '../../assets/resource-logos/thumb-4.jpg';
import thumb5 from '../../assets/resource-logos/thumb-5.jpg';

const initiativeTabs = {
  'Mobile Innovation Lab': {
    title: 'Mobile Innovation Lab',
    description:
      'VIC Club runs outreach-oriented mobile innovation sessions for schools and communities to make engineering ideas accessible through demonstrations and guided experimentation.',
    cards: ['STEM Bus Sessions', 'School Outreach Workshops', 'Hands-on Live Demos', 'Rural Innovation Camps']
  },
  'Innovation Hub': {
    title: 'Innovation Hub',
    description:
      'Students build interdisciplinary prototypes under faculty and industry mentorship, with rapid validation cycles and peer review clinics hosted every month.',
    cards: ['Idea to Prototype Pipeline', 'Mentor Hours', 'Design Crit Reviews', 'Product Validation Tracks']
  },
  'Virtual Gallery': {
    title: 'Virtual Gallery',
    description:
      'The virtual gallery curates project demos, milestone stories, and media capsules to showcase student innovation output and collaboration impact.',
    cards: ['Project Showreels', 'Video Capsules', 'Prototype Diaries', 'Impact Stories']
  },
  'Research & R&D': {
    title: 'Research & R&D',
    description:
      'Applied research teams tackle practical engineering challenges with measurable outcomes, publication support, and innovation-to-implementation pathways.',
    cards: ['Research Cells', 'Publication Support', 'R&D Mentoring', 'Industry Problem Statements']
  }
};

const importantLinks = [
  { name: 'Government of India', href: 'https://www.mygov.in/', logo: thumb1 },
  { name: 'UP Government', href: 'https://up.mygov.in/', logo: thumb2 },
  { name: 'National Portal of India', href: 'https://www.india.gov.in/', logo: thumb3 },
  { name: 'Open Government Data', href: 'https://data.gov.in/', logo: thumb4 },
  { name: 'The Gazette of India', href: 'https://egazette.gov.in/', logo: thumb5 }
];

export default function Home() {
  const { data: announcements, loading: annLoading } = useAnnouncements(8);
  const { data: upcomingEvents, loading: upLoading } = useEvents('upcoming');
  const { data: pastEvents, loading: pastLoading } = useEvents('past');
  const { data: blogPosts, loading: blogLoading } = useBlog(6);

  const [activeTab, setActiveTab] = useState('Mobile Innovation Lab');

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const tabData = useMemo(() => initiativeTabs[activeTab], [activeTab]);
  const safeUpcomingEvents = Array.isArray(upcomingEvents) ? upcomingEvents : [];
  const safePastEvents = Array.isArray(pastEvents) ? pastEvents : [];
  const safeBlogPosts = Array.isArray(blogPosts) ? blogPosts : [];

  if (upLoading || pastLoading || blogLoading) {
    return (
      <PageLayout title="Home">
        <Loader text="Loading homepage..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Home">
      <div id="main-content" />

      <section className="relative h-[44vh] min-h-[320px] border-b border-gov-line bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1800&auto=format&fit=crop')] bg-cover bg-center md:h-[70vh] md:min-h-[520px] md:bg-none">
        <video
          className="absolute inset-0 hidden h-full w-full object-cover md:block"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-x-0 bottom-0 bg-cyan/90 py-4 text-white">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 md:px-8">
            <img src={vuLogo} alt="VU Logo" className="h-auto w-[120px] object-contain" />
            <div>
              <p className="font-head text-xl font-extrabold uppercase tracking-wide">Largest Innovation Community at Vidya University</p>
              <p className="text-sm">Under a single collaborative ecosystem for students, faculty and industry.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="reveal bg-gov-surface py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 md:px-6">
          <div>
            <SectionTag
              tag="Welcome to VIC Club"
              title={<>A Structured <span className="text-cyan">Innovation Network</span></>}
              subtitle="Vidya Innovation Club (VIC) is the university innovation platform that drives project-based learning, startup readiness, and applied engineering excellence."
            />
            <p className="mb-4 text-gov-muted">
              VIC Club coordinates innovation activities across departments and ensures students get practical exposure through workshops, hackathons, prototyping labs, and mentorship.
            </p>
            <p className="mb-4 text-gov-muted">
              The club fosters an ecosystem where ideas are documented, validated, and presented through institutional channels so outcomes are visible and scalable.
            </p>
            <Link to="/about" className="inline-block bg-cyan px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white hover:bg-cyan/90">
              Read More
            </Link>
          </div>
          <div className="border border-gov-line bg-gov-panel p-4">
            <div className="soft-lines h-[340px] overflow-hidden border border-gov-line bg-gov-surface">
              <iframe
                title="VIC Campus Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3208.6310591992906!2d77.6222262554347!3d28.971575215274314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390c6424271b44bb%3A0x21576f8c7a7cafc!2sVidya%20University!5e0!3m2!1sen!2sin!4v1774440618489!5m2!1sen!2sin"
                className="h-full w-full"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="reveal py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionTag
            tag="Featured Programs"
            title={<>Club <span className="text-cyan">Activities</span></>}
            subtitle="Inspired by institutional information blocks, this section highlights the core initiatives run by VIC Club."
          />

          <div className="mb-6 flex flex-wrap gap-2 border-b border-gov-line pb-3">
            {Object.keys(initiativeTabs).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${activeTab === tab ? 'border border-cyan bg-cyan/10 text-cyan' : 'border border-transparent text-gov-muted hover:border-gov-line hover:bg-gov-panel hover:text-cyan'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-[1.2fr_.8fr]">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {tabData.cards.map((card) => (
                <div key={card} className="card-shell p-4">
                  <div className="mb-2 h-28 rounded-xl bg-gov-panel" />
                  <p className="font-head text-lg font-bold text-gov-ink">{card}</p>
                </div>
              ))}
            </div>
            <div className="card-shell p-5">
              <h3 className="font-head text-3xl font-extrabold text-gov-ink">{tabData.title}</h3>
              <p className="mt-3 text-gov-muted">{tabData.description}</p>
              <button className="mt-6 rounded-full bg-cyan px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white">
                Know More
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="reveal ncsm-pattern py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-6 flex items-center justify-between">
            <SectionTag tag="Past Events" title={<>Major <span className="text-amber">Milestones</span></>} />
            <Link to="/events?type=past" className="text-sm font-semibold uppercase tracking-wide text-white">View All</Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {!pastEvents.length ? (
              <div className="col-span-full border border-white/30 bg-white/10 p-8 text-center text-white">No past events found.</div>
            ) : (
              safePastEvents.slice(0, 3).map((event) => <EventCard key={event.id} event={event} />)
            )}
          </div>
        </div>
      </section>

      <section className="reveal bg-gov-surface py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionTag tag="Blog" title={<>From the <span className="text-cyan">Editorial Desk</span></>} />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {!safeBlogPosts.length ? (
              <div className="col-span-full border border-gov-line bg-gov-panel p-8 text-center text-gov-muted">No blog posts available.</div>
            ) : (
              safeBlogPosts.slice(0, 3).map((post) => <BlogCard key={post.id} post={post} />)
            )}
          </div>
        </div>
      </section>

      <section className="ncsm-pattern py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-6 grid gap-6 md:grid-cols-2">
            <div>
              <SectionTag tag="Latest" title={<>Official <span className="text-amber">Notices</span></>} />
              <AnnouncementsList items={announcements} loading={annLoading} />
            </div>
            <div>
              <SectionTag tag="Upcoming" title={<>Next <span className="text-amber">Events</span></>} />
              <div className="space-y-4">
                {!safeUpcomingEvents.length ? (
                  <div className="border border-white/30 bg-white/10 p-8 text-center text-white">No upcoming events.</div>
                ) : (
                  safeUpcomingEvents.slice(0, 2).map((event) => <EventCard key={event.id} event={event} />)
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gov-surface py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionTag tag="Resources" title={<>Important <span className="text-cyan">Links</span></>} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {importantLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Visit ${item.name}`}
                className="group flex h-[124px] items-center justify-center border border-gov-line bg-white px-3 py-2 transition-colors hover:border-cyan"
              >
                <img
                  src={item.logo}
                  alt={item.name}
                  title={item.name}
                  className="h-auto max-h-[96px] w-full max-w-[182px] object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                  decoding="async"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
