import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.js';
import tickerRoutes from './routes/ticker.js';
import announcementsRoutes from './routes/announcements.js';
import eventsRoutes from './routes/events.js';
import galleryRoutes from './routes/gallery.js';
import blogRoutes from './routes/blog.js';
import teamRoutes from './routes/team.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: process.env.FRONTEND_URL?.split(',') || '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300
});
app.use('/api', limiter);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'vic-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/ticker', tickerRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/team', teamRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`VIC backend listening on port ${port}`);
});
