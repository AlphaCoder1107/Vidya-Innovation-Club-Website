import { Router } from 'express';
import multer from 'multer';
import { supabase } from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function uploadCover(file) {
  if (!file) return null;
  const ext = file.originalname.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage
    .from('blog-covers')
    .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: false });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('blog-covers').getPublicUrl(fileName);
  return data.publicUrl;
}

router.get('/', async (req, res) => {
  const limit = Number(req.query.limit || 50);
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit);
  if (error) return res.status(400).json({ error: error.message });
  return res.json(data || []);
});

router.get('/admin/list', requireAuth, async (_req, res) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  return res.json(data || []);
});

router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error || !data) return res.status(404).json({ error: 'Post not found' });
  return res.json(data);
});

router.post('/', requireAuth, upload.single('cover_image'), async (req, res) => {
  try {
    const coverUrl = req.file ? await uploadCover(req.file) : req.body.cover_image || null;
    const title = req.body.title;
    const payload = {
      ...req.body,
      title,
      slug: req.body.slug || slugify(title),
      cover_image: coverUrl,
      is_published: req.body.is_published === true || req.body.is_published === 'true',
      published_at: (req.body.is_published === true || req.body.is_published === 'true')
        ? (req.body.published_at || new Date().toISOString())
        : null
    };

    const { data, error } = await supabase.from('blog_posts').insert(payload).select().single();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, upload.single('cover_image'), async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    if (req.file) {
      payload.cover_image = await uploadCover(req.file);
    }

    if (payload.title && !payload.slug) payload.slug = slugify(payload.title);
    if (payload.is_published === true || payload.is_published === 'true') {
      payload.published_at = payload.published_at || new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('blog_posts')
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
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  return res.json({ message: 'Deleted' });
});

export default router;
