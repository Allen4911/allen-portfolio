import { notFound } from 'next/navigation'
import BlogLayout from '@/components/blog/BlogLayout'
import BlogSidebar from '@/components/blog/BlogSidebar'
import { blogPosts } from '@/data/blogPosts'

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug)
  if (!post) return {}
  return { title: post.title, description: post.excerpt }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug)
  if (!post) notFound()

  return (
    <div data-testid="blog-post-page">
      <div className="max-w-[1080px] mx-auto px-6 pt-8 pb-4">
        <nav className="text-[12px] text-[#7a7a7a] dark:text-[#8a8a8e]">
          <a href="/blog" className="hover:text-[#0066cc] dark:hover:text-[#2997ff] transition-colors">Blog</a>
          <span className="mx-1.5">›</span>
          <span className="text-[#1d1d1f] dark:text-white">{post.category}</span>
        </nav>
      </div>

      <BlogLayout
        sidebar={
          <div className="sticky top-24">
            <BlogSidebar
              readingTimeMinutes={post.readingTime}
              wordCount={post.wordCount}
              githubUrl={post.githubUrl}
              showNewsletter
            />
          </div>
        }
      >
        <article data-testid="blog-article" className="max-w-[680px]">
          <div className="mb-6">
            <span className="text-[11px] font-[600] uppercase tracking-[0.08em] text-[#0066cc] dark:text-[#2997ff]">
              {post.category}
            </span>
            <h1 className="font-display text-[34px] font-[600] tracking-[-0.374px] leading-[1.24] mt-2 mb-3 text-[#1d1d1f] dark:text-white">
              {post.title}
            </h1>
            <div className="flex items-center gap-3 text-[13px] text-[#7a7a7a] dark:text-[#8a8a8e]">
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readingTime} min read</span>
            </div>
          </div>

          <div className="border-t border-[#e0e0e0] dark:border-[#3a3a3c] pt-6">
            <p className="text-[17px] leading-[1.47] tracking-[-0.374px] text-[#1d1d1f] dark:text-white">
              {post.excerpt}
            </p>
            <p className="mt-4 text-[15px] text-[#7a7a7a] dark:text-[#8a8a8e]">
              (본문 콘텐츠는 MDX 연동 후 추가 예정)
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[12px] font-[500] px-3 py-1 rounded-full bg-[#f5f5f7] dark:bg-[#2a2a2c] text-[#7a7a7a] dark:text-[#8a8a8e]"
              >
                {tag}
              </span>
            ))}
          </div>
        </article>
      </BlogLayout>
    </div>
  )
}
