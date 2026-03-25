import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { useAdminTicker } from '../../hooks/useData';

const initial = { message: '', link: '', sort_order: 0, is_active: true };

export default function AdminTicker() {
  const { data, loading, refetch } = useAdminTicker();
  const [form, setForm] = useState(initial);
  const [editId, setEditId] = useState(null);

  async function submit(e) {
    e.preventDefault();
    try {
      if (editId) await api.put('/ticker/' + editId, form);
      else await api.post('/ticker', form);
      toast.success('Saved!');
      setForm(initial);
      setEditId(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  }

  async function remove(id) {
    if (!confirm('Delete this item?')) return;
    try {
      await api.delete('/ticker/' + id);
      toast.success('Saved!');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  }

  async function toggle(item) {
    try {
      await api.put('/ticker/' + item.id, { is_active: !item.is_active });
      toast.success('Saved!');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  }

  if (loading) return <Loader text="Loading ticker items..." />;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
      <div className="space-y-3 border border-gov-line bg-gov-surface p-4">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gov-muted">Ticker Items</p>
          <p className="text-xs text-gov-muted">{data.length} total</p>
        </div>
        {data.map((item) => (
          <article key={item.id} className="rounded-xl border border-gov-line bg-gov-panel p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 font-semibold text-gov-ink">{item.message}</p>
                {item.link ? <a href={item.link} target="_blank" rel="noreferrer" className="mt-1 block truncate text-sm text-cyan hover:underline">{item.link}</a> : <p className="mt-1 text-sm text-gov-muted">No link attached</p>}
              </div>
              <span className={`chip ${item.is_active ? 'border-cyan/30 bg-cyan/10 text-cyan' : 'border-gov-line bg-gov-surface text-gov-muted'}`}>{item.is_active ? 'Active' : 'Inactive'}</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-gov-line pt-3 text-sm">
              <p className="text-gov-muted">Order: <span className="font-semibold text-gov-ink">{item.sort_order}</span></p>
              <div className="flex items-center gap-4">
                <button onClick={() => toggle(item)} className="font-semibold text-cyan">Toggle</button>
                <button onClick={() => { setEditId(item.id); setForm(item); }} className="font-semibold text-cyan">Edit</button>
                <button onClick={() => remove(item.id)} className="font-semibold text-rose-500">Delete</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <form onSubmit={submit} className="border border-gov-line bg-gov-surface p-5">
        <h2 className="mb-4 font-head text-xl font-extrabold text-gov-ink">{editId ? 'Edit Item' : 'Add New'}</h2>
        <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink" placeholder="Message" value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} required />
        <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink" placeholder="Link URL" value={form.link || ''} onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))} />
        <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink" type="number" placeholder="Sort Order" value={form.sort_order} onChange={(e) => setForm((p) => ({ ...p, sort_order: Number(e.target.value) }))} />
        <label className="mb-4 flex items-center gap-2"><input type="checkbox" checked={!!form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} /> Is Active</label>
        <button className="bg-cyan px-5 py-2 font-head font-bold text-white">Save</button>
      </form>
    </div>
  );
}
