import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { useAdminEvents, useAdminGalleryFolders, useAdminPhotos, useAdminVideos } from '../../hooks/useData';

const fInitial = { name: '', description: '', event_id: '', sort_order: 0, is_active: true, cover_image: null };
const pInitial = { title: '', caption: '', category: 'General', folder_id: '', sort_order: 0, is_active: true, image: null, images: [] };
const vInitial = {
  title: '',
  description: '',
  youtube_url: '',
  category: 'General',
  folder_id: '',
  sort_order: 0,
  is_active: true,
  video: null,
  videos: []
};

export default function AdminGallery() {
  const events = useAdminEvents();
  const folders = useAdminGalleryFolders();
  const photos = useAdminPhotos();
  const videos = useAdminVideos();
  const [tab, setTab] = useState('Folders');
  const [fForm, setFForm] = useState(fInitial);
  const [pForm, setPForm] = useState(pInitial);
  const [vForm, setVForm] = useState(vInitial);
  const [progress, setProgress] = useState(0);

  async function createFolder(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', fForm.name);
      formData.append('description', fForm.description);
      formData.append('sort_order', fForm.sort_order);
      formData.append('is_active', fForm.is_active);
      if (fForm.event_id) formData.append('event_id', fForm.event_id);
      if (fForm.cover_image) formData.append('cover_image', fForm.cover_image);

      await api.post('/gallery/admin/folders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Folder created');
      setFForm(fInitial);
      folders.refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  }

  async function toggleFolder(item) {
    try {
      await api.put('/gallery/admin/folders/' + item.id, {
        is_active: !item.is_active,
        name: item.name,
        description: item.description || '',
        event_id: item.event_id || '',
        sort_order: item.sort_order || 0
      });
      toast.success('Saved!');
      folders.refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  }

  async function removeFolder(id) {
    if (!confirm('Delete this folder? Existing media will be detached from folder.')) return;
    try {
      await api.delete('/gallery/admin/folders/' + id);
      toast.success('Deleted!');
      folders.refetch();
      photos.refetch();
      videos.refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  }

  async function uploadPhoto(e) {
    e.preventDefault();
    try {
      if (!pForm.folder_id) {
        toast.error('Select a folder for upload');
        return;
      }
      const formData = new FormData();
      formData.append('title', pForm.title);
      formData.append('caption', pForm.caption);
      formData.append('category', pForm.category);
      formData.append('sort_order', pForm.sort_order);
      formData.append('is_active', pForm.is_active);
      formData.append('folder_id', pForm.folder_id);
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

  async function uploadPhotoBulk(e) {
    e.preventDefault();
    try {
      if (!pForm.folder_id) {
        toast.error('Select a folder for upload');
        return;
      }
      if (!pForm.images.length) {
        toast.error('Select images first');
        return;
      }

      const formData = new FormData();
      formData.append('folder_id', pForm.folder_id);
      formData.append('caption', pForm.caption);
      formData.append('category', pForm.category);
      formData.append('sort_order', pForm.sort_order);
      formData.append('is_active', pForm.is_active);
      formData.append('title_prefix', pForm.title || 'Photo');
      pForm.images.forEach((file) => formData.append('images', file));

      const { data } = await api.post('/gallery/photos/bulk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(`Bulk upload complete: ${data.succeeded}/${data.total}`);
      setPForm((prev) => ({ ...pInitial, folder_id: prev.folder_id }));
      photos.refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Bulk upload failed');
    }
  }

  async function addVideo(e) {
    e.preventDefault();
    try {
      if (!vForm.folder_id) {
        toast.error('Select a folder for upload');
        return;
      }

      const formData = new FormData();
      formData.append('title', vForm.title);
      formData.append('description', vForm.description);
      formData.append('category', vForm.category);
      formData.append('sort_order', vForm.sort_order);
      formData.append('is_active', vForm.is_active);
      formData.append('folder_id', vForm.folder_id);
      if (vForm.youtube_url) formData.append('youtube_url', vForm.youtube_url);
      if (vForm.video) formData.append('video', vForm.video);

      await api.post('/gallery/videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Saved!');
      setVForm((prev) => ({ ...vInitial, folder_id: prev.folder_id }));
      videos.refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  }

  async function uploadVideoBulk(e) {
    e.preventDefault();
    try {
      if (!vForm.folder_id) {
        toast.error('Select a folder for upload');
        return;
      }
      if (!vForm.videos.length) {
        toast.error('Select video files first');
        return;
      }

      const formData = new FormData();
      formData.append('folder_id', vForm.folder_id);
      formData.append('description', vForm.description);
      formData.append('category', vForm.category);
      formData.append('sort_order', vForm.sort_order);
      formData.append('is_active', vForm.is_active);
      formData.append('title_prefix', vForm.title || 'Video');
      vForm.videos.forEach((file) => formData.append('videos', file));

      const { data } = await api.post('/gallery/videos/bulk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(`Bulk upload complete: ${data.succeeded}/${data.total}`);
      setVForm((prev) => ({ ...vInitial, folder_id: prev.folder_id }));
      videos.refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Bulk video upload failed');
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

  if (folders.loading || photos.loading || videos.loading || events.loading) return <Loader text="Loading gallery..." />;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {['Folders', 'Photos', 'Videos'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-semibold ${tab === t ? 'bg-cyan text-white' : 'border border-gov-line bg-gov-surface text-gov-muted hover:text-gov-ink'}`}>{t}</button>
        ))}
      </div>

      {tab === 'Folders' ? (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {folders.data.map((item) => (
              <article key={item.id} className="admin-panel p-3">
                {item.cover_image_url ? (
                  <img src={item.cover_image_url} alt={item.name} className="mb-2 h-36 w-full rounded-lg border border-gov-line object-cover" />
                ) : (
                  <div className="mb-2 flex h-36 w-full items-center justify-center rounded-lg border border-gov-line bg-gov-panel text-sm text-gov-muted">No cover</div>
                )}
                <p className="font-medium text-gov-ink">{item.name}</p>
                <p className="text-xs text-gov-muted">{item.events?.title || 'Custom Folder'}</p>
                <p className="text-xs text-gov-muted">Slug: {item.slug}</p>
                <div className="mt-2 flex gap-3 text-sm">
                  <button onClick={() => toggleFolder(item)} className="text-cyan">{item.is_active ? 'Active' : 'Hidden'}</button>
                  <button onClick={() => removeFolder(item.id)} className="text-rose-500">Delete</button>
                </div>
              </article>
            ))}
          </div>

          <form onSubmit={createFolder} className="admin-panel p-5">
            <h2 className="mb-4 font-head text-xl font-extrabold text-gov-ink">Create Event Folder</h2>
            <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" placeholder="Folder Name" value={fForm.name} onChange={(e) => setFForm((p) => ({ ...p, name: e.target.value }))} required />
            <textarea className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" rows={3} placeholder="Description" value={fForm.description} onChange={(e) => setFForm((p) => ({ ...p, description: e.target.value }))} />
            <select className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink" value={fForm.event_id} onChange={(e) => setFForm((p) => ({ ...p, event_id: e.target.value }))}>
              <option value="">Custom folder (not linked to event)</option>
              {events.data.map((event) => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
            <input type="number" className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" placeholder="Sort Order" value={fForm.sort_order} onChange={(e) => setFForm((p) => ({ ...p, sort_order: Number(e.target.value) }))} />
            <input type="file" accept="image/*" className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-sm text-gov-muted file:mr-3 file:border-0 file:bg-cyan/10 file:px-3 file:py-1 file:font-semibold file:text-cyan" onChange={(e) => setFForm((p) => ({ ...p, cover_image: e.target.files?.[0] || null }))} />
            <button className="bg-cyan px-5 py-2 font-head font-bold text-white">Create Folder</button>
          </form>
        </div>
      ) : null}

      {tab === 'Photos' ? (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {photos.data.map((item) => (
              <article key={item.id} className="admin-panel p-3">
                <img src={item.image_url} alt={item.title} className="mb-2 h-36 w-full rounded-lg border border-gov-line object-cover" />
                <p className="font-medium text-gov-ink">{item.title}</p>
                <p className="text-xs text-gov-muted">{item.category}</p>
                <p className="text-xs text-gov-muted">Folder: {item.gallery_folders?.name || 'Unassigned'}</p>
                <div className="mt-2 flex gap-3 text-sm">
                  <button onClick={() => togglePhoto(item)} className="text-cyan">{item.is_active ? 'Active' : 'Hidden'}</button>
                  <button onClick={() => removePhoto(item.id)} className="text-rose-500">Delete</button>
                </div>
              </article>
            ))}
          </div>
          <div className="space-y-5">
            <form onSubmit={uploadPhoto} className="admin-panel p-5">
              <h2 className="mb-4 font-head text-xl font-extrabold text-gov-ink">Upload Single Photo</h2>
              <select className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink" value={pForm.folder_id} onChange={(e) => setPForm((p) => ({ ...p, folder_id: e.target.value }))} required>
                <option value="">Select folder</option>
                {folders.data.map((folder) => (
                  <option key={folder.id} value={folder.id}>{folder.name}</option>
                ))}
              </select>
              <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" placeholder="Title" value={pForm.title} onChange={(e) => setPForm((p) => ({ ...p, title: e.target.value }))} required />
              <textarea className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" rows={3} placeholder="Caption" value={pForm.caption} onChange={(e) => setPForm((p) => ({ ...p, caption: e.target.value }))} />
              <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" placeholder="Category" value={pForm.category} onChange={(e) => setPForm((p) => ({ ...p, category: e.target.value }))} />
              <input type="number" className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" placeholder="Sort Order" value={pForm.sort_order} onChange={(e) => setPForm((p) => ({ ...p, sort_order: Number(e.target.value) }))} />
              <input type="file" accept="image/*" className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-sm text-gov-muted file:mr-3 file:border-0 file:bg-cyan/10 file:px-3 file:py-1 file:font-semibold file:text-cyan" onChange={(e) => setPForm((p) => ({ ...p, image: e.target.files?.[0] || null }))} required />
              {progress > 0 ? <p className="mb-2 text-sm text-cyan">Upload: {progress}%</p> : null}
              <button className="bg-cyan px-5 py-2 font-head font-bold text-white">Save Photo</button>
            </form>

            <form onSubmit={uploadPhotoBulk} className="admin-panel p-5">
              <h2 className="mb-4 font-head text-xl font-extrabold text-gov-ink">Bulk Import Photos</h2>
              <select className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink" value={pForm.folder_id} onChange={(e) => setPForm((p) => ({ ...p, folder_id: e.target.value }))} required>
                <option value="">Select folder</option>
                {folders.data.map((folder) => (
                  <option key={folder.id} value={folder.id}>{folder.name}</option>
                ))}
              </select>
              <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" placeholder="Title Prefix (e.g. Hackathon Photo)" value={pForm.title} onChange={(e) => setPForm((p) => ({ ...p, title: e.target.value }))} />
              <input type="file" accept="image/*" multiple className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-sm text-gov-muted file:mr-3 file:border-0 file:bg-cyan/10 file:px-3 file:py-1 file:font-semibold file:text-cyan" onChange={(e) => setPForm((p) => ({ ...p, images: Array.from(e.target.files || []) }))} required />
              <button className="bg-cyan px-5 py-2 font-head font-bold text-white">Bulk Upload Photos</button>
            </form>
          </div>
        </div>
      ) : null}

      {tab === 'Videos' ? (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {videos.data.map((item) => (
              <article key={item.id} className="admin-panel p-3">
                {item.thumbnail ? <img src={item.thumbnail} alt={item.title} className="mb-2 h-36 w-full rounded-lg border border-gov-line object-cover" /> : null}
                <p className="font-medium text-gov-ink">{item.title}</p>
                <p className="text-xs text-gov-muted">{item.category}</p>
                <p className="text-xs text-gov-muted">Source: {item.source_type || 'youtube'}</p>
                <p className="text-xs text-gov-muted">Folder: {item.gallery_folders?.name || 'Unassigned'}</p>
                <div className="mt-2 flex gap-3 text-sm">
                  <button onClick={() => toggleVideo(item)} className="text-cyan">{item.is_active ? 'Active' : 'Hidden'}</button>
                  <button onClick={() => removeVideo(item.id)} className="text-rose-500">Delete</button>
                </div>
              </article>
            ))}
          </div>
          <div className="space-y-5">
            <form onSubmit={addVideo} className="admin-panel p-5">
              <h2 className="mb-4 font-head text-xl font-extrabold text-gov-ink">Add Video (YouTube or File)</h2>
              <select className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink" value={vForm.folder_id} onChange={(e) => setVForm((p) => ({ ...p, folder_id: e.target.value }))} required>
                <option value="">Select folder</option>
                {folders.data.map((folder) => (
                  <option key={folder.id} value={folder.id}>{folder.name}</option>
                ))}
              </select>
              <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" placeholder="Title" value={vForm.title} onChange={(e) => setVForm((p) => ({ ...p, title: e.target.value }))} required />
              <textarea className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" rows={3} placeholder="Description" value={vForm.description} onChange={(e) => setVForm((p) => ({ ...p, description: e.target.value }))} />
              <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" placeholder="YouTube URL (optional if uploading video file)" value={vForm.youtube_url} onChange={(e) => setVForm((p) => ({ ...p, youtube_url: e.target.value }))} />
              <input type="file" accept="video/*" className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-sm text-gov-muted file:mr-3 file:border-0 file:bg-cyan/10 file:px-3 file:py-1 file:font-semibold file:text-cyan" onChange={(e) => setVForm((p) => ({ ...p, video: e.target.files?.[0] || null }))} />
              <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" placeholder="Category" value={vForm.category} onChange={(e) => setVForm((p) => ({ ...p, category: e.target.value }))} />
              <input type="number" className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" placeholder="Sort Order" value={vForm.sort_order} onChange={(e) => setVForm((p) => ({ ...p, sort_order: Number(e.target.value) }))} />
              <button className="bg-cyan px-5 py-2 font-head font-bold text-white">Save Video</button>
            </form>

            <form onSubmit={uploadVideoBulk} className="admin-panel p-5">
              <h2 className="mb-4 font-head text-xl font-extrabold text-gov-ink">Bulk Import Video Files</h2>
              <select className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink" value={vForm.folder_id} onChange={(e) => setVForm((p) => ({ ...p, folder_id: e.target.value }))} required>
                <option value="">Select folder</option>
                {folders.data.map((folder) => (
                  <option key={folder.id} value={folder.id}>{folder.name}</option>
                ))}
              </select>
              <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" placeholder="Title Prefix (e.g. Hackathon Clip)" value={vForm.title} onChange={(e) => setVForm((p) => ({ ...p, title: e.target.value }))} />
              <input type="file" accept="video/*" multiple className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-sm text-gov-muted file:mr-3 file:border-0 file:bg-cyan/10 file:px-3 file:py-1 file:font-semibold file:text-cyan" onChange={(e) => setVForm((p) => ({ ...p, videos: Array.from(e.target.files || []) }))} required />
              <button className="bg-cyan px-5 py-2 font-head font-bold text-white">Bulk Upload Videos</button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
