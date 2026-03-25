import { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import SectionTag from '../components/SectionTag';
import TeamCard from '../components/TeamCard';
import Loader from '../components/Loader';
import { useTeam } from '../hooks/useData';
import directorPic from '../../assets/Director\'s Pic.jpeg';

const objectives = [
  { icon: '🎯', text: 'Build a culture of innovation and experimentation.' },
  { icon: '🧩', text: 'Bridge academics with practical product development.' },
  { icon: '🤝', text: 'Create strong industry and startup collaborations.' },
  { icon: '🧪', text: 'Enable applied research with measurable impact.' },
  { icon: '🚀', text: 'Support student entrepreneurship and incubation.' },
  { icon: '📚', text: 'Mentor technical communication and patents.' }
];

export default function About() {
  const { data: team, loading } = useTeam();
  const [directorImageError, setDirectorImageError] = useState(false);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <PageLayout title="About">
      <section className="reveal mx-auto max-w-7xl px-4 py-16 md:px-6">
        <SectionTag tag="About" title={<>Genesis & <span className="text-cyan">Vision</span></>} />
        <p className="max-w-4xl text-slate-600">
          Established in 2018, the Vidya Innovation Club was created to transform student potential into high-impact engineering outcomes.
          The club combines mentorship, research infrastructure, industry partnerships, and startup support to create a thriving innovation pipeline.
        </p>
      </section>

      <section className="reveal border-y border-slate-300 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionTag tag="Mission" title={<>Strategic <span className="text-cyan">Objectives</span></>} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {objectives.map((item) => (
              <article key={item.text} className="border border-slate-300 bg-slate-50 p-5">
                <div className="text-2xl">{item.icon}</div>
                <p className="mt-2 text-slate-700">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="reveal mx-auto max-w-7xl px-4 py-16 md:px-6">
        <SectionTag tag="People" title={<>Our <span className="text-cyan">Team</span></>} />
        {loading ? <Loader text="Loading team..." /> : null}
        {!loading && !team.length ? <div className="border border-slate-300 bg-white py-14 text-center text-slate-600">👥 No team members found</div> : null}
        {!loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        ) : null}
      </section>

      <section id="director" className="reveal mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <div className="border border-slate-300 bg-white p-6 md:flex md:items-center md:gap-6">
          {directorImageError ? (
            <div className="mb-4 h-28 w-28 rounded-full bg-slate-200 md:mb-0" />
          ) : (
            <img
              src={directorPic}
              alt="Director"
              className="mb-4 h-28 w-28 rounded-full object-cover md:mb-0"
              onError={() => setDirectorImageError(true)}
            />
          )}
          <div>
            <h3 className="font-head text-2xl font-extrabold text-slate-800">Director’s Message</h3>
            <p className="mt-2 text-slate-600">
              VIC is committed to nurturing solution-oriented technologists who can prototype, validate, and scale ideas with confidence.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
