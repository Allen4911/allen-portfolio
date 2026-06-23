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
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = useMemo(() => {
    let result = activeCategory === 'All' ? posts : posts.filter((p) => p.category === activeCategory)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
      )
    }
    return result
  }, [posts, activeCategory, searchQuery])

  return (
    <>
      <input
        type="search"
        role="searchbox"
        placeholder="제목 또는 내용으로 검색..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Search blog posts"
        style={{
          width: '100%',
          padding: '10px 16px',
          borderRadius: '10px',
          border: '1px solid #e0e0e0',
          fontSize: '14px',
          color: '#1d1d1f',
          marginBottom: '20px',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />

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
              border: activeCategory === cat ? '2px solid var(--color-invoice-blue)' : '1px solid #e0e0e0',
              backgroundColor: '#ffffff',
              color: activeCategory === cat ? 'var(--color-invoice-blue)' : '#1d1d1f',
              fontSize: '13px',
              fontWeight: activeCategory === cat ? 600 : 400,
              letterSpacing: '-0.08px',
              cursor: 'pointer',
              outline: 'none',
              transition: 'border 0.15s ease, color 0.15s ease',
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
          box-shadow: var(--shadow-subtle);
        }
      `}</style>
    </>
  )
}
