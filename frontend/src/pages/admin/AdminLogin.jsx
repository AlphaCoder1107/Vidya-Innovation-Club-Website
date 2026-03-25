import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await login(form.username, form.password);
      toast.success('Welcome back');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gov-bg px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md border border-gov-line bg-gov-surface p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan/15 font-head text-xl font-extrabold text-cyan">VIC</div>
          <h1 className="font-head text-3xl font-extrabold text-gov-ink">Admin Login</h1>
        </div>
        <label className="mb-2 block text-sm text-gov-muted">Username</label>
        <input
          className="mb-4 w-full border border-gov-line bg-gov-surface px-4 py-3 text-gov-ink outline-none focus:border-cyan"
          value={form.username}
          onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
          required
        />
        <label className="mb-2 block text-sm text-gov-muted">Password</label>
        <input
          type="password"
          className="mb-6 w-full border border-gov-line bg-gov-surface px-4 py-3 text-gov-ink outline-none focus:border-cyan"
          value={form.password}
          onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          required
        />
        <button disabled={loading} className="w-full bg-cyan px-7 py-3 font-head font-bold text-white transition-all hover:bg-cyan/90 disabled:opacity-60">
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
