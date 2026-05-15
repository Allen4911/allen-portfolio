'use client'

import { useEffect, useState } from 'react'

interface Heading {
  id: string
  text: string
  level: number
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [active, setActive] = useState('')

  useEffect(() => {
    const els = document.querySelectorAll('article h2, article h3')
    const items: Heading[] = Array.from(els).map((el) => ({
      id: el.id,
      text: el.textContent ?? '',
      level: Number(el.tagName[1]),
    }))
    setHeadings(items)

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id)
        }
      },
      { rootMargin: '-20% 0% -60% 0%' },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  if (headings.length < 2) return null

  return (
    <nav aria-label="Table of contents" style={{ position: 'sticky', top: '80px' }}>
      <p
        style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
          margin: '0 0 12px',
        }}
      >
        On this page
      </p>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: h.level === 3 ? '12px' : '0' }}>
            <a
              href={`#${h.id}`}
              style={{
                display: 'block',
                padding: '4px 0',
                fontSize: '13px',
                color: active === h.id ? 'var(--color-primary, #0071e3)' : 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
                transition: 'color 0.15s',
                lineHeight: 1.5,
              }}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
