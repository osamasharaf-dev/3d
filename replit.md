# 3D Portfolio Website

A personal portfolio for Osama Sharaf — a Full-Stack Developer. Features interactive 3D elements, GSAP/Framer Motion animations, a Supabase-powered CMS, and an EmailJS contact form.

## Tech Stack

- **React 18** + **Vite** (frontend)
- **Three.js** / **React Three Fiber** / **Drei** (3D graphics)
- **Framer Motion** + **GSAP** (animations)
- **Tailwind CSS** (styling)
- **Supabase** (CMS — projects, skills, achievements)
- **EmailJS** (contact form)
- **Express** (upload API, runs alongside Vite on port 3001)

## How to Run

```
npm run dev
```

- Vite dev server: `http://localhost:5000`
- Upload API (Express): `http://localhost:3001`

## Environment Variables (required)

All stored as Replit Secrets:

| Key | Description |
|-----|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL (no trailing slash) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `VITE_APP_EMAILJS_SERVICE_ID` | EmailJS service ID |
| `VITE_APP_EMAILJS_TEMPLATE_ID` | EmailJS template ID |
| `VITE_APP_EMAILJS_PUBLIC_KEY` | EmailJS public key |
| `SUPABASE_SERVICE_ROLE_KEY` | (Optional) Needed for file uploads via the Express server |

## Notes

- The screenshot tool captures the initial load before animations play — blank screenshots are expected behavior (Framer Motion opacity:0 start state).
- Supabase Realtime hooks use module-level singleton channels to avoid duplicate-subscribe errors.
- Admin panel is accessible via the app's admin route with Supabase auth.

## User Preferences

- Keep the existing project structure and stack — do not restructure or migrate.
