import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { useAdminPhotos, useAdminVideos } from '../../hooks/useData';

const pInitial = { title: '', caption: '', category: 'General', sort_order: 0, is_active: true, image: null };
const vInitial = { title: '', description: '', youtube_url: '', category: 'General', sort_order: 0, is_active: true };

export default function AdminGallery() {
  const photos = useAdminPhotos();
  const videos = useAdminVideos();
  const [tab, setTab] = useState('Photos');
  const [pForm, setPForm] = useState(pInitial);
  const [vForm, setVForm] = useState(vInitial);
  const [progress, setProgress] = useState(0);

  async function uploadPhoto(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', pForm.title);
      formData.append('caption', pForm.caption);
      formData.append('category', pForm.category);
      formData.append('sort_order', pForm.sort_order);
      formData.append('is_active', pForm.is_active);
      if (pForm.image) formData.append('image', pForm.image);

      await api.post('/gallery/photos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          setProgress(Math.round((evt.loaded * 100) / evt.total));
        }
      });
      toast.success('Saved!');
      setPForm(pInitial);
      setProgress(0);
      photos.refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  }

  async function addVideo(e) {
    e.preventDefault();
    try {
      await api.post('/gallery/videos', vForm);
      toast.success('Saved!');
      setVForm(vInitial);
      videos.refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  }

  async function togglePhoto(item) {
    try {
      await api.put('/gallery/photos/' + item.id, { is_active: !item.is_active });
      toast.success('Saved!');
      photos.refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  }

  async function removePhoto(id) {
    if (!confirm('Delete this photo?')) return;
    try {
      await api.delete('/gallery/photos/' + id);
      toast.success('Saved!');
      photos.refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  }

  async function toggleVideo(item) {
    try {
      await api.put('/gallery/videos/' + item.id, { is_active: !item.is_active });
      toast.success('Saved!');
      videos.refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  }

  async function removeVideo(id) {
    if (!confirm('Delete this video?')) return;
    try {
      await api.delete('/gallery/videos/' + id);
      toast.success('Saved!');
      videos.refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  }

  if (photos.loading || videos.loading) return <Loader text="Loading gallery..." />;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {['Photos', 'Videos'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-semibold ${tab === t ? 'bg-cyan text-white' : 'border border-gov-line bg-gov-surface text-gov-muted hover:text-gov-ink'}`}>{t}</button>
        ))}
      </div>

      {tab === 'Photos' ? (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {photos.data.map((item) => (
              <article key={item.id} className="admin-panel p-3">
                <img src={item.image_url} alt={item.title} className="mb-2 h-36 w-full rounded-lg border border-gov-line object-cover" />
                <p className="font-medium text-gov-ink">{item.title}</p>
                <p className="text-xs text-gov-muted">{item.category}</p>
                <div className="mt-2 flex gap-3 text-sm">
                  <button onClick={() => togglePhoto(item)} className="text-cyan">{item.is_active ? 'Active' : 'Hidden'}</button>
                  <button onClick={() => removePhoto(item.id)} className="text-rose-500">Delete</button>
                </div>
              </article>
            ))}
          </div>
          <form onSubmit={uploadPhoto} className="admin-panel p-5">
            <h2 className="mb-4 font-head text-xl font-extrabold text-gov-ink">Upload Photo</h2>
            <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" placeholder="Title" value={pForm.title} onChange={(e) => setPForm((p) => ({ ...p, title: e.target.value }))} required />
            <textarea className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" rows={3} placeholder="Caption" value={pForm.caption} onChange={(e) => setPForm((p) => ({ ...p, caption: e.target.value }))} />
            <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" placeholder="Category" value={pForm.category} onChange={(e) => setPForm((p) => ({ ...p, category: e.target.value }))} />
            <input type="number" className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" placeholder="Sort Order" value={pForm.sort_order} onChange={(e) => setPForm((p) => ({ ...p, sort_order: Number(e.target.value) }))} />
            <input type="file" accept="image/*" className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-sm text-gov-muted file:mr-3 file:border-0 file:bg-cyan/10 file:px-3 file:py-1 file:font-semibold file:text-cyan" onChange={(e) => setPForm((p) => ({ ...p, image: e.target.files?.[0] || null }))} required />
            {progress > 0 ? <p className="mb-2 text-sm text-cyan">Upload: {progress}%</p> : null}
            <button className="bg-cyan px-5 py-2 font-head font-bold text-white">Save</button>
          </form>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {videos.data.map((item) => (
              <article key={item.id} className="admin-panel p-3">
                <img src={item.thumbnail} alt={item.title} className="mb-2 h-36 w-full rounded-lg border border-gov-line object-cover" />
                <p className="font-medium text-gov-ink">{item.title}</p>
                <p className="text-xs text-gov-muted">{item.category}</p>
                <div className="mt-2 flex gap-3 text-sm">
                  <button onClick={() => toggleVideo(item)} className="text-cyan">{item.is_active ? 'Active' : 'Hidden'}</button>
                  <button onClick={() => removeVideo(item.id)} className="text-rose-500">Delete</button>
                </div>
              </article>
            ))}
          </div>
          <form onSubmit={addVideo} className="admin-panel p-5">
            <h2 className="mb-4 font-head text-xl font-extrabold text-gov-ink">Add Video</h2>
            <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" placeholder="Title" value={vForm.title} onChange={(e) => setVForm((p) => ({ ...p, title: e.target.value }))} required />
            <textarea className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" rows={3} placeholder="Description" value={vForm.description} onChange={(e) => setVForm((p) => ({ ...p, description: e.target.value }))} />
            <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" placeholder="YouTube URL" value={vForm.youtube_url} onChange={(e) => setVForm((p) => ({ ...p, youtube_url: e.target.value }))} required />
            <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" placeholder="Category" value={vForm.category} onChange={(e) => setVForm((p) => ({ ...p, category: e.target.value }))} />
            <input type="number" className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" placeholder="Sort Order" value={vForm.sort_order} onChange={(e) => setVForm((p) => ({ ...p, sort_order: Number(e.target.value) }))} />
            <button className="bg-cyan px-5 py-2 font-head font-bold text-white">Save</button>
          </form>
        </div>
      )}
    </div>
  );
}
