function initials(name = '') {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function TeamCard({ member }) {
  return (
    <article className="card-shell p-6 text-center">
      {member.photo_url ? (
        <img src={member.photo_url} alt={member.name} className="mx-auto h-24 w-24 rounded-full border-2 border-white object-cover shadow-md" />
      ) : (
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-cyan/20 font-head text-2xl font-extrabold text-cyan">
          {initials(member.name)}
        </div>
      )}
      <h3 className="mt-4 font-head text-xl font-extrabold text-slate-800">{member.name}</h3>
      <p className="text-cyan">{member.role}</p>
      <p className="text-sm text-slate-600">{member.department}</p>
      <p className="mt-3 text-sm text-slate-600">{member.bio}</p>
      <div className="mt-4 flex items-center justify-center gap-4 text-sm">
        {member.email ? (
          <a href={`mailto:${member.email}`} className="text-slate-600 hover:text-cyan">
            Email
          </a>
        ) : null}
        {member.linkedin ? (
          <a href={member.linkedin} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-cyan">
            LinkedIn
          </a>
        ) : null}
      </div>
    </article>
  );
}
