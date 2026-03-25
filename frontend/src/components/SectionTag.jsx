export default function SectionTag({ tag, title, subtitle }) {
  return (
    <div className="mb-8">
      <p className="mb-2 inline-flex border-l-2 border-cyan bg-gov-panel px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan">{tag}</p>
      <h2 className="institution-heading md:text-h2">{title}</h2>
      {subtitle ? <p className="mt-3 max-w-3xl text-gov-muted">{subtitle}</p> : null}
    </div>
  );
}
