# Vidya Innovation Club Website

Production-ready VIC Club platform with a public website and protected admin CMS.

## 1. Prerequisites

- Node.js 18+
- npm
- Supabase account
- Railway account

## 2. Supabase Setup

1. Open Supabase SQL Editor.
2. Run supabase/schema.sql.
3. Create public storage buckets:
   - gallery-photos
   - blog-covers
   - event-covers
   - team-photos

## 3. Backend Deploy to Railway

1. Deploy the backend folder as a Railway service.
2. Set all environment variables listed in backend/.env.example.
3. Ensure the service exposes the port from the PORT environment variable.

## 4. Seed First Admin

Run once:

POST https://your-api.railway.app/api/auth/seed

After seeding successfully, remove SEED_ADMIN_* environment variables.

## 5. Frontend Deploy

Deploy frontend to GitHub Pages, Vercel, or Netlify.
Set:

VITE_API_URL=https://your-railway-api.up.railway.app/api

## 6. Staff Daily Workflow

1. Go to /admin/login.
2. Update announcements, events, gallery, blog, and team content.
3. Publish changes.
4. Content appears live instantly on the public site.

## Local Development

### Backend

1. cd backend
2. npm install
3. cp .env.example .env
4. npm run dev

### Frontend

1. cd frontend
2. npm install
3. create .env and optionally set VITE_API_URL
4. npm run dev

Vite dev proxy forwards /api to http://localhost:4000 by default.
