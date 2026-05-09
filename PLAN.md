# PLAN.md — Builder Cycle 6 — Content polish pass

**Date:** 2026-05-07  
**Scope:** Word-level copy edits only. Zero structural/CSS/JS changes.

## Files changing

1. `app/components/LiveEstimate.tsx`
   - Eyebrow: "Free estimate" → "See how an estimate comes together"
   - PLACEHOLDER_MESSAGE: replace vague generic filler with concrete prospect voice (~280 sq ft, low-VOC, trim details)
   - Commitment bullets (3): sharpen to real painter promises with time + scope specifics

2. `app/components/WhySoley.tsx`
   - Card 01 "Prep is the product" body: add concrete prep steps (two-coat primer on bare drywall, sand between coats)
   - Card 02 "One person, start to finish" body: confirm arrival window detail already present — minor tighten
   - Card 03 "Written quotes, line by line" body: already strong — confirm no filler
   - Card 04 "Low-VOC by default" body: tighten with concrete painter commitment, no fabricated brand names

3. `app/components/FounderBlock.tsx`
   - Body copy: extend "no handoffs" claim with one concrete operational detail (owner answers before 8pm)
   - Cut weak filler language if any
   - Honest signals row stays intact (4 cards, 3 bullets, honest placeholders)

## What does NOT change

- Zero JS, zero CSS, zero component structure
- Content count: 4 cards stay 4 cards, 3 bullets stay 3 bullets, 3 signals stay 3 signals
- All honest pre-launch placeholders stay
- Tilt JS, accordion logic, spotlight — untouched

## Success criterion

`npx next build` passes clean. Every body copy sentence is concrete enough it could not appear on a generic painter's site.

## Diff scope

~8-12 string edits across 3 files. Under 30 lines changed.
