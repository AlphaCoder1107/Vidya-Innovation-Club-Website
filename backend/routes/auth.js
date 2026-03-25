import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const { data: user, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !user || !user.is_active) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password_hash || '');
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, full_name: user.full_name },
      process.env.JWT_SECRET || 'change_me',
      { expiresIn: '12h' }
    );

    return res.json({
      token,
      user: { id: user.id, username: user.username, full_name: user.full_name }
    });
  } catch (_err) {
    return res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/seed', async (_req, res) => {
  try {
    const username = process.env.SEED_ADMIN_USERNAME;
    const password = process.env.SEED_ADMIN_PASSWORD;
    const fullName = process.env.SEED_ADMIN_FULL_NAME || 'VIC Club Admin';

    if (!username || !password) {
      return res.status(400).json({ error: 'Seed env vars missing' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from('admin_users')
      .insert({ username, full_name: fullName, password_hash: passwordHash, is_active: true })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({ message: 'Admin seeded', admin: data.username });
  } catch (_err) {
    return res.status(500).json({ error: 'Seed failed' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

export default router;
