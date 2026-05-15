import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts, getAllTags } from '@/lib/blog'
import PostCard from '@/components/blog/PostCard'

export const metadata: Metadata = {
  title: 'Blog — Allen',
  description: 'Thoughts on software engineering, product development, and learning.',
  openGraph: {
    title: 'Blog — Allen',
    description: 'Thoughts on software engineering, product development, and learning.',
    type: 'website',
  },
}

export default function BlogPage() {
  const posts = getAllPosts()
  const tags = getAllTags()

  return (
    <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>
        <header style={{ marginBottom: '48px' }}>
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              margin: '0 0 16px',
            }}
          >
            Blog
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--color-text-secondary, rgba(255,255,255,0.6))', margin: 0 }}>
            Thoughts on software, products, and what I&apos;m learning.
          </p>
        </header>

        {tags.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '40px' }}>
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag}`}
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '9999px',
                  padding: '5px 12px',
                  textDecoration: 'none',
                  transition: 'border-color 0.15s, color 0.15s',
                }}
                className="tag-link"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {posts.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px' }}>No posts yet. Check back soon.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .tag-link:hover {
          border-color: rgba(255,255,255,0.4) !important;
          color: rgba(255,255,255,0.9) !important;
        }
      `}</style>
    </main>
  )
}
