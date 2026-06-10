---
name: Framer Motion + Replit screenshot tool
description: Why Replit's screenshot tool shows blank pages for apps using Framer Motion.
---

## The Rule
Blank screenshots from the Replit screenshot tool are expected and do NOT indicate a bug when the app uses Framer Motion with `initial={{ opacity: 0 }}` animations.

## Why
The screenshot tool captures the DOM immediately after page load — before Framer Motion has time to run `animate` transitions. Elements with `initial={{ opacity: 0 }}` appear invisible in the screenshot even though they work perfectly in a real browser.

## How to Verify the App Is Actually Working
1. Check workflow logs — no compilation errors = app is running
2. Check browser console logs — no JS errors = React rendered successfully
3. The page background color being correct (e.g. `#f8faff`) confirms the outer React tree mounted
4. WebGL "context could not be created" errors are EXPECTED in Replit's sandboxed preview and do not affect non-3D content
