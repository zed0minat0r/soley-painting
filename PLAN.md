# PLAN.md — Builder Cycle 9: FAQ scope-clarity extension

**Date:** 2026-05-07
**Scope:** Extend existing `app/components/FAQ.tsx` — add 3 scope-clarity Q&A items to the `ITEMS` array. No structural changes to the component.

## Files changing

| File | Change |
|---|---|
| `app/components/FAQ.tsx` | Append 3 items to `ITEMS` array only — no component restructure |
| `PLAN.md` | This file |
| `CHANGELOG-AGENT.md` | Append one line |

## What ships

3 honest scope-clarity questions buyers ask before booking a painter:

1. "Do you handle drywall repairs, or just paint?" — scope of surface prep; honest that major structural drywall is a separate trade
2. "Do you remove existing wallpaper?" — honest that it's in scope; complexity depends on layers and adhesive
3. "Do you match colors from an existing paint job?" — honest answer about color matching from chips and can labels

All three use the existing `accent` color cycle (terra / teal / gold continuing from item 6).
No fabricated partner names, no fabricated pricing, no fabricated square-footage minimums.
`aria-expanded` / `aria-controls` ARIA is inherited from the existing `FAQItem` component.

## Success criterion

`npx next build` passes clean. 9 total FAQ items render. Honest content only.

## Diff scope

~24 lines added to `ITEMS` array. Zero component restructure.
