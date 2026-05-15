import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPosts, getPost, getAdjacentPosts } from '@/lib/blog'
import TableOfContents from '@/components/blog/TableOfContents'
import ReadingProgress from '@/components/blog/ReadingProgress'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost(params.slug)
  if (!post) return {}
  return {
    title: `${post.title} — Allen`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

export default function BlogPostPage({ params }: Props) {
  const post = getPost(params.slug)
  if (!post) notFound()

  const { prev, next } = getAdjacentPosts(params.slug)

  const dateStr = post.date
    ? new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

  return (
    <>
      <ReadingProgress />
      <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '48px 24px',
            display: 'grid',
            gridTemplateColumns: '1fr 220px',
            gap: '64px',
            alignItems: 'start',
          }}
          className="post-layout"
        >
          <div>
            <Link
              href="/blog"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                color: 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
                marginBottom: '32px',
              }}
            >
              ← All posts
            </Link>

            <header style={{ marginBottom: '48px' }}>
              {post.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${tag}`}
                      style={{
                        fontSize: '11px',
                        fontWeight: 500,
                        color: 'var(--color-primary, #0071e3)',
                        backgroundColor: 'rgba(0,113,227,0.1)',
                        borderRadius: '6px',
                        padding: '3px 8px',
                        textDecoration: 'none',
                      }}
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}

              <h1
                style={{
                  fontSize: 'clamp(28px, 4vw, 44px)',
                  fontWeight: 700,
                  letterSpacing: '-0.04em',
                  lineHeight: 1.15,
                  margin: '0 0 20px',
                }}
              >
                {post.title}
              </h1>

              <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
                <time dateTime={post.date}>{dateStr}</time>
                <span>·</span>
                <span>{post.readingTime}</span>
              </div>
            </header>

            <article className="mdx-prose">
              <MDXRemote source={post.content} />
            </article>

            <nav
              aria-label="Post navigation"
              style={{
                marginTop: '64px',
                paddingTop: '32px',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
              }}
            >
              {prev ? (
                <Link href={`/blog/${prev.slug}`} style={{ textDecoration: 'none' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '6px' }}>
                    ← Previous
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-on-dark)' }}>{prev.title}</span>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link href={`/blog/${next.slug}`} style={{ textDecoration: 'none', textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '6px' }}>
                    Next →
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-on-dark)' }}>{next.title}</span>
                </Link>
              ) : (
                <div />
              )}
            </nav>
          </div>

          <aside className="toc-aside">
            <TableOfContents />
          </aside>
        </div>

        <style>{`
          .post-layout {
            grid-template-columns: 1fr 220px;
          }
          @media (max-width: 900px) {
            .post-layout {
              grid-template-columns: 1fr !important;
            }
            .toc-aside {
              display: none;
            }
          }
          .mdx-prose h2 {
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.03em;
            margin: 2.5em 0 0.8em;
            scroll-margin-top: 80px;
          }
          .mdx-prose h3 {
            font-size: 18px;
            font-weight: 600;
            margin: 2em 0 0.6em;
            scroll-margin-top: 80px;
          }
          .mdx-prose p {
            font-size: 16px;
            line-height: 1.75;
            margin: 0 0 1.25em;
            color: rgba(255,255,255,0.82);
          }
          .mdx-prose a {
            color: var(--color-primary, #0071e3);
            text-decoration: underline;
            text-underline-offset: 3px;
          }
          .mdx-prose pre {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 10px;
            padding: 20px;
            overflow-x: auto;
            margin: 1.5em 0;
          }
          .mdx-prose code {
            font-family: 'SF Mono', 'Fira Code', monospace;
            font-size: 13.5px;
          }
          .mdx-prose :not(pre) > code {
            background: rgba(255,255,255,0.08);
            border-radius: 4px;
            padding: 2px 6px;
            font-size: 13px;
          }
          .mdx-prose ul, .mdx-prose ol {
            padding-left: 1.5em;
            margin: 0 0 1.25em;
          }
          .mdx-prose li {
            font-size: 16px;
            line-height: 1.75;
            color: rgba(255,255,255,0.82);
            margin-bottom: 0.4em;
          }
          .mdx-prose blockquote {
            border-left: 3px solid var(--color-primary, #0071e3);
            margin: 1.5em 0;
            padding: 12px 20px;
            background: rgba(0,113,227,0.06);
            border-radius: 0 8px 8px 0;
          }
          .mdx-prose blockquote p {
            margin: 0;
            color: rgba(255,255,255,0.7);
          }
          .mdx-prose img {
            max-width: 100%;
            border-radius: 10px;
            margin: 1.5em 0;
          }
          .mdx-prose hr {
            border: none;
            border-top: 1px solid rgba(255,255,255,0.08);
            margin: 2em 0;
          }
        `}</style>
      </main>
    </>
  )
}
