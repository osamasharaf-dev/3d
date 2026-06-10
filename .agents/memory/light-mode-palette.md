---
name: Light mode palette
description: The exact color palette and design tokens used in the 3dfolio light-mode redesign.
---

## The Rule
All components use the sky/indigo/cyan light palette. Never re-introduce dark backgrounds (`#050816`, `#111522`, `#0a0c14`, etc.) to portfolio sections.

## Why
The client (Osama Sharaf) requested a premium light-mode UI with Sky Blue (#0ea5e9), Indigo Blue (#4f46e5), Soft Cyan (#06b6d4) palette.

## Core Tokens
| Token | Value | Usage |
|-------|-------|-------|
| Page background | `#f8faff` | App.jsx outer div |
| Hero gradient | `linear-gradient(135deg, #f0f7ff, #eef0ff, #f5f0ff)` | Hero wrapper div |
| Primary (sky blue) | `#0ea5e9` | Buttons, links, highlights |
| Secondary (indigo) | `#4f46e5` | Secondary buttons, gradients |
| Accent (cyan) | `#06b6d4` | Tertiary accents |
| Text dark | `#0f172a` | Headings (slate-900) |
| Text body | `#475569` | Body text (slate-600) |
| Text secondary | `#64748b` | Secondary text (slate-500) |
| Card bg | `#ffffff` | All cards |
| Card border | `rgba(14,165,233,0.12)` | Default card border |
| Card border hover | `rgba(14,165,233,0.28)` | Hover state |
| Card shadow | `0 4px 24px rgba(14,165,233,0.07)` | Default |
| Card shadow hover | `0 12px 40px rgba(14,165,233,0.15)` | Hover |

## Tailwind Config (`tailwind.config.cjs`)
- `primary`: `#0ea5e9`
- `secondary`: `#64748b` (slate — used for body text)
- `tertiary`: `#f1f5fb`

## SectionSubText color
`styles.sectionSubText` uses `text-sky-500` (Tailwind built-in `#0ea5e9`)

## Navbar
Light glass: `rgba(255,255,255,0.92)` with `border: rgba(14,165,233,0.18)`, dark text (`#0f172a`).

## Feedbacks section
Uses sky-to-indigo gradient header: `linear-gradient(135deg, #0ea5e9, #4f46e5)` with white text on the header, white cards below.
