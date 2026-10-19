# Soley's Painting & Home Improvements

Single-file static site: `index.html` (+ `img/`). No build step. The Next.js / three.js version is tag `v1-nextjs`;
its agent-loop docs are in `docs/agent-loop/`.

- Real facts: owner Sean Soley, (484) 948-5573, South Eastern PA, 15+ years, fully insured, locally owned.
  No email address known, so the form composes an SMS to Sean (sms: link) rather than posting anywhere.
- Every service, color swatch and ticker word lives in the `DATA` object at the foot of index.html.
- Color tool: `img/room.jpg` + `img/room-mask.png` (white RGBA, alpha = wall). The wall layer is a
  multiply-blended color div masked by the PNG. CSS masks need CORS, so it shows NOTHING over file:// -
  test over http (`python3 -m http.server`).
- `?nosplash=1` skips the splash.
- Deploys: GitHub Pages (https://zed0minat0r.github.io/soley-painting/) and Vercel (soley-painting.vercel.app,
  static via vercel.json). Text links with `?v=<short sha>`.
- Image URLs carry `?h=<sha1[:8]>` of their bytes; re-stamp after replacing an image.
