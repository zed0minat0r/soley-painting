# PLAN.md — Builder Copywriting Pass (cycle 4)

**Date:** 2026-05-07 (Builder slot)
**Scope:** Word-level copy edits only. Zero structural/JS/CSS changes.

## Files touched (text only)

| File | What changes |
|---|---|
| `app/components/Hero3D.tsx` | Tagline "Watch the brush paint it out." → more concrete brand promise; body copy micro-tighten |
| `app/components/ServicesScrollLock.tsx` | Exterior bullet 3: "Interior guaranteed against peeling" → "Finish guaranteed against peeling" (wrong word "Interior" in an exterior panel) |
| `app/components/PaintFlow.tsx` | Sub-copy tighten in section header |
| `app/components/WhySoley.tsx` | Section headline tighten; card 4 VOC body copy punch up |
| `app/components/FounderBlock.tsx` | Body paragraph punch up; cut "We are building this the right way — slowly" (filler) |
| `app/components/PortfolioGallery.tsx` | Sub-line tighten (less corporate) |
| `app/components/Process.tsx` | Step 2 Color Consultation bullets punch up |
| `app/components/Contact.tsx` | Minor commitment bullet tighten |

## What does NOT change

- ServicesMarquee labels — already clean
- LiveEstimate typed message — honest, reads naturally
- Hero H1 "Every wall done right." — strong, keep
- Hero trust signals — already specific and honest
- WhySoley cards 1–3 — already strong
- Process steps 1/3/4/5 — already concrete
- Footer — already clean and honest
- ServicesScrollLock panels 1/3/4/5 — already strong

## Fabrication audit

No fake stats, fake names, fake dates, or fake reviews found in any file.
All pre-launch framing is honest. No changes needed on that front.

## Success criterion

`npx next build` passes clean. All copy changes are word-level. Brand voice
is cohesive: hands-on, concrete, honest — nothing could appear on a generic
competitor's site unchanged.

## Diff scope

~12 string swaps across 7 files. Total: under 30 lines changed.
