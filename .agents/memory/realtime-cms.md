---
name: Realtime CMS sync pattern
description: How to make Supabase DB changes instantly reflect in mounted React components without page refresh.
---

## The Rule
Every data hook must subscribe to Supabase Realtime in addition to doing the initial fetch. Calling `invalidateCache()` alone does NOT update already-mounted components — it only clears the module-level cache, but the component still holds stale React state.

## Why
Admin saves a record → Supabase fires a `postgres_changes` event → subscription handler re-fetches fresh data → calls `setData(fresh)` on the already-mounted component → user sees the change instantly without any page reload.

## How to Apply
Pattern used in all hooks (`useHero`, `useAbout`, `useProjects`, `useSkills`, `useProfessionalSkills`, `useContactInfo`, `useCertifications`):

```js
useEffect(() => {
  // 1. Initial load (with module-level cache for perf)
  if (cache) { setData(cache); setLoading(false); }
  else { /* fetch + set cache + setData */ }

  if (!isSupabaseConfigured) return;

  // 2. Realtime subscription
  const channel = supabase
    .channel("table_name_live")
    .on("postgres_changes", { event: "*", schema: "public", table: "table_name" }, async () => {
      const fresh = await fetchFresh().catch(() => null);
      if (fresh) { cache = fresh; fetchPromise = null; setData(fresh); }
    })
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}, []);
```

Channel names: `hero_info_live`, `about_info_live`, `projects_live`, `skills_live`, `professional_skills_live`, `contact_info_live`, `certifications_live`.
