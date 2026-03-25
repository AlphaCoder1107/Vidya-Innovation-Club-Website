import { Router } from 'express';
import multer from 'multer';
import { supabase } from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

async function uploadPhoto(file) {
  if (!file) return null;
  const ext = file.originalname.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage
    .from('team-photos')
    .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: false });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('team-photos').getPublicUrl(fileName);
  return data.publicUrl;
}

router.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) return res.status(400).json({ error: error.message });
  return res.json(data || []);
});

router.get('/admin/list', requireAuth, async (_req, res) => {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) return res.status(400).json({ error: error.message });
  return res.json(data || []);
});

router.post('/', requireAuth, upload.single('photo'), async (req, res) => {
  try {
    const photoUrl = req.file ? await uploadPhoto(req.file) : req.body.photo_url || null;
    const payload = { ...req.body, photo_url: photoUrl };
    const { data, error } = await supabase.from('team_members').insert(payload).select().single();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, upload.single('photo'), async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };
    if (req.file) payload.photo_url = await uploadPhoto(req.file);

    const { data, error } = await supabase
      .from('team_members')
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
  const { error } = await supabase.from('team_members').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  return res.json({ message: 'Deleted' });
});

export default router;
