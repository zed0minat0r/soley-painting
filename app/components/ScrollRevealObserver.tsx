'use client'

import { useEffect } from 'react'

export default function ScrollRevealObserver() {
  useEffect(() => {
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
