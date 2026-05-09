'use client'

import { useEffect } from 'react'

export default function ScrollRevealObserver() {
  useEffect(() => {
    /* BUG-021 fix: Reset scroll to top on every page load. */
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    /* BUG-054 fix: Race condition between scrollTo + observeAll.
       Root causes:
       1. scrollTo fires BEFORE layout settles — elements not yet at final positions
       2. MutationObserver calling observeAll mid-DOM-update could re-observe elements
          that already fired (no-op since obs.observe is idempotent, but timing issue)
       3. Unobserving after reveal caused elements above fold (after scrollTo) to never
          re-fire because they were observed then immediately unobserved before IO callback

       Fixes applied:
       - rootMargin '200px 0px': fire 200px BEFORE element enters viewport
       - threshold 0: fires on first pixel intersection (including rootMargin zone)
       - 100ms delay after scrollTo so layout is settled before first observe pass
       - Do NOT unobserve after reveal — elements stay observed (tiny memory cost,
         but prevents the "observed then immediately removed" race on page load)
       - MutationObserver still watches for new .scroll-reveal elements (PortfolioGallery)
         but skips elements already marked in-view                                        */

    const IO_OPTIONS: IntersectionObserverInit = {
      threshold: 0,
      rootMargin: '200px 0px',
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            // Do NOT unobserve — keeping the element observed prevents the race
            // where scrollTo resets position and the element was already unobserved
            // before its IO callback fired. Memory cost is negligible for ~41 elements.
          }
        })
      },
      IO_OPTIONS
    )

    const observeAll = () => {
      document.querySelectorAll('.scroll-reveal, .scroll-reveal-left').forEach(el => {
        if (!el.classList.contains('in-view')) {
          obs.observe(el)
        }
      })
    }

    // BUG-054: Delay the first observe pass by 100ms so:
    // 1. window.scrollTo({ top:0 }) has settled
    // 2. React has finished its first paint / hydration
    // 3. Layout is stable — getBoundingClientRect positions are final
    const timer = setTimeout(observeAll, 100)

    /* MutationObserver catches new .scroll-reveal elements added after initial mount
       (PortfolioGallery tiles, client-side React renders). */
    const mutObs = new MutationObserver(() => {
      observeAll()
    })
    mutObs.observe(document.body, { childList: true, subtree: true })

    return () => {
      clearTimeout(timer)
      obs.disconnect()
      mutObs.disconnect()
    }
  }, [])

  return null
}
