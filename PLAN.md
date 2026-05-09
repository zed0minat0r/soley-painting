# PLAN.md — Builder Cycle 1

**Date:** 2026-05-07
**Agent:** Builder

## What changes

### Files created
- `app/components/Navbar.tsx` — sticky nav, logo left, links right
- `app/components/Hero3D.tsx` — R3F canvas with 3D paintbrush (cylinder handle + ferrule + MeshLine bristles). Constant Y-axis rotation 0.004 rad/frame. Environment preset="studio". 3-layer text glow headline. Split layout: text left, canvas right.
- `app/components/SectionDivider.tsx` — SVG hairline + 3 teardrop paint-drop motifs + 2 traveling circle pulses. IntersectionObserver-gated.
- `app/components/ServicesScrollLock.tsx` — 5 panels (INTERIOR / EXTERIOR / COMMERCIAL / CABINET & TRIM / SPECIALTY). Motion.dev useScroll + useTransform for horizontal travel. 500vh container. Mood-lerp background CSS var on scroll progress. No matchMedia bail-outs.
- `app/components/Process.tsx` — 5-step auto-advancing timeline (Free Walkthrough / Color Consultation / Surface Prep / Application / Final Walkthrough & Touch-Up). 10s per step, char-stagger title, countdown bar.
- `app/components/Contact.tsx` — form (name / email / phone / message). Pre-launch honest framing. No fake address/phone.
- `app/components/Footer.tsx` — 4-column. "Social channels coming soon" in bottom bar.

### Files modified
- `app/page.tsx` — assemble all sections in order
- `app/layout.tsx` — swap Inter for Cormorant Garamond + DM Sans. Update metadata.
- `app/globals.css` — add `.glow-hero`, `.glow-sub` utilities. Palette CSS custom properties. Teardrop keyframe animations.
- `tailwind.config.ts` — add chalk/umber/gold color tokens matching Scout's revised 5-color system.

## Expected diff scope
~8 files, ~900 lines total across components + config updates.

## Success criterion
`npx next build` completes with zero errors. All 7 sections render. R3F canvas displays. Services scroll-lock translates horizontally on vertical scroll. Process timeline auto-advances.

## Constraints honored
- No fabricated content (pre-launch honest framing only)
- No matchMedia bail-outs (RULE 4)
- No bloom postprocessing (confirmed Scout)
- No ghost numbers (RULE 8)
- Author email: mmodica3@gmail.com
- RULE 1: no iMessage to user
