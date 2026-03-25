import { useMemo, useState } from 'react';
import ReactQuill from 'react-quill';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { useAdminBlog } from '../../hooks/useData';

const initial = {
  title: '', slug: '', excerpt: '', author_name: 'Team VIC Club', category: 'General', content: '', is_published: false, cover_image_file: null
};

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ header: [2, 3, false] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image', 'code-block', 'blockquote'],
    ['clean']
  ]
};

function toSlug(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function AdminBlog() {
  const { data, loading, refetch } = useAdminBlog();
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initial);

  const sorted = useMemo(() => [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)), [data]);

  async function save(publish) {
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('slug', form.slug || toSlug(form.title));
      fd.append('excerpt', form.excerpt);
      fd.append('author_name', form.author_name);
      fd.append('category', form.category);
      fd.append('content', form.content);
      fd.append('is_published', String(publish));
      if (form.cover_image_file) fd.append('cover_image', form.cover_image_file);

      if (editId) await api.put('/blog/' + editId, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await api.post('/blog', fd, { headers: { 'Content-Type': 'multipart/form-data' } });

      toast.success('Saved!');
      setEditing(false);
      setEditId(null);
      setForm(initial);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  }

  async function remove(id) {
    if (!confirm('Delete this post?')) return;
    try {
      await api.delete('/blog/' + id);
      toast.success('Saved!');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  }

  if (loading) return <Loader text="Loading posts..." />;

  if (editing) {
    return (
      <div className="space-y-4 border border-gov-line bg-gov-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-head text-2xl font-extrabold text-gov-ink">{editId ? 'Edit Post' : 'New Post'}</h2>
          <button onClick={() => { setEditing(false); setEditId(null); setForm(initial); }} className="text-gov-muted hover:text-gov-ink">Close</button>
        </div>
        <input className="w-full border border-gov-line bg-gov-surface px-4 py-3 font-head text-2xl text-gov-ink" placeholder="Post title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value, slug: toSlug(e.target.value) }))} />
        <input className="w-full border border-gov-line bg-gov-surface px-4 py-3 text-gov-ink" placeholder="Slug" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} />
        <textarea className="w-full border border-gov-line bg-gov-surface px-4 py-3 text-gov-ink" rows={3} placeholder="Excerpt" value={form.excerpt} onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))} />
        <div className="grid gap-3 md:grid-cols-3">
          <input className="border border-gov-line bg-gov-surface px-4 py-3 text-gov-ink" placeholder="Author" value={form.author_name} onChange={(e) => setForm((p) => ({ ...p, author_name: e.target.value }))} />
          <select className="border border-gov-line bg-gov-surface px-4 py-3 text-gov-ink" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
            {['General', 'AI & ML', 'IoT', 'Robotics', 'Startups', 'Research'].map((c) => <option key={c}>{c}</option>)}
          </select>
          <input type="file" accept="image/*" className="border border-gov-line bg-gov-surface px-4 py-3 text-sm text-gov-muted" onChange={(e) => setForm((p) => ({ ...p, cover_image_file: e.target.files?.[0] || null }))} />
        </div>
        <ReactQuill theme="snow" value={form.content} onChange={(value) => setForm((p) => ({ ...p, content: value }))} modules={modules} />
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm((p) => ({ ...p, is_published: e.target.checked }))} /> Is Published</label>
        <div className="flex gap-3">
          <button onClick={() => save(false)} className="border border-gov-line px-5 py-2 text-gov-muted hover:border-cyan hover:text-cyan">Save Draft</button>
          <button onClick={() => save(true)} className="bg-cyan px-5 py-2 font-head font-bold text-white">Publish</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setEditing(true)} className="bg-cyan px-5 py-2 font-head font-bold text-white">New Post</button>
      </div>
      <div className="space-y-3 border border-gov-line bg-gov-surface p-4">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gov-muted">Blog Posts</p>
          <p className="text-xs text-gov-muted">{sorted.length} total</p>
        </div>
        {sorted.map((item) => (
          <article key={item.id} className="rounded-xl border border-gov-line bg-gov-panel p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 font-semibold text-gov-ink">{item.title}</p>
                <p className="mt-1 text-sm text-gov-muted">{item.author_name} • {new Date(item.published_at || item.created_at).toLocaleDateString('en-IN')}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="chip border-cyan/20 bg-cyan/8 text-cyan">{item.category}</span>
                <span className={`chip ${item.is_published ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-gov-line bg-gov-surface text-gov-muted'}`}>{item.is_published ? 'Published' : 'Draft'}</span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-end gap-4 border-t border-gov-line pt-3 text-sm">
              <button onClick={() => { setEditing(true); setEditId(item.id); setForm({ ...initial, ...item, cover_image_file: null }); }} className="font-semibold text-cyan">Edit</button>
              <button onClick={() => remove(item.id)} className="font-semibold text-rose-500">Delete</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
