import Link from 'next/link'
import type { PostMeta } from '@/lib/blog'

interface Props {
  post: PostMeta
}

export default function PostCard({ post }: Props) {
  const dateStr = post.date
    ? new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }} className="post-card">
      <article
        style={{
          padding: '28px 32px',
          borderRadius: '16px',
          border: '1px solid var(--color-border, rgba(255,255,255,0.08))',
          backgroundColor: 'var(--color-surface, rgba(255,255,255,0.03))',
          transition: 'border-color 0.2s ease, transform 0.2s ease',
          cursor: 'pointer',
        }}
        className="post-card-inner"
      >
        {post.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {post.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  color: 'var(--color-primary, #0071e3)',
                  backgroundColor: 'rgba(0,113,227,0.1)',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  letterSpacing: '0.02em',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h2
          style={{
            margin: '0 0 10px',
            fontSize: '20px',
            fontWeight: 600,
            letterSpacing: '-0.3px',
            color: 'var(--color-text-primary, inherit)',
            lineHeight: 1.3,
          }}
        >
          {post.title}
        </h2>

        {post.description && (
          <p
            style={{
              margin: '0 0 16px',
              fontSize: '14px',
              color: 'var(--color-text-secondary, rgba(255,255,255,0.6))',
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.description}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            gap: '12px',
            fontSize: '12px',
            color: 'var(--color-text-tertiary, rgba(255,255,255,0.4))',
          }}
        >
          <time dateTime={post.date}>{dateStr}</time>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
      </article>

      <style>{`
        .post-card-inner:hover {
          border-color: rgba(255,255,255,0.2) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </Link>
  )
}
