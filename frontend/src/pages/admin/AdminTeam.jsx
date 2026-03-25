import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { useAdminTeam } from '../../hooks/useData';

const initial = {
  name: '', role: '', department: '', bio: '', email: '', linkedin: '', sort_order: 0, is_active: true, photo: null
};

export default function AdminTeam() {
  const { data, loading, refetch } = useAdminTeam();
  const [form, setForm] = useState(initial);
  const [editId, setEditId] = useState(null);

  async function submit(e) {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'photo') return;
        fd.append(k, String(v ?? ''));
      });
      if (form.photo) fd.append('photo', form.photo);

      if (editId) await api.put('/team/' + editId, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await api.post('/team', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Saved!');
      setForm(initial);
      setEditId(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  }

  async function remove(id) {
    if (!confirm('Delete this member?')) return;
    try {
      await api.delete('/team/' + id);
      toast.success('Saved!');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  }

  async function toggle(item) {
    try {
      await api.put('/team/' + item.id, { is_active: !item.is_active });
      toast.success('Saved!');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  }

  if (loading) return <Loader text="Loading team..." />;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {data.map((item) => (
          <article key={item.id} className="admin-panel p-4">
            <img src={item.photo_url} alt={item.name} className="mb-3 h-28 w-28 rounded-full border border-gov-line object-cover" />
            <p className="font-head text-lg font-extrabold text-gov-ink">{item.name}</p>
            <p className="font-semibold text-cyan">{item.role}</p>
            <p className="text-sm text-gov-muted">{item.department}</p>
            <div className="mt-3 flex gap-3 text-sm">
              <button onClick={() => toggle(item)} className="text-cyan">{item.is_active ? 'Active' : 'Hidden'}</button>
              <button onClick={() => { setEditId(item.id); setForm({ ...initial, ...item, photo: null }); }} className="text-cyan">Edit</button>
              <button onClick={() => remove(item.id)} className="text-rose-500">Delete</button>
            </div>
          </article>
        ))}
      </div>

      <form onSubmit={submit} className="admin-panel p-5">
        <h2 className="mb-4 font-head text-xl font-extrabold text-gov-ink">{editId ? 'Edit Member' : 'Add Member'}</h2>
        <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" placeholder="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
        <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" placeholder="Role" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} required />
        <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" placeholder="Department" value={form.department} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))} />
        <textarea className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" rows={3} placeholder="Bio" value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} />
        <input type="file" accept="image/*" className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-sm text-gov-muted file:mr-3 file:border-0 file:bg-cyan/10 file:px-3 file:py-1 file:font-semibold file:text-cyan" onChange={(e) => setForm((p) => ({ ...p, photo: e.target.files?.[0] || null }))} />
        <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
        <input className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" placeholder="LinkedIn URL" value={form.linkedin} onChange={(e) => setForm((p) => ({ ...p, linkedin: e.target.value }))} />
        <input type="number" className="mb-3 w-full border border-gov-line bg-gov-surface px-3 py-2 text-gov-ink placeholder:text-gov-muted" placeholder="Sort Order" value={form.sort_order} onChange={(e) => setForm((p) => ({ ...p, sort_order: Number(e.target.value) }))} />
        <button className="bg-cyan px-5 py-2 font-head font-bold text-white">Save</button>
      </form>
    </div>
  );
}
