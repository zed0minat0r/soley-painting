'use client'

import { useEffect } from 'react'

export default function ScrollRevealObserver() {
  useEffect(() => {
    /* BUG-021 fix: Reset scroll to top on every page load.
       Prevents browser scrollRestoration from landing mid-page,
       and prevents any hash-anchor from pushing the hero H1 above fold. */
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    // Force scroll to top — removes any residual position from back/forward nav
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    /* BUG-028 fix: threshold was 0.15 — required 15% of element in view.
       On tall mobile pages (17,349px on SE) many elements never hit 15%.
       Drop threshold to 0 (fires as soon as 1px enters viewport) and use
       rootMargin '100px 0px' to pre-trigger 100px before element reaches fold.
       This ensures scroll-reveal fires even at fast scroll speeds. */
    const IO_OPTIONS: IntersectionObserverInit = {
      threshold: 0,
      rootMargin: '100px 0px',
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            // Unobserve after reveal — no need to keep watching
            obs.unobserve(entry.target)
          }
        })
      },
      IO_OPTIONS
    )

    // Observe all existing scroll-reveal elements
    const observeAll = () => {
      document.querySelectorAll('.scroll-reveal, .scroll-reveal-left').forEach(el => {
        if (!el.classList.contains('in-view')) {
          obs.observe(el)
        }
      })
    }

    observeAll()

    /* BUG-028 fix continued: PortfolioGallery tiles are added to the DOM
       after initial mount (client-side React render). Use MutationObserver
       to catch new .scroll-reveal elements and start observing them. */
    const mutObs = new MutationObserver(() => {
      observeAll()
    })
    mutObs.observe(document.body, { childList: true, subtree: true })

    return () => {
      obs.disconnect()
      mutObs.disconnect()
    }
  }, [])

  return null
}
