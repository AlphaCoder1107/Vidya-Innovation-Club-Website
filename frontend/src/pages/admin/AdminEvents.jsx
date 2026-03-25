import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { useAdminEvents } from '../../hooks/useData';

const initial = {
  title: '', description: '', event_type: 'Workshop', event_date: '', event_time: '', venue: '',
  registration_link: '', cover_image: '', is_active: true
};

const types = ['Workshop', 'Hackathon', 'Seminar', 'Demo Day', 'Conference', 'Other'];

function localDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function AdminEvents() {
  const { data, loading, refetch } = useAdminEvents();
  const [form, setForm] = useState(initial);
  const [editId, setEditId] = useState(null);
  const [tab, setTab] = useState('Upcoming');

  const filtered = useMemo(() => {
    if (tab === 'All') return data;
    const now = localDateKey();
    return data.filter((e) => (e.event_date || '') >= now);
  }, [data, tab]);

  async function submit(e) {
    e.preventDefault();
    try {
      if (editId) await api.put('/events/' + editId, form);
      else await api.post('/events', form);
      toast.success('Saved!');
      setForm(initial);
      setEditId(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  }

  async function remove(id) {
    if (!confirm('Delete this event?')) return;
    try {
      await api.delete('/events/' + id);
      toast.success('Saved!');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  }

  async function toggle(item) {
    try {
      await api.put('/events/' + item.id, { is_active: !item.is_active });
      toast.success('Saved!');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  }

  if (loading) return <Loader text="Loading events..." />;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {['Upcoming', 'All'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-semibold ${tab === t ? 'bg-cyan text-white' : 'border border-gov-line bg-gov-surface text-gov-muted hover:text-gov-ink'}`}>{t}</button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <div className="space-y-3 border border-gov-line bg-gov-surface p-4">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gov-muted">Events</p>
            <p className="text-xs text-gov-muted">{filtered.length} shown</p>
          </div>
          {filtered.map((item) => (
            <article key={item.id} className="rounded-xl border border-gov-line bg-gov-panel p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 font-semibold text-gov-ink">{item.title}</p>
                  <p className="mt-1 text-sm text-gov-muted">{item.event_date} • {item.venue || 'Venue TBA'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="chip border-amber/30 bg-amber/15 text-amber">{item.event_type}</span>
                  <span className={`chip ${item.is_active ? 'border-cyan/30 bg-cyan/10 text-cyan' : 'border-gov-line bg-gov-surface text-gov-muted'}`}>{item.is_active ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-end gap-4 border-t border-gov-line pt-3 text-sm">
                <button onClick={() => toggle(item)} className="font-semibold text-cyan">Toggle</button>
                <button onClick={() => { setEditId(item.id); setForm(item); }} className="font-semibold text-cyan">Edit</button>
                <button onClick={() => remove(item.id)} className="font-semibold text-rose-500">Delete</button>
              </div>
            </article>
          ))}
        </div>

        <form onSubmit={submit} className="border border-gov-line bg-gov-surface p-5">
          <h2 className="mb-4 font-head text-xl font-extrabold text-gov-ink">{editId ? 'Edit Event' : 'Add New Event'}</h2>
          <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink" placeholder="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
          <textarea className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink" placeholder="Description" value={form.description || ''} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} />
          <select className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink" value={form.event_type} onChange={(e) => setForm((p) => ({ ...p, event_type: e.target.value }))}>{types.map((t) => <option key={t}>{t}</option>)}</select>
          <input type="date" className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink" value={form.event_date || ''} onChange={(e) => setForm((p) => ({ ...p, event_date: e.target.value }))} required />
          <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink" placeholder="Event Time" value={form.event_time || ''} onChange={(e) => setForm((p) => ({ ...p, event_time: e.target.value }))} />
          <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink" placeholder="Venue" value={form.venue || ''} onChange={(e) => setForm((p) => ({ ...p, venue: e.target.value }))} />
          <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink" placeholder="Registration URL" value={form.registration_link || ''} onChange={(e) => setForm((p) => ({ ...p, registration_link: e.target.value }))} />
          <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink" placeholder="Cover Image URL" value={form.cover_image || ''} onChange={(e) => setForm((p) => ({ ...p, cover_image: e.target.value }))} />
          <label className="mb-4 flex items-center gap-2"><input type="checkbox" checked={!!form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} /> Is Active</label>
          <button className="bg-cyan px-5 py-2 font-head font-bold text-white">Save</button>
        </form>
      </div>
    </div>
  );
}
