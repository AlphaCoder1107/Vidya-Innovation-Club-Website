import { Router } from 'express';
import multer from 'multer';
import { supabase } from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

function extractYoutubeEmbed(url) {
  if (!url) return '';
  if (url.includes('embed/')) return url;
  if (url.includes('watch?v=')) return url.replace('watch?v=', 'embed/');
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0];
    return id ? `https://www.youtube.com/embed/${id}` : url;
  }
  return url;
}

function youtubeThumb(url) {
  let id = '';
  if (url.includes('watch?v=')) id = url.split('watch?v=')[1].split('&')[0];
  if (url.includes('youtu.be/')) id = url.split('youtu.be/')[1].split('?')[0];
  if (url.includes('embed/')) id = url.split('embed/')[1].split('?')[0];
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}

async function uploadPhoto(file) {
  const ext = file.originalname.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage
    .from('gallery-photos')
    .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: false });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('gallery-photos').getPublicUrl(fileName);
  return data.publicUrl;
}

router.get('/photos', async (_req, res) => {
  const { data, error } = await supabase
    .from('gallery_photos')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) return res.status(400).json({ error: error.message });
  return res.json(data || []);
});

router.get('/videos', async (_req, res) => {
  const { data, error } = await supabase
    .from('gallery_videos')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) return res.status(400).json({ error: error.message });
  return res.json(data || []);
});

router.get('/admin/photos', requireAuth, async (_req, res) => {
  const { data, error } = await supabase
    .from('gallery_photos')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  return res.json(data || []);
});

router.get('/admin/videos', requireAuth, async (_req, res) => {
  const { data, error } = await supabase
    .from('gallery_videos')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  return res.json(data || []);
});

router.post('/photos', requireAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image is required' });
    const imageUrl = await uploadPhoto(req.file);

    const payload = {
      title: req.body.title,
      caption: req.body.caption || '',
      category: req.body.category || 'General',
      sort_order: Number(req.body.sort_order || 0),
      image_url: imageUrl,
      is_active: req.body.is_active !== 'false'
    };

    const { data, error } = await supabase.from('gallery_photos').insert(payload).select().single();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

router.put('/photos/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const payload = { ...req.body };
  const { data, error } = await supabase
    .from('gallery_photos')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
});

router.delete('/photos/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('gallery_photos').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  return res.json({ message: 'Deleted' });
});

router.post('/videos', requireAuth, async (req, res) => {
  const payload = {
    ...req.body,
    youtube_url: extractYoutubeEmbed(req.body.youtube_url),
    thumbnail: req.body.thumbnail || youtubeThumb(req.body.youtube_url)
  };

  const { data, error } = await supabase.from('gallery_videos').insert(payload).select().single();
  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data);
});

router.put('/videos/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const payload = {
    ...req.body,
    youtube_url: req.body.youtube_url ? extractYoutubeEmbed(req.body.youtube_url) : req.body.youtube_url
  };
  const { data, error } = await supabase
    .from('gallery_videos')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
});

router.delete('/videos/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('gallery_videos').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  return res.json({ message: 'Deleted' });
});

export default router;
