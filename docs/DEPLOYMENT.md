# Deployment Guide

This guide outlines deployment options for Career Copilot across major cloud platforms.

---

## ☁️ Recommended Deployment Architecture

- **Backend**: Render / Railway / AWS App Runner / DigitalOcean App Platform (Node.js runtime)
- **Database**: Managed PostgreSQL (Supabase, Neon, AWS RDS, Render Postgres)
- **Frontend**: Vercel / Netlify / Cloudflare Pages (Static SPA)
- **File Storage**: AWS S3 / Cloudinary / Supabase Storage (for production PDF resumes)

---

## 🚀 1. Production Database (Neon / Supabase)
1. Provision a PostgreSQL cluster.
2. Obtain connection string URI:
   `postgresql://username:password@ep-host.region.aws.neon.tech/career_copilot?sslmode=require`
3. Set `DB_URL` or individual host, user, password, port, and database name in backend production environment variables.

---

## 🛠️ 2. Deploying Backend (e.g. Render / Railway)
1. Set Root Directory to `backend`.
2. Build Command: `npm install`
3. Start Command: `node server.js`
4. Set Environment Variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SSL=true`
   - `JWT_SECRET=<long-random-string>`
   - `CLIENT_URL=https://your-frontend-domain.vercel.app`

---

## 🌐 3. Deploying Frontend (Vercel / Netlify)
1. Set Root Directory to `frontend`.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Environment Variables:
   - `VITE_API_URL=https://your-backend-domain.onrender.com/api`
5. Configure SPA Rewrites for React Router (e.g., `vercel.json` or `_redirects` for Netlify: `/* /index.html 200`).
