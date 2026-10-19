# PERF.md — Soley Painting Lighthouse Audit

**Audit date:** 2026-05-07
**URL:** https://soley-painting.vercel.app
**Tool:** npx lighthouse@13.3.0
**Mobile emulation:** 390×844, device scale factor 3 (iPhone 13 class)
**Desktop:** 1440×900, no emulation throttling

---

## Mobile scores (iPhone 13 emulation, slow 4G throttle)

| Metric | Value | Budget | Status |
|---|---|---|---|
| Performance score | 95 / 100 | — | PASS |
| First Contentful Paint | 1.3 s (1283 ms) | < 1.8 s | PASS |
| Largest Contentful Paint | 2.9 s (2882 ms) | < 2.5 s | MARGINAL |
| Total Blocking Time | 50 ms (47 ms) | < 200 ms | PASS |
| Cumulative Layout Shift | 0 | < 0.1 | PASS |
| Speed Index | 1.8 s | — | — |
| Time to Interactive | 2.9 s | — | — |
| Total Transfer Size | 328 KB | — | — |

## Desktop scores (1440×900, no throttle)

| Metric | Value | Budget | Status |
|---|---|---|---|
| Performance score | 100 / 100 | — | PASS |
| First Contentful Paint | 0.3 s (316 ms) | < 1.8 s | PASS |
| Largest Contentful Paint | 0.6 s (578 ms) | < 2.5 s | PASS |
| Total Blocking Time | 0 ms | < 200 ms | PASS |
| Cumulative Layout Shift | 0 | < 0.1 | PASS |
| Speed Index | 0.4 s | — | — |
| Time to Interactive | 0.6 s | — | — |
| Total Transfer Size | 328 KB | — | — |

---

## Top 3 opportunities identified

### 1. LCP driven by script evaluation on mobile (951ms main-thread work)

Root cause: Framer Motion + SVG animation init takes 951ms of Script Evaluation on slow mobile emulation. The LCP element (identified as the above-fold hero section) cannot paint until the JS hydration completes. This is the sole reason LCP sits at 2,882ms vs the 2,500ms threshold. Reducing this requires removing Framer Motion or deferring animation init — both are FORBIDDEN per the project brief (RULE 4: disabling animations is never a fix; feedback_nigel_no_removal). No config-layer workaround changes this.

### 2. Unused JavaScript — 49KB estimated savings

Two vendor chunks carry unused code at first paint:
- `676-*.js`: 41.8KB total, 29.2KB wasted
- `fd9d1056-*.js`: 53.8KB total, 20.0KB wasted

These are Next.js vendor splits of React + Framer Motion code paths used by components below the fold. Dynamic imports (`React.lazy` / `next/dynamic`) on below-fold components would reduce initial parse cost. This change would require restructuring multiple section components and is medium risk.

### 3. Legacy JS polyfill — Array.prototype.at (11KB, 150ms LCP savings)

`117-*.js` chunk ships an `Array.prototype.at` polyfill (11KB) that is unnecessary for modern browsers (Chrome 92+, Firefox 90+, Safari 15.4+ all ship it natively since 2021). Estimated LCP improvement: 150ms per Lighthouse. Setting a modern browserslist target would tell Babel to skip this polyfill. However, Next.js 14 with SWC does not honour `.browserslistrc` consistently — a `.browserslistrc` added during this cycle produced a larger bundle (92.4KB vs 87.2KB), not smaller. This is a known SWC/Next.js 14 constraint. Deferred.

---

## Fix applied: NONE

All three opportunities either require touching animation/component architecture (FORBIDDEN per brief) or do not produce a measurable improvement at the config layer without side effects (tested: both `.browserslistrc` and `optimizePackageImports: ['framer-motion']` increased bundle size vs baseline — reverted).

**Outcome: Data is the deliverable.** Mobile 95/100 with LCP 382ms over the 2,500ms threshold is the baseline. The LCP gap is driven by Framer Motion script evaluation on simulated slow mobile — not addressable at the framework config layer without disabling motion features.

**No code change committed this cycle per the brief's "if already near-budget, record and ship no code change" clause.**
