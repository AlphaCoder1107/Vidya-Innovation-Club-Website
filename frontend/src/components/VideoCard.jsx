import { useMemo, useState } from 'react';

function toEmbed(url) {
  if (!url) return '';
  if (url.includes('embed/')) return url;
  if (url.includes('watch?v=')) return url.replace('watch?v=', 'embed/');
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0];
    return id ? `https://www.youtube.com/embed/${id}` : url;
  }
  return url;
}

export default function VideoCard({ video }) {
  const [open, setOpen] = useState(false);
  const embedUrl = useMemo(() => toEmbed(video.youtube_url), [video.youtube_url]);

  return (
    <>
      <article className="card-shell overflow-hidden">
        <button className="group relative block w-full" onClick={() => setOpen(true)}>
          <img src={video.thumbnail} alt={video.title} className="h-56 w-full object-cover" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-cyan/90 p-4 text-white transition-transform group-hover:scale-110">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </button>
        <div className="p-5">
          <p className="chip w-fit border-cyan/30 bg-cyan/8 text-cyan">{video.category || 'General'}</p>
          <h3 className="mt-2 font-head text-xl font-extrabold text-slate-800">{video.title}</h3>
          <p className="mt-2 text-slate-600">{video.description}</p>
        </div>
      </article>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setOpen(false)}>
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button className="absolute -top-10 right-0 text-3xl text-white" onClick={() => setOpen(false)}>
              ×
            </button>
            <div className="aspect-video w-full overflow-hidden rounded-xl border border-cyan/30 bg-black">
              <iframe
                src={embedUrl}
                title={video.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
