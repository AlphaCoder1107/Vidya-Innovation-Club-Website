import { Link } from 'react-router-dom';

export default function FolderCard({ folder }) {
  const cover =
    folder.cover_image_url ||
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop';

  return (
    <article className="card-shell overflow-hidden">
      <Link to={`/gallery/folder/${folder.slug}`} className="group block">
        <div className="relative">
          <img
            src={cover}
            alt={folder.name}
            className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
            {(folder.photo_count || 0) + (folder.video_count || 0)} media
          </span>
        </div>
        <div className="p-5">
          <p className="chip w-fit border-cyan/30 bg-cyan/8 text-cyan">
            {folder.events?.title ? 'Event Folder' : 'Custom Folder'}
          </p>
          <h3 className="mt-2 font-head text-2xl font-extrabold text-slate-800">{folder.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">{folder.description || 'Open this folder to explore photos and videos.'}</p>
          <div className="mt-4 flex items-center gap-4 text-xs uppercase tracking-wide text-slate-500">
            <span>{folder.photo_count || 0} photos</span>
            <span>{folder.video_count || 0} videos</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
