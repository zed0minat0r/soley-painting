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

    const els = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left')
    if (!els.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
          }
        })
      },
      { threshold: 0.15 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return null
}
