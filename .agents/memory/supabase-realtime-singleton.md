---
name: Supabase Realtime singleton hooks
description: Pattern required for React hooks that subscribe to Supabase Realtime channels — avoids "cannot add callbacks after subscribe()" crash when multiple components mount the same hook.
---

## The Rule
Any `useXxx()` data hook that creates a Supabase Realtime channel MUST use the module-level singleton pattern, not a per-instance channel.

**Why:** Supabase Realtime channels are keyed by name. If two components both call `useContactInfo()`, both `useEffect` calls try to `.on()` the same already-subscribed channel → throws unhandled error → crashes the component with "Invalid hook call" in the consuming component's tree.

This happened specifically when `Footer` was updated to use `useContactInfo` (already used by `Contact`).

## How to apply

Replace per-instance channel creation:
```js
// ❌ WRONG — creates duplicate channel when >1 component uses this hook
const channel = supabase.channel("contact_info_live").on(...).subscribe();
return () => supabase.removeChannel(channel);
```

With module-level singleton + subscriber Set:
```js
// ✅ CORRECT
let channelRef = null;
const subscribers = new Set();

useEffect(() => {
  subscribers.add(setData);

  if (!channelRef && isSupabaseConfigured) {
    channelRef = supabase.channel("contact_info_live")
      .on("postgres_changes", {...}, async () => {
        const fresh = await fetchFresh();
        if (fresh) { cache = fresh; subscribers.forEach(s => s(fresh)); }
      })
      .subscribe();
  }

  return () => {
    subscribers.delete(setData);
    if (subscribers.size === 0 && channelRef) {
      supabase.removeChannel(channelRef);
      channelRef = null;
    }
  };
}, []);
```

## Hooks fixed
- `useContactInfo.js` — `contact_info_live`
- `useAbout.js` — `about_info_live`
- `useHero.js` — `hero_info_live`
- `useCertifications.js` — `certifications_live`
- `useProfessionalSkills.js` — `professional_skills_live`
- `useProjects.js` — check if it also uses the pattern; apply if missing
