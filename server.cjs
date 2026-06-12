/**
 * Portfolio CMS — Upload API Server
 * Runs alongside Vite dev server on port 3001
 * Handles file uploads using service_role key (bypasses Supabase RLS)
 */
const express  = require('express');
const multer   = require('multer');
const ws       = require('ws');
const { createClient } = require('@supabase/supabase-js');

const PORT = 3001;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://mlfwkubwlgdwinbrmqrj.supabase.co';
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
  console.error('[upload-api] ❌  SUPABASE_SERVICE_ROLE_KEY not set — uploads will fail');
}

const sb = SERVICE_KEY
  ? createClient(SUPABASE_URL, SERVICE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
      realtime: { transport: ws },
    })
  : null;

const app    = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

/* Allow requests from Vite dev server */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin',  '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

/* ── POST /api/upload ─────────────────────────────────────── */
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!sb) {
    return res.status(500).json({ error: 'Upload service not configured (missing service key)' });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  const { folder = 'images', bucket = 'assets' } = req.body;
  const ext  = req.file.originalname.split('.').pop().toLowerCase();
  const path = `${folder}/${Date.now()}.${ext}`;

  const { error } = await sb.storage
    .from(bucket)
    .upload(path, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: true,
    });

  if (error) {
    console.error('[upload-api] Upload error:', error.message);
    return res.status(500).json({ error: error.message });
  }

  const { data: { publicUrl } } = sb.storage.from(bucket).getPublicUrl(path);
  console.log('[upload-api] ✅ Uploaded:', publicUrl);
  res.json({ url: publicUrl });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[upload-api] ✅  Running on http://localhost:${PORT}`);
});
