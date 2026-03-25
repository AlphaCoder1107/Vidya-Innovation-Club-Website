import { Router } from 'express';
import multer from 'multer';
import { supabase } from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

async function uploadCover(file) {
  if (!file) return null;
  const ext = file.originalname.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage
    .from('event-covers')
    .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: false });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('event-covers').getPublicUrl(fileName);
  return data.publicUrl;
}

router.get('/', async (req, res) => {
  const type = req.query.type || 'upcoming';
  const today = new Date().toISOString().slice(0, 10);

  let query = supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .order('event_date', { ascending: true });

  if (type === 'past') {
    query = query.lt('event_date', today).order('event_date', { ascending: false });
  } else if (type === 'upcoming') {
    query = query.gte('event_date', today);
  }

  const { data, error } = await query;
  if (error) return res.status(400).json({ error: error.message });
  return res.json(data || []);
});

router.get('/admin/list', requireAuth, async (_req, res) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  return res.json(data || []);
});

router.post('/', requireAuth, upload.single('cover_image'), async (req, res) => {
  try {
    const coverUrl = req.file ? await uploadCover(req.file) : req.body.cover_image || null;
    const payload = { ...req.body, cover_image: coverUrl };
    const { data, error } = await supabase.from('events').insert(payload).select().single();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, upload.single('cover_image'), async (req, res) => {
  try {
    const { id } = req.params;
    const coverUrl = req.file ? await uploadCover(req.file) : req.body.cover_image;
    const payload = { ...req.body };
    if (coverUrl) payload.cover_image = coverUrl;

    const { data, error } = await supabase
      .from('events')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  return res.json({ message: 'Deleted' });
});

export default router;
