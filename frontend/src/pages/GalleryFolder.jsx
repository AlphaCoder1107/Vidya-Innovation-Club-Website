import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import SectionTag from '../components/SectionTag';
import PhotoCard from '../components/PhotoCard';
import VideoCard from '../components/VideoCard';
import Loader from '../components/Loader';
import { useGalleryFolderMedia } from '../hooks/useData';

export default function GalleryFolder() {
  const { slug } = useParams();
  const { data, loading, error } = useGalleryFolderMedia(slug);
  const [tab, setTab] = useState('photos');

  const photos = useMemo(() => data?.photos || [], [data]);
  const videos = useMemo(() => data?.videos || [], [data]);
  const folder = data?.folder;

  return (
    <PageLayout
      title={folder?.name || 'Gallery Folder'}
      description={folder?.description || 'Event-wise gallery folder with photos and videos.'}
      canonicalPath={`/gallery/folder/${slug}`}
    >
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        {loading ? <Loader text="Loading folder media..." /> : null}
        {!loading && error ? (
          <div className="border border-slate-300 bg-white p-8 text-center text-slate-600">
            This gallery folder is unavailable right now.
          </div>
        ) : null}
        {!loading && !error && folder ? (
          <>
            <SectionTag
              tag={folder.events?.title ? 'Event Folder' : 'Gallery Folder'}
              title={
                <>
                  {folder.name} <span className="text-cyan">Media</span>
                </>
              }
              subtitle={folder.description || 'Explore all event media in one place.'}
            />

            <div className="mb-6 mt-4 flex flex-wrap items-center gap-4 border-y border-gov-line py-3 text-sm text-slate-600">
              {folder.events?.title ? <p>Linked Event: {folder.events.title}</p> : <p>Custom Folder</p>}
              <p>{photos.length} photos</p>
              <p>{videos.length} videos</p>
            </div>

            <div className="mb-6 flex gap-3 border-b border-slate-300 pb-3">
              <button onClick={() => setTab('photos')} className={`px-5 py-2 text-sm font-semibold uppercase tracking-wide ${tab === 'photos' ? 'border-b-2 border-cyan text-cyan' : 'text-slate-600'}`}>
                Photos
              </button>
              <button onClick={() => setTab('videos')} className={`px-5 py-2 text-sm font-semibold uppercase tracking-wide ${tab === 'videos' ? 'border-b-2 border-cyan text-cyan' : 'text-slate-600'}`}>
                Videos
              </button>
            </div>

            {tab === 'photos' ? (
              <>
                {!photos.length ? <div className="border border-slate-300 bg-white py-14 text-center text-slate-600">No photos in this folder.</div> : null}
                {photos.length ? (
                  <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                    {photos.map((photo) => (
                      <PhotoCard key={photo.id} photo={photo} />
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <>
                {!videos.length ? <div className="border border-slate-300 bg-white py-14 text-center text-slate-600">No videos in this folder.</div> : null}
                {videos.length ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {videos.map((video) => (
                      <VideoCard key={video.id} video={video} />
                    ))}
                  </div>
                ) : null}
              </>
            )}
          </>
        ) : null}
      </section>
    </PageLayout>
  );
}
