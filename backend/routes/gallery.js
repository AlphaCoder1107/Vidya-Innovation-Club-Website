import { Router } from 'express';
import multer from 'multer';
import { supabase } from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

function slugify(value = '') {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'folder';
}

function parseBoolean(value, defaultValue = true) {
  if (value === undefined || value === null || value === '') return defaultValue;
  return value !== 'false' && value !== false;
}

async function ensureFolder(folderId) {
  if (!folderId) return null;
  const { data, error } = await supabase
    .from('gallery_folders')
    .select('id')
    .eq('id', folderId)
    .single();
  if (error || !data) throw new Error('Folder not found');
  return data;
}

async function slugExists(slug, ignoreId = null) {
  let query = supabase.from('gallery_folders').select('id').eq('slug', slug).limit(1);
  if (ignoreId) query = query.neq('id', ignoreId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return Boolean(data?.length);
}

async function uniqueSlug(source, ignoreId = null) {
  const base = slugify(source);
  let index = 0;
  while (true) {
    const next = index === 0 ? base : `${base}-${index}`;
    // eslint-disable-next-line no-await-in-loop
    const exists = await slugExists(next, ignoreId);
    if (!exists) return next;
    index += 1;
  }
}

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

async function uploadPhoto(file, folderId = null) {
  return uploadMedia(file, 'gallery-photos', folderId ? `folder/${folderId}/photos` : 'legacy/photos');
}

async function uploadVideo(file, folderId = null) {
  return uploadMedia(file, 'gallery-videos', folderId ? `folder/${folderId}/videos` : 'legacy/videos');
}

async function uploadMedia(file, bucket, pathPrefix = '') {
  const ext = file.originalname.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const key = pathPrefix ? `${pathPrefix}/${fileName}` : fileName;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(key, file.buffer, { contentType: file.mimetype, upsert: false });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(bucket).getPublicUrl(key);
  return data.publicUrl;
}

router.get('/folders', async (_req, res) => {
  const { data: folders, error } = await supabase
    .from('gallery_folders')
    .select('*, events(id, title, event_date)')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  const [photosRes, videosRes] = await Promise.all([
    supabase.from('gallery_photos').select('folder_id').eq('is_active', true).not('folder_id', 'is', null),
    supabase.from('gallery_videos').select('folder_id').eq('is_active', true).not('folder_id', 'is', null)
  ]);

  const photoCounts = (photosRes.data || []).reduce((acc, item) => {
    acc[item.folder_id] = (acc[item.folder_id] || 0) + 1;
    return acc;
  }, {});

  const videoCounts = (videosRes.data || []).reduce((acc, item) => {
    acc[item.folder_id] = (acc[item.folder_id] || 0) + 1;
    return acc;
  }, {});

  const mapped = (folders || []).map((folder) => ({
    ...folder,
    photo_count: photoCounts[folder.id] || 0,
    video_count: videoCounts[folder.id] || 0
  }));

  return res.json(mapped);
});

router.get('/folders/:slug', async (req, res) => {
  const { slug } = req.params;
  const { data: folder, error: folderError } = await supabase
    .from('gallery_folders')
    .select('*, events(id, title, event_date, event_type)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (folderError || !folder) return res.status(404).json({ error: 'Folder not found' });

  const [photosRes, videosRes] = await Promise.all([
    supabase
      .from('gallery_photos')
      .select('*')
      .eq('folder_id', folder.id)
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('gallery_videos')
      .select('*')
      .eq('folder_id', folder.id)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
  ]);

  if (photosRes.error || videosRes.error) {
    return res.status(400).json({ error: photosRes.error?.message || videosRes.error?.message });
  }

  return res.json({
    folder,
    photos: photosRes.data || [],
    videos: videosRes.data || []
  });
});

router.get('/photos', async (req, res) => {
  const { folder_id: folderId } = req.query;
  let query = supabase
    .from('gallery_photos')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (folderId) query = query.eq('folder_id', folderId);

  const { data, error } = await query;
  if (error) return res.status(400).json({ error: error.message });
  return res.json(data || []);
});

router.get('/videos', async (req, res) => {
  const { folder_id: folderId } = req.query;

  let query = supabase
    .from('gallery_videos')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (folderId) query = query.eq('folder_id', folderId);

  const { data, error } = await query;
  if (error) return res.status(400).json({ error: error.message });
  return res.json(data || []);
});

router.get('/admin/folders', requireAuth, async (_req, res) => {
  const { data, error } = await supabase
    .from('gallery_folders')
    .select('*, events(id, title, event_date)')
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  return res.json(data || []);
});

router.post('/admin/folders', requireAuth, upload.single('cover_image'), async (req, res) => {
  try {
    const slug = await uniqueSlug(req.body.slug || req.body.name);
    const coverImage = req.file
      ? await uploadMedia(req.file, 'gallery-photos', `folder-covers/${slug}`)
      : req.body.cover_image_url || null;

    const payload = {
      name: req.body.name,
      slug,
      description: req.body.description || '',
      cover_image_url: coverImage,
      event_id: req.body.event_id || null,
      sort_order: Number(req.body.sort_order || 0),
      is_active: parseBoolean(req.body.is_active, true)
    };

    const { data, error } = await supabase.from('gallery_folders').insert(payload).select().single();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

router.put('/admin/folders/:id', requireAuth, upload.single('cover_image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { data: existing, error: existingError } = await supabase
      .from('gallery_folders')
      .select('*')
      .eq('id', id)
      .single();

    if (existingError || !existing) return res.status(404).json({ error: 'Folder not found' });

    const shouldRefreshSlug = req.body.slug || (req.body.name && req.body.name !== existing.name);
    const slug = shouldRefreshSlug ? await uniqueSlug(req.body.slug || req.body.name, id) : existing.slug;
    const coverImage = req.file
      ? await uploadMedia(req.file, 'gallery-photos', `folder-covers/${slug}`)
      : req.body.cover_image_url;

    const payload = {
      ...req.body,
      slug,
      event_id: req.body.event_id || null,
      sort_order: Number(req.body.sort_order ?? existing.sort_order),
      is_active: parseBoolean(req.body.is_active, existing.is_active)
    };

    if (coverImage) payload.cover_image_url = coverImage;

    const { data, error } = await supabase
      .from('gallery_folders')
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

router.delete('/admin/folders/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('gallery_folders').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  return res.json({ message: 'Deleted' });
});

router.get('/admin/photos', requireAuth, async (_req, res) => {
  const { data, error } = await supabase
    .from('gallery_photos')
    .select('*, gallery_folders(name, slug)')
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  return res.json(data || []);
});

router.get('/admin/videos', requireAuth, async (_req, res) => {
  const { data, error } = await supabase
    .from('gallery_videos')
    .select('*, gallery_folders(name, slug)')
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  return res.json(data || []);
});

router.post('/photos', requireAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image is required' });
    await ensureFolder(req.body.folder_id);
    const imageUrl = await uploadPhoto(req.file, req.body.folder_id);

    const payload = {
      title: req.body.title,
      caption: req.body.caption || '',
      category: req.body.category || 'General',
      sort_order: Number(req.body.sort_order || 0),
      image_url: imageUrl,
      folder_id: req.body.folder_id || null,
      is_active: parseBoolean(req.body.is_active, true)
    };

    const { data, error } = await supabase.from('gallery_photos').insert(payload).select().single();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

router.post('/photos/bulk', requireAuth, upload.array('images', 60), async (req, res) => {
  try {
    const files = req.files || [];
    if (!files.length) return res.status(400).json({ error: 'Images are required' });
    await ensureFolder(req.body.folder_id);

    const results = [];

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      try {
        // eslint-disable-next-line no-await-in-loop
        const imageUrl = await uploadPhoto(file, req.body.folder_id);
        const payload = {
          title: req.body.title_prefix ? `${req.body.title_prefix} ${index + 1}` : file.originalname,
          caption: req.body.caption || '',
          category: req.body.category || 'General',
          sort_order: Number(req.body.sort_order || 0) + index,
          folder_id: req.body.folder_id || null,
          image_url: imageUrl,
          is_active: parseBoolean(req.body.is_active, true)
        };

        // eslint-disable-next-line no-await-in-loop
        const { data, error } = await supabase.from('gallery_photos').insert(payload).select().single();
        if (error) throw new Error(error.message);
        results.push({ success: true, id: data.id, name: file.originalname, image_url: data.image_url });
      } catch (err) {
        results.push({ success: false, name: file.originalname, error: err.message });
      }
    }

    return res.status(201).json({
      total: files.length,
      succeeded: results.filter((item) => item.success).length,
      failed: results.filter((item) => !item.success).length,
      results
    });
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

router.post('/videos', requireAuth, upload.single('video'), async (req, res) => {
  try {
    await ensureFolder(req.body.folder_id);
    const hasYoutube = Boolean(req.body.youtube_url);
    const hasVideoFile = Boolean(req.file);

    if (!hasYoutube && !hasVideoFile) {
      return res.status(400).json({ error: 'Provide a YouTube URL or upload a video file' });
    }

    let videoUrl = req.body.video_url || null;
    let youtubeUrl = null;
    let thumbnail = req.body.thumbnail || '';
    let sourceType = 'youtube';

    if (hasVideoFile) {
      sourceType = 'file';
      videoUrl = await uploadVideo(req.file, req.body.folder_id);
    }

    if (hasYoutube && !hasVideoFile) {
      sourceType = 'youtube';
      youtubeUrl = extractYoutubeEmbed(req.body.youtube_url);
      thumbnail = thumbnail || youtubeThumb(req.body.youtube_url);
    }

    const payload = {
      title: req.body.title,
      description: req.body.description || '',
      category: req.body.category || 'General',
      sort_order: Number(req.body.sort_order || 0),
      folder_id: req.body.folder_id || null,
      source_type: sourceType,
      youtube_url: youtubeUrl,
      video_url: videoUrl,
      thumbnail,
      is_active: parseBoolean(req.body.is_active, true)
    };

    const { data, error } = await supabase.from('gallery_videos').insert(payload).select().single();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

router.post('/videos/bulk', requireAuth, upload.array('videos', 30), async (req, res) => {
  try {
    const files = req.files || [];
    if (!files.length) return res.status(400).json({ error: 'Videos are required' });
    await ensureFolder(req.body.folder_id);

    const results = [];

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      try {
        // eslint-disable-next-line no-await-in-loop
        const videoUrl = await uploadVideo(file, req.body.folder_id);
        const payload = {
          title: req.body.title_prefix ? `${req.body.title_prefix} ${index + 1}` : file.originalname,
          description: req.body.description || '',
          category: req.body.category || 'General',
          sort_order: Number(req.body.sort_order || 0) + index,
          folder_id: req.body.folder_id || null,
          source_type: 'file',
          video_url: videoUrl,
          youtube_url: null,
          thumbnail: req.body.thumbnail || '',
          is_active: parseBoolean(req.body.is_active, true)
        };

        // eslint-disable-next-line no-await-in-loop
        const { data, error } = await supabase.from('gallery_videos').insert(payload).select().single();
        if (error) throw new Error(error.message);
        results.push({ success: true, id: data.id, name: file.originalname, video_url: data.video_url });
      } catch (err) {
        results.push({ success: false, name: file.originalname, error: err.message });
      }
    }

    return res.status(201).json({
      total: files.length,
      succeeded: results.filter((item) => item.success).length,
      failed: results.filter((item) => !item.success).length,
      results
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
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
