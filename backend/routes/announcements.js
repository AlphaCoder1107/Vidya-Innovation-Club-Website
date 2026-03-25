import { Router } from 'express';
import { supabase } from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  const limit = Number(req.query.limit || 20);
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) return res.status(400).json({ error: error.message });
  return res.json(data || []);
});

router.get('/admin/list', requireAuth, async (_req, res) => {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  return res.json(data || []);
});

router.post('/', requireAuth, async (req, res) => {
  const payload = {
    ...req.body,
    published_at: req.body.published_at || new Date().toISOString()
  };
  const { data, error } = await supabase.from('announcements').insert(payload).select().single();
  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data);
});

router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('announcements')
    .update(req.body)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
});

router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('announcements').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  return res.json({ message: 'Deleted' });
});

export default router;
