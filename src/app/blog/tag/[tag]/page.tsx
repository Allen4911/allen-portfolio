import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllTags, getPostsByTag } from '@/lib/blog'
import PostCard from '@/components/blog/PostCard'

interface Props {
  params: { tag: string }
}

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `#${params.tag} — Allen Blog`,
    description: `Posts tagged with ${params.tag}`,
  }
}

export default function TagPage({ params }: Props) {
  const posts = getPostsByTag(params.tag)
  if (posts.length === 0) notFound()

  return (
    <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>
        <Link
          href="/blog"
          style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', display: 'inline-block', marginBottom: '32px' }}
        >
          ← All posts
        </Link>

        <header style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.04em', margin: '0 0 12px' }}>
            #{params.tag}
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </main>
  )
}
