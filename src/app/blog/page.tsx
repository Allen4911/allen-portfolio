import BlogLayout from '@/components/blog/BlogLayout'
import BlogSidebar from '@/components/blog/BlogSidebar'
import BlogClientPage from './BlogClientPage'
import { getAllPosts } from '@/lib/blog'
import { blogCategories, blogTags } from '@/data/blogPosts'
import type { BlogPost } from '@/lib/blog'

export const metadata = {
  title: 'Blog',
  description: 'AI 엔지니어링, 개발 경험, 그리고 배움의 기록',
}

export default function BlogPage() {
  const posts = getAllPosts()

  const sidebarCategories = blogCategories.map((c) => ({
    id: c.id,
    label: c.label,
    slug: c.slug,
    count: c.count,
  }))

  const trendingPosts = posts.slice(0, 3).map((p, i) => ({
    id: p.id,
    title: p.title,
    href: `/blog/${p.slug}`,
    views: [1240, 890, 670][i],
  }))

  const recentPosts = posts.slice(0, 3).map((p) => ({
    id: p.id,
    title: p.title,
    href: `/blog/${p.slug}`,
    date: p.date,
  }))

  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))]

  const clientPosts = posts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    tags: p.tags,
    date: p.date,
    readingTime: p.readingTime,
    wordCount: p.wordCount,
    githubUrl: p.githubUrl,
    seriesId: p.seriesId,
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
            recentPosts={recentPosts}
            tags={blogTags}
            showNewsletter
          />
        }
      >
        <BlogClientPage posts={clientPosts} categories={categories} />
      </BlogLayout>
    </div>
  )
}
