'use client'

import { useState, useEffect, useRef } from 'react'

export default function LikeButton({ slug, initialLikes }) {
  const [likes, setLikes] = useState(initialLikes)
  const [liked, setLiked] = useState(false)
  const [bounce, setBounce] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (localStorage.getItem(`book-liked-${slug}`) === 'true') {
      setLiked(true)
      const stored = localStorage.getItem(`book-likes-${slug}`)
      if (stored !== null) setLikes(Number(stored))
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [slug])

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (liked) return
    const newLikes = likes + 1
    setLikes(newLikes)
    setLiked(true)
    localStorage.setItem(`book-liked-${slug}`, 'true')
    localStorage.setItem(`book-likes-${slug}`, String(newLikes))
    setBounce(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setBounce(false), 400)
  }

  return (
    <button
      onClick={handleClick}
      aria-label="추천"
      style={{
        background: 'none',
        border: 'none',
        cursor: liked ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '0.82rem',
        color: liked ? '#e05c5c' : 'var(--color-ink-muted-48)',
        padding: 0,
        transform: bounce ? 'scale(1.35)' : 'scale(1)',
        transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      <span>{liked ? '❤️' : '🤍'}</span>
      <span data-testid="like-count">{likes}</span>
    </button>
  )
}
