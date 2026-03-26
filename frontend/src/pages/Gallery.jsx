import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import SectionTag from '../components/SectionTag';
import PhotoCard from '../components/PhotoCard';
import VideoCard from '../components/VideoCard';
import Loader from '../components/Loader';
import { usePhotos, useVideos } from '../hooks/useData';

const categories = ['All', 'Hackathon', 'Lab', 'Events', 'General'];

export default function Gallery() {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'videos' ? 'videos' : 'photos';
  const [category, setCategory] = useState('All');

  const { data: photos, loading: pLoading } = usePhotos();
  const { data: videos, loading: vLoading } = useVideos();

  const filteredPhotos = useMemo(() => {
    if (category === 'All') return photos;
    return photos.filter((p) => (p.category || '').toLowerCase() === category.toLowerCase());
  }, [photos, category]);

  return (
    <PageLayout
      title="Gallery"
      description="Explore photos and videos from Vidya Innovation Club events, projects, hackathons, and campus innovation activities."
      canonicalPath="/gallery"
    >
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <SectionTag tag="Gallery" title={<>Visual <span className="text-cyan">Highlights</span></>} />

        <div className="mb-6 flex gap-3 border-b border-slate-300 pb-3">
          <button onClick={() => setParams({ tab: 'photos' })} className={`px-5 py-2 text-sm font-semibold uppercase tracking-wide ${tab === 'photos' ? 'border-b-2 border-cyan text-cyan' : 'text-slate-600'}`}>Photos</button>
          <button onClick={() => setParams({ tab: 'videos' })} className={`px-5 py-2 text-sm font-semibold uppercase tracking-wide ${tab === 'videos' ? 'border-b-2 border-cyan text-cyan' : 'text-slate-600'}`}>Videos</button>
        </div>

        {tab === 'photos' ? (
          <>
            <div className="mb-6 flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-4 py-1 text-sm font-semibold uppercase tracking-wide ${category === c ? 'border-b-2 border-cyan text-cyan' : 'text-slate-600'}`}
                >
                  {c}
                </button>
              ))}
            </div>
            {pLoading ? <Loader text="Loading photos..." /> : null}
            {!pLoading && !filteredPhotos.length ? <div className="border border-slate-300 bg-white py-14 text-center text-slate-600">🖼️ No photos found</div> : null}
            {!pLoading ? (
              <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                {filteredPhotos.map((photo) => (
                  <PhotoCard key={photo.id} photo={photo} />
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <>
            {vLoading ? <Loader text="Loading videos..." /> : null}
            {!vLoading && !videos.length ? <div className="border border-slate-300 bg-white py-14 text-center text-slate-600">🎬 No videos found</div> : null}
            {!vLoading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {videos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            ) : null}
          </>
        )}
      </section>
    </PageLayout>
  );
}
