# PLAN.md — Cycle 10 Builder: SEO Foundation Layer

**Date:** 2026-05-07
**Target:** Zero fabrication. Mirror only what is actually on the page.

## Files to change

1. `app/layout.tsx` — Replace thin metadata export with expanded version:
   - `metadataBase`, `alternates.canonical`, `keywords`, `authors`, `creator`
   - Full `openGraph` block (title, description, type, locale) — no og:image
   - `twitter` card block (summary_large_image, title, description)
   - Add JSON-LD `<script>` tag via `dangerouslySetInnerHTML` inline in RootLayout
   - JSON-LD payload: LocalBusiness + Service (5 panels) + FAQPage (9 items)

2. `app/robots.ts` — NEW. Next.js App Router robots config.
   - Allow all crawlers, point to sitemap URL.

3. `app/sitemap.ts` — NEW. Next.js App Router sitemap config.
   - Single homepage entry with lastModified + priority + changefreq.

## Data sources (no fabrication)

- Business name: "Soley Painting" (from live site)
- Description: from existing `metadata.description` in layout.tsx
- Services: 5 panels verbatim from `ServicesScrollLock.tsx` PANELS array
- FAQ: 9 items verbatim from `FAQ.tsx` ITEMS array
- NO address, NO phone, NO hours, NO priceRange, NO aggregateRating

## Success criterion

`npx next build` passes clean. Three JSON-LD script tags in HTML output.
No TypeScript errors. No fabricated business data.

## Scope limit

Touch ONLY `app/layout.tsx`, create `app/robots.ts`, create `app/sitemap.ts`.
Zero changes to any existing component.

**Word count: ~160**
