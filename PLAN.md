# PLAN.md — Builder Cycle 7: FAQ Component

**Date:** 2026-05-07
**Scope:** New `app/components/FAQ.tsx` + slot into `app/page.tsx`

## Files changing

| File | Change |
|---|---|
| `app/components/FAQ.tsx` | NEW — 6-item accordion FAQ |
| `app/page.tsx` | Add `<FAQ />` import + slot between `<PortfolioGallery />` and `<Process />` |

## What ships

- 6 honest questions a real prospect asks before booking a painter
- Accordion pattern mirrored from WhySoley: `aria-expanded`, `aria-controls`, chevron rotation, `max-height` CSS transition
- Section heading in Cormorant Garamond, `7rem 0` padding, brand palette tokens only
- `prefers-reduced-motion` honored — expand snaps instead of animating
- Scroll-reveal via `.scroll-reveal` class (existing ScrollRevealObserver picks it up)
- NO matchMedia bail-outs, NO ghost numbers, NO fabricated specifics

## 6 questions

1. How does prep work factor into the timeline?
2. Will you protect my floors and furniture?
3. How do you handle pets and kids during the job?
4. What guarantee do you offer on the work?
5. How does the estimate process work?
6. What paint brands do you use?

## Success criterion

`npx next build` passes clean. Component renders accordion open/close with correct ARIA.

## Diff scope

~180 lines new (FAQ.tsx) + 3 lines changed (page.tsx import + JSX slot).
