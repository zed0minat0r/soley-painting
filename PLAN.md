# PLAN.md — Builder cycle 13: Lighthouse perf audit + ONE targeted fix

**Date:** 2026-05-07
**Scope:** Measure-only cycle with at most one targeted perf fix at framework/asset-loading layer.

## Objectives

1. Run Lighthouse CLI against https://soley-painting.vercel.app (mobile iPhone 13 emulation + desktop 1440).
2. Capture FCP, LCP, CLS, TBT, Speed Index, Total Bundle Size.
3. Identify top 3 low-hanging opportunities.
4. Apply AT MOST ONE fix that is low-risk + high-value at the framework/config layer (next.config / layout / fonts / metadata). NOT section structural changes.
5. Write PERF.md with real measured numbers only.

## Allowable fix candidates (ranked by value/risk)

1. Font preload hints — if next/font is not adding `preconnect`/`preload` for Google Fonts, add them manually in layout.tsx `<head>`.
2. Viewport meta — confirm `viewport` is set correctly for mobile (already likely via Next.js defaults).
3. `priority` prop on above-fold images — if hero image(s) lack `priority`, LCP suffers.
4. next.config image format optimization — check if `webp`/`avif` output is enabled.

## Files that MAY change (framework layer only)

- `app/layout.tsx` — font preload / metadata
- `next.config.mjs` — image optimization settings
- `PERF.md` — NEW, real numbers only

## Files FORBIDDEN from change this cycle

All section components: Hero3D, ScrollRevealObserver, ServicesScrollLock, Contact, LiveEstimate,
FounderBlock, WhySoley, FAQ, PaintFlow, Process, PortfolioGallery, Footer, Navbar, SectionDivider,
ServicesMarquee, NotifySignup.

## Success criterion

Real Lighthouse scores recorded in PERF.md. If LCP < 2.5s + CLS < 0.1 + TBT < 200ms on both
viewports → no code change needed, data is the deliverable. Otherwise ship ONE fix, build passes
`npx next build` clean.

**Word count: ~190**
