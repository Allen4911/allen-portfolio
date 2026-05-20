'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { BlogPost } from '@/data/blogPosts'

interface BlogClientPageProps {
  posts: BlogPost[]
  categories: string[]
}

export default function BlogClientPage({ posts, categories }: BlogClientPageProps) {
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All') return posts
    return posts.filter((p) => p.category === activeCategory)
  }, [posts, activeCategory])

  return (
    <>
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '32px',
        }}
        role="group"
        aria-label="Filter by category"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            aria-pressed={activeCategory === cat}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: activeCategory === cat ? '2px solid #0071e3' : '1px solid #e0e0e0',
              backgroundColor: activeCategory === cat ? '#f0f7ff' : '#ffffff',
              color: activeCategory === cat ? '#0066cc' : '#1d1d1f',
              fontSize: '13px',
              fontWeight: activeCategory === cat ? 600 : 400,
              letterSpacing: '-0.08px',
              cursor: 'pointer',
              outline: 'none',
              transition: 'border 0.15s ease, background 0.15s ease',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <ul
        className="flex flex-col gap-6"
        data-testid="blog-post-list"
        aria-live="polite"
        aria-label="Blog posts"
      >
        {filteredPosts.map((post) => (
          <li key={post.id} data-testid={`post-card-${post.id}`}>
            <Link
              href={`/blog/${post.slug}`}
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <article
                style={{
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0',
                  backgroundColor: '#ffffff',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                className="blog-post-card"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: '#0066cc',
                    }}
                  >
                    {post.category}
                  </span>
                  <span style={{ fontSize: '12px', color: '#7a7a7a' }}>{post.date}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#7a7a7a' }}>
                    {post.readingTime} min read
                  </span>
                </div>

                <h2
                  style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    lineHeight: 1.25,
                    letterSpacing: '-0.374px',
                    color: '#1d1d1f',
                    margin: '0 0 8px',
                  }}
                >
                  {post.title}
                </h2>

                <p
                  style={{
                    fontSize: '14px',
                    color: '#7a7a7a',
                    lineHeight: 1.57,
                    margin: '0 0 14px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {post.excerpt}
                </p>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '11px',
                        fontWeight: 500,
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        backgroundColor: '#f5f5f7',
                        color: '#7a7a7a',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </Link>
          </li>
        ))}
      </ul>

      <style>{`
        .blog-post-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        @media (prefers-color-scheme: dark) {
          .blog-post-card {
            border-color: #3a3a3c !important;
            background-color: #1c1c1e !important;
          }
        }
      `}</style>
    </>
  )
}
