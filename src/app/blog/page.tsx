import BlogLayout from '@/components/blog/BlogLayout'
import BlogSidebar from '@/components/blog/BlogSidebar'
import BlogClientPage from './BlogClientPage'
import { blogPosts, blogCategories, trendingPosts, recentPosts, blogTags } from '@/data/blogPosts'

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

  const categories = ['All', ...Array.from(new Set(blogPosts.map((p) => p.category)))]

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
            recentPosts={recentPosts}
            tags={blogTags}
            showNewsletter
          />
        }
      >
        <BlogClientPage posts={blogPosts} categories={categories} />
      </BlogLayout>
    </div>
  )
}
