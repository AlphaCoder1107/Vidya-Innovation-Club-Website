export default function PhotoCard({ photo }) {
  return (
    <article className="card-shell group relative mb-4 overflow-hidden">
      <img
        src={photo.image_url}
        alt={photo.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <span className="absolute left-3 top-3 rounded-full bg-cyan px-3 py-1 text-xs font-semibold text-white shadow-sm">
        {photo.category || 'General'}
      </span>
      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/75 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
        <h3 className="font-head text-lg font-extrabold text-white">{photo.title}</h3>
        <p className="text-sm text-slate-200">{photo.caption}</p>
      </div>
    </article>
  );
}
