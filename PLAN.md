# PLAN.md — Builder cycle: Pre-launch email capture + ServicesMarquee palette refresh

**Date:** 2026-05-07
**Scope:** Two targets. No cooldown sections touched.

## Target 1 — Pre-launch email-capture micro-section

**New file:** `app/components/NotifySignup.tsx`
- 'use client' form component
- Email input + submit button
- On submit: POST to `/api/notify`, show "Thanks — we'll be in touch" success state
- Honest copy: "First projects starting this season. Be the first to book when our calendar opens."
- No fake counts, no fake testimonials, no Formspree URL

**New file:** `app/api/notify/route.ts`
- POST handler, returns `{ ok: true }`. Stub for real backend.

**Edit:** `app/page.tsx`
- Import `NotifySignup`
- Slot between `<FAQ />` ... `<SectionDivider />` ... `<NotifySignup />` ... `<SectionDivider />` ... `<Process />`

## Target 2 — ServicesMarquee palette audit

**Edit:** `app/components/ServicesMarquee.tsx`
- Verify no teal residuals — current code already migrated (ochre/rust/linen) so this is a clean confirm
- Add `--color-stone` (#EAE0D4) as a fourth rotation slot so mid-tone warm gray adds contrast variety
- Verify background stays `var(--color-umber)` (correct)

## Files changed
1. `app/components/NotifySignup.tsx` — NEW
2. `app/api/notify/route.ts` — NEW
3. `app/page.tsx` — add import + slot
4. `app/components/ServicesMarquee.tsx` — palette polish

## Success criterion
`npx next build` passes clean. No teal, no fabricated URLs, no ghost numbers, no matchMedia bail-outs.

**Word count: ~170**
