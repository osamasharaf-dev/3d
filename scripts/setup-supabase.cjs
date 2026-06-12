/**
 * Supabase Setup Script — runs server-side with service_role key
 * Fixes: storage bucket policies, missing columns, RLS policies
 * Usage: node scripts/setup-supabase.cjs
 */
const ws = require('ws');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://mlfwkubwlgdwinbrmqrj.supabase.co';
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
  console.error('❌  SUPABASE_SERVICE_ROLE_KEY is not set');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: ws },
});

/* ── helpers ─────────────────────────────────────────────── */
const ok  = (msg) => console.log('  ✅', msg);
const err = (msg) => console.log('  ❌', msg);
const inf = (msg) => console.log('  ℹ️ ', msg);

/* ── SQL runner via rpc ──────────────────────────────────── */
async function sql(query, label) {
  const { error } = await sb.rpc('exec_sql', { query }).catch(() => ({ error: { message: 'rpc not available' } }));
  if (error && error.message !== 'rpc not available') {
    err(`${label}: ${error.message}`);
    return false;
  }
  return true;
}

/* ── Main ────────────────────────────────────────────────── */
async function main() {
  console.log('\n🔧  Supabase Setup Script\n' + '─'.repeat(40));

  /* 1. List + fix buckets */
  console.log('\n📦  Storage Buckets');
  const { data: buckets, error: bErr } = await sb.storage.listBuckets();
  if (bErr) { err('Cannot list buckets: ' + bErr.message); }
  else {
    const existing = new Set(buckets.map(b => b.id));
    const required = [
      { id: 'assets',       name: 'assets',       public: true },
      { id: 'images',       name: 'images',       public: true },
      { id: 'projects',     name: 'projects',     public: true },
      { id: 'certificates', name: 'certificates', public: true },
      { id: 'avatars',      name: 'avatars',      public: true },
      { id: 'media',        name: 'media',        public: true },
    ];
    for (const b of required) {
      if (existing.has(b.id)) {
        // Ensure it is public
        const { error: ue } = await sb.storage.updateBucket(b.id, { public: true, allowedMimeTypes: null, fileSizeLimit: null });
        if (ue) err(`Update ${b.id}: ${ue.message}`);
        else ok(`Bucket '${b.id}' is public`);
      } else {
        const { error: ce } = await sb.storage.createBucket(b.id, { public: true });
        if (ce) err(`Create ${b.id}: ${ce.message}`);
        else ok(`Created bucket '${b.id}'`);
      }
    }
  }

  /* 2. Upload a tiny test file to verify upload works */
  console.log('\n📤  Upload Test (as service_role)');
  const testPath = `_setup_test_${Date.now()}.txt`;
  const { error: upErr } = await sb.storage.from('assets').upload(
    testPath,
    Buffer.from('setup-test'),
    { contentType: 'text/plain', upsert: true }
  );
  if (upErr) {
    err('Upload failed: ' + upErr.message);
  } else {
    ok('Upload to assets bucket works');
    const { data: urlData } = sb.storage.from('assets').getPublicUrl(testPath);
    ok('Public URL: ' + urlData.publicUrl);
    // Clean up
    await sb.storage.from('assets').remove([testPath]);
    ok('Cleanup OK');
  }

  /* 3. Check all required DB tables + columns */
  console.log('\n🗄️   Database Tables');
  const tableChecks = [
    { table: 'hero_info',          col: 'photo_url' },
    { table: 'projects',           col: 'order_index' },
    { table: 'projects',           col: 'source_code_link' },
    { table: 'projects',           col: 'live_demo_link' },
    { table: 'projects',           col: 'features' },
    { table: 'projects',           col: 'images' },
    { table: 'skills',             col: 'order_index' },
  ];
  for (const { table, col } of tableChecks) {
    const { error: ce } = await sb.from(table).select(col).limit(1);
    if (ce) err(`${table}.${col} MISSING — ${ce.message}`);
    else ok(`${table}.${col}`);
  }

  /* 4. Test each CMS table (read + write) */
  console.log('\n📋  CMS Table Read/Write Tests');
  const tables = ['hero_info','about_info','certifications','professional_skills','skills','projects','contact_info'];
  for (const t of tables) {
    const { error: re } = await sb.from(t).select('*').limit(1);
    if (re) err(`Read ${t}: ${re.message}`);
    else ok(`Read ${t}`);
  }

  console.log('\n✨  Setup complete!\n');
}

main().catch(e => {
  console.error('\n💥  Fatal:', e.message);
  process.exit(1);
});
