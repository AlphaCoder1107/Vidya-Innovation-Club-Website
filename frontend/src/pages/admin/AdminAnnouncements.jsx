import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { useAdminAnnouncements } from '../../hooks/useData';

const initial = { title: '', description: '', file_url: '', published_at: new Date().toISOString().slice(0, 16), is_active: true };

export default function AdminAnnouncements() {
  const { data, loading, refetch } = useAdminAnnouncements();
  const [form, setForm] = useState(initial);
  const [editId, setEditId] = useState(null);

  async function submit(e) {
    e.preventDefault();
    try {
      if (editId) await api.put('/announcements/' + editId, form);
      else await api.post('/announcements', form);
      toast.success('Saved!');
      setForm(initial);
      setEditId(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  }

  async function remove(id) {
    if (!confirm('Delete this announcement?')) return;
    try {
      await api.delete('/announcements/' + id);
      toast.success('Saved!');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  }

  async function toggle(item) {
    try {
      await api.put('/announcements/' + item.id, { is_active: !item.is_active });
      toast.success('Saved!');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  }

  if (loading) return <Loader text="Loading announcements..." />;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
      <div className="space-y-3 border border-gov-line bg-gov-surface p-4">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gov-muted">Announcement Items</p>
          <p className="text-xs text-gov-muted">{data.length} total</p>
        </div>
        {data.map((item) => (
          <article key={item.id} className="rounded-xl border border-gov-line bg-gov-panel p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 font-semibold text-gov-ink">{item.title}</p>
                <p className="mt-1 text-sm text-gov-muted">{new Date(item.published_at || item.created_at).toLocaleDateString('en-IN')}</p>
                {item.file_url ? <a href={item.file_url} target="_blank" rel="noreferrer" className="mt-1 block truncate text-sm text-cyan hover:underline">{item.file_url}</a> : null}
              </div>
              <span className={`chip ${item.is_active ? 'border-cyan/30 bg-cyan/10 text-cyan' : 'border-gov-line bg-gov-surface text-gov-muted'}`}>{item.is_active ? 'Active' : 'Inactive'}</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-end gap-4 border-t border-gov-line pt-3 text-sm">
              <button onClick={() => toggle(item)} className="font-semibold text-cyan">Toggle</button>
              <button onClick={() => { setEditId(item.id); setForm({ ...item, published_at: (item.published_at || '').slice(0, 16) }); }} className="font-semibold text-cyan">Edit</button>
              <button onClick={() => remove(item.id)} className="font-semibold text-rose-500">Delete</button>
            </div>
          </article>
        ))}
      </div>

      <form onSubmit={submit} className="border border-gov-line bg-gov-surface p-5">
        <h2 className="mb-4 font-head text-xl font-extrabold text-gov-ink">{editId ? 'Edit' : 'Add New Announcement'}</h2>
        <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink" placeholder="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
        <textarea className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink" placeholder="Description" value={form.description || ''} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={4} />
        <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink" placeholder="File URL" value={form.file_url || ''} onChange={(e) => setForm((p) => ({ ...p, file_url: e.target.value }))} />
        <p className="mb-2 text-xs text-gov-muted">Use Supabase Storage to upload PDF, then paste public URL.</p>
        <input type="datetime-local" className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink" value={form.published_at || ''} onChange={(e) => setForm((p) => ({ ...p, published_at: e.target.value }))} />
        <label className="mb-4 flex items-center gap-2"><input type="checkbox" checked={!!form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} /> Is Active</label>
        <button className="bg-cyan px-5 py-2 font-head font-bold text-white">Save</button>
      </form>
    </div>
  );
}
