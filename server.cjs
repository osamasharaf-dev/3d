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
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY     = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!SERVICE_KEY) {
  console.error('[upload-api] ❌  SUPABASE_SERVICE_ROLE_KEY not set — uploads will fail');
}

// Service-role client for storage operations (bypasses RLS)
const sb = SERVICE_KEY
  ? createClient(SUPABASE_URL, SERVICE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
      realtime: { transport: ws },
    })
  : null;

// Anon client for verifying user JWTs (no realtime needed)
const sbAuth = ANON_KEY
  ? createClient(SUPABASE_URL, ANON_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
      realtime: { transport: ws },
    })
  : null;

const app    = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// Allowlists — restrict to known-safe values
const ALLOWED_BUCKETS = new Set(['assets']);
const ALLOWED_FOLDERS = new Set(['images', 'projects', 'certifications', 'about', 'avatars']);
const ALLOWED_MIMES   = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
]);

/* Restrict CORS to same Replit workspace or localhost dev origins only */
const DEV_DOMAIN = process.env.REPLIT_DEV_DOMAIN
  ? `https://${process.env.REPLIT_DEV_DOMAIN}`
  : null;

app.use((req, res, next) => {
  const origin = req.headers.origin || '';
  const allowed =
    origin === 'http://localhost:5000' ||
    origin === 'http://127.0.0.1:5000' ||
    (DEV_DOMAIN && origin === DEV_DOMAIN);

  if (allowed) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

/* Verify Supabase JWT — only authenticated (admin) users may upload */
async function requireAuth(req, res, next) {
  if (!sbAuth) {
    return res.status(503).json({ error: 'Auth service not configured' });
  }
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }
  const { data: { user }, error } = await sbAuth.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  req.user = user;
  next();
}

/* ── POST /api/upload ─────────────────────────────────────── */
app.post('/api/upload', requireAuth, upload.single('file'), async (req, res) => {
  if (!sb) {
    return res.status(500).json({ error: 'Upload service not configured (missing service key)' });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  // Validate MIME type server-side
  if (!ALLOWED_MIMES.has(req.file.mimetype)) {
    return res.status(400).json({ error: 'File type not allowed' });
  }

  // Enforce allowlists for bucket and folder
  const bucket = ALLOWED_BUCKETS.has(req.body.bucket) ? req.body.bucket : 'assets';
  const folder = ALLOWED_FOLDERS.has(req.body.folder) ? req.body.folder : 'images';

  const ext  = req.file.originalname.split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '');
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
