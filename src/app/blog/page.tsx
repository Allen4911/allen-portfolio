import BlogLayout from '@/components/blog/BlogLayout'
import BlogSidebar from '@/components/blog/BlogSidebar'
import { blogPosts, blogCategories, trendingPosts } from '@/data/blogPosts'

export const metadata = {
  title: 'Blog',
  description: 'AI 엔지니어링, 개발 경험, 그리고 배움의 기록',
}

export default function BlogPage() {
  const sidebarCategories = blogCategories.map((c) => ({
    id: c.id,
    label: c.label,
    slug: c.slug,
    count: c.count,
  }))

  return (
    <div data-testid="blog-page">
      <div className="max-w-[1080px] mx-auto px-6 pt-12 pb-8">
        <h1 className="font-display text-[40px] font-[600] tracking-[-0.4px] leading-[1.1] text-[#1d1d1f] dark:text-white">
          Blog
        </h1>
        <p className="mt-2.5 text-[17px] text-[#7a7a7a] dark:text-[#8a8a8e]">
          AI 엔지니어링, 개발 경험, 그리고 배움의 기록
        </p>
      </div>

      <BlogLayout
        sidebar={
          <BlogSidebar
            categories={sidebarCategories}
            trendingPosts={trendingPosts}
            showNewsletter
          />
        }
      >
        <ul className="flex flex-col gap-8" data-testid="post-list">
          {blogPosts.map((post) => (
            <li
              key={post.id}
              data-testid={`post-card-${post.id}`}
              className="p-6 rounded-[8px] border border-[#e0e0e0] dark:border-[#3a3a3c] bg-white dark:bg-[#1c1c1e] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <span className="text-[11px] font-[600] uppercase tracking-[0.08em] text-[#0066cc] dark:text-[#2997ff]">
                  {post.category}
                </span>
                <span className="text-[12px] text-[#7a7a7a] dark:text-[#8a8a8e]">{post.date}</span>
              </div>
              <h2 className="font-display text-[20px] font-[600] leading-[1.25] mb-2 text-[#1d1d1f] dark:text-white">
                {post.title}
              </h2>
              <p className="text-[14px] text-[#7a7a7a] dark:text-[#8a8a8e] leading-[1.57]">
                {post.excerpt}
              </p>
              <div className="mt-3.5 flex items-center gap-2 flex-wrap">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-[500] px-2.5 py-1 rounded-full bg-[#f5f5f7] dark:bg-[#2a2a2c] text-[#7a7a7a] dark:text-[#8a8a8e]"
                  >
                    {tag}
                  </span>
                ))}
                <span className="ml-auto text-[12px] text-[#7a7a7a] dark:text-[#8a8a8e]">
                  {post.readingTime} min read
                </span>
              </div>
            </li>
          ))}
        </ul>
      </BlogLayout>
    </div>
  )
}
