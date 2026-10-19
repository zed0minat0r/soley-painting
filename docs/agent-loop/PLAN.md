# PLAN.md — Builder Cycle 13: Dynamic OG Image

**Date:** 2026-05-07
**Scope:** Close the share-preview gap — site renders blank on iMessage/Twitter/LinkedIn

## Files to create

- `app/opengraph-image.tsx` — Next.js 14 ImageResponse, 1200x630, brand palette
- `app/twitter-image.tsx` — re-export of opengraph-image (same dimensions, Twitter accepts)

## Files to touch

- `CHANGELOG-AGENT.md` — append one entry
- `PLAN.md` — this file

## Layout plan (opengraph-image.tsx)

- Background: warm umber `#221810` (commanding, makes rust pop)
- Top eyebrow: "RESIDENTIAL & COMMERCIAL PAINTING" — DM Sans 600, rust `#BF5B38`, letter-spaced
- Wordmark: "Soley Painting" — Cormorant Garamond 700, linen `#F4EDE3`, 96px
- Tagline: "Every wall done right." — DM Sans 400, ochre `#B8884A`, 36px
- Sub-line: "Owner-operated. Written quote. Primer + two coats." — DM Sans 400, stone `#8C7B6B`, 24px
- Rust accent rule: 4px tall, rust color, 120px wide, centered between wordmark and tagline
- Paint-brush SVG silhouette: single path, rust fill, bottom-right corner
- No photography, no phone, no address, no reviews, no fabricated stats

## Implementation notes

- Use `ImageResponse` from `next/og`
- Font loading: fetch Cormorant Garamond 700 + DM Sans 600 from Google Fonts API
- Export: `export const runtime = 'edge'` for fast cold starts
- Size: `{ width: 1200, height: 630 }`

## Success criterion

- `npx next build` passes clean
- `/opengraph-image` route returns 200 + image/png
- Visual card: dark umber bg, rust eyebrow, large linen wordmark, ochre tagline, rust accent rule

## Diff scope

~90 lines new (opengraph-image.tsx) + ~10 lines new (twitter-image.tsx)
