'use client'

import { useState, useEffect } from 'react'

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggle() {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        background: 'none',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '4px',
        color: 'rgba(255,255,255,0.72)',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.5px',
        padding: '3px 7px',
        cursor: 'pointer',
        lineHeight: 1,
      }}
      className="dark-mode-toggle"
    >
      {isDark ? '☀︎' : '☽'}
    </button>
  )
}
