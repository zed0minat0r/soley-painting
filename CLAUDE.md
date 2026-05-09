# CLAUDE.md — Soley Painting

Next.js 14 marketing site for Soley Painting, a residential / commercial painting company. Agent-loop-driven build.

## Working guidelines

- **Read MEMORY.md FIRST** at the start of every cycle. The Penn Tech feature catalog (`project_penn_tech_baseline.md`) is the floor for this project. Each Penn Tech feature should ship in a brand-specific painter form (cube → 3D paintbrush, IT-puzzles tagline → painter-equivalent, services scroll-lock with painting service categories, etc.).
- **Do NOT copy Penn Tech moves verbatim.** The catalog dictates the *kind* of feature, not the implementation. Adapt to the painting brand.
- **Ask questions** if instructions are unclear; better to clarify than assume.

## Tech stack

- Next.js 14 App Router (TypeScript)
- Tailwind CSS (terracotta + teal palette in tailwind.config.ts)
- Framer Motion for non-SSR-rendered animations
- React Three Fiber + three.js for the 3D hero centerpiece
- Lucide React for icons

## Page structure (target — agents build out)

```
Hero3D (3D paintbrush centerpiece + headline + CTAs + services marquee)
SectionDivider (paint-drop motif)
ServicesScrollLock (5 painting services in horizontally-locked panels)
Workflow (paint-flow visualization: prep → prime → paint → finish)
Process (auto-advancing horizontal timeline)
Contact (form + contact info)
```

## Brand voice

Honest, hands-on, professional. The painter equivalent of "we answer the phone." No fake testimonials, no fake star ratings, no invented project counts until real numbers exist.

## Commands

```bash
npm run dev    # http://localhost:3000
npm run build  # production build
npm run lint   # ESLint
```

## Deploy

Vercel (auto-deploys on push to main).
