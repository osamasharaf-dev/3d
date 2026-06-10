---
name: Skills admin panel
description: How the Technical Skills CRUD panel works in AdminDashboard.
---

## The Rule
SkillsPanel is registered as nav item `{id:"skills", label:"Technical Skills", icon:"⚙️"}` in the NAV array of AdminDashboard.jsx. It handles full CRUD for the `skills` Supabase table.

## Why
The skills section on the portfolio reads from the `skills` table. The admin needs to be able to add/edit/delete skills without touching code.

## Skills Table Schema
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Auto-generated |
| category | text | e.g. "Frontend", "Backend", "Database", "Cloud & DevOps", "Tools", "AI & Modern" |
| name | text | Skill name, e.g. "React.js" |
| icon | text | Emoji, e.g. "⚛️" |
| order_index | int | Display order within category |

## How SkillsPanel Works
1. Loads all skills on mount
2. Shows skills grouped by category
3. New skills get a `new_${Date.now()}` temporary ID
4. Deletions are tracked with `_deleted: true` flag (not sent to DB until Save)
5. On save: deletes `_deleted` items, upserts existing items with real IDs, inserts new items
6. Realtime subscription in `useSkills.js` pushes changes to `SkillKeyboard.jsx` instantly

## SkillKeyboard fallback
If `skills` table is empty or Supabase is not configured, `SkillKeyboard` shows `FALLBACK_GROUPS` (hardcoded 6 categories).
