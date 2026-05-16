'use client'

import { useState } from 'react'
import Link from 'next/link'

export interface Category {
  id: string
  label: string
  slug: string
  count: number
}

export interface SeriesItem {
  id: string
  title: string
  slug: string
  current: boolean
  index: number
}

export interface TocItem {
  id: string
  label: string
  level: 2 | 3
}

export interface Tutorial {
  id: string
  title: string
  href: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  readingTime: number
}

export interface TrendingPost {
  id: string
  title: string
  href: string
  views: number
}

export interface RecentPost {
  id: string
  title: string
  href: string
  date: string
}

export interface TagItem {
  id: string
  label: string
  slug: string
  count: number
}

interface BlogSidebarProps {
  categories?: Category[]
  series?: SeriesItem[]
  toc?: TocItem[]
  tutorials?: Tutorial[]
  githubUrl?: string
  showNewsletter?: boolean
  readingTimeMinutes?: number
  wordCount?: number
  trendingPosts?: TrendingPost[]
  recentPosts?: RecentPost[]
  tags?: TagItem[]
  activeHeading?: string
  className?: string
}

function SidebarSection({
  title,
  children,
  testId,
}: {
  title: string
  children: React.ReactNode
  testId: string
}) {
  return (
    <div
      data-testid={testId}
      className="border-t border-[#e0e0e0] dark:border-[#3a3a3c] pt-5 pb-1"
    >
      <h3 className="text-[11px] font-[600] uppercase tracking-[0.08em] text-[#7a7a7a] dark:text-[#8a8a8e] mb-3">
        {title}
      </h3>
      {children}
    </div>
  )
}

const difficultyColor: Record<Tutorial['difficulty'], string> = {
  beginner: 'text-[#34c759] bg-[#f0fdf4] dark:bg-[#1a3a22] dark:text-[#4ade80]',
  intermediate: 'text-[#ff9f0a] bg-[#fff8f0] dark:bg-[#3a2a00] dark:text-[#fbbf24]',
  advanced: 'text-[#ff453a] bg-[#fff5f5] dark:bg-[#3a0a0a] dark:text-[#f87171]',
}

export default function BlogSidebar({
  categories = [],
  series = [],
  toc = [],
  tutorials = [],
  githubUrl,
  showNewsletter = false,
  readingTimeMinutes,
  wordCount,
  trendingPosts = [],
  recentPosts = [],
  tags = [],
  activeHeading,
  className = '',
}: BlogSidebarProps) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = () => {
    if (email) setSubscribed(true)
  }

  return (
    <aside
      data-testid="blog-sidebar"
      className={`w-full space-y-0 text-[14px] leading-[1.43] tracking-[-0.224px] ${className}`}
    >
      {/* Reading Time Stats */}
      {readingTimeMinutes !== undefined && (
        <SidebarSection title="Reading Stats" testId="sidebar-reading-stats">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-[#7a7a7a]" aria-hidden="true" data-testid="clock-icon">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="font-[600] text-[#1d1d1f] dark:text-white">
                {readingTimeMinutes} min read
              </span>
            </div>
            {wordCount !== undefined && (
              <span className="text-[#7a7a7a] dark:text-[#8a8a8e]">
                {wordCount.toLocaleString()} words
              </span>
            )}
          </div>
        </SidebarSection>
      )}

      {/* TOC */}
      {toc.length > 0 && (
        <SidebarSection title="On This Page" testId="sidebar-toc">
          <nav>
            <ul className="space-y-1">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    data-testid={`toc-${item.id}`}
                    aria-current={activeHeading === item.id ? 'true' : undefined}
                    className={[
                      'block py-0.5 transition-colors duration-150',
                      item.level === 3
                        ? 'pl-3 toc-level-3 text-[13px]'
                        : 'toc-level-2',
                      activeHeading === item.id
                        ? 'active text-[#0066cc] dark:text-[#2997ff] font-[500]'
                        : 'text-[#7a7a7a] dark:text-[#8a8a8e] hover:text-[#1d1d1f] dark:hover:text-white',
                    ].join(' ')}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </SidebarSection>
      )}

      {/* Series Navigation */}
      {series.length > 0 && (
        <SidebarSection title="Series" testId="sidebar-series">
          <ol className="space-y-1">
            {series.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.slug}
                  data-testid={`series-item-${item.id}`}
                  aria-current={item.current ? 'true' : undefined}
                  className={[
                    'flex items-start gap-2 py-1 px-2 rounded-md transition-all duration-150 group',
                    item.current
                      ? 'current bg-[#f5f5f7] dark:bg-[#2a2a2c] text-[#1d1d1f] dark:text-white font-[500]'
                      : 'text-[#7a7a7a] dark:text-[#8a8a8e] hover:bg-[#f5f5f7] dark:hover:bg-[#1c1c1e] hover:text-[#1d1d1f] dark:hover:text-white',
                  ].join(' ')}
                >
                  <span className={[
                    'mt-0.5 min-w-[18px] text-[11px] font-[600] tabular-nums',
                    item.current ? 'text-[#0066cc] dark:text-[#2997ff]' : 'text-[#cccccc] dark:text-[#48484a]',
                  ].join(' ')}>
                    {String(item.index).padStart(2, '0')}
                  </span>
                  <span className="text-[13px] leading-snug">{item.title}</span>
                </Link>
              </li>
            ))}
          </ol>
        </SidebarSection>
      )}

      {/* AI Categories */}
      {categories.length > 0 && (
        <SidebarSection title="Categories" testId="sidebar-categories">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/blog/category/${cat.slug}`}
                data-testid={`category-${cat.slug}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] bg-[#f5f5f7] dark:bg-[#2a2a2c] text-[#1d1d1f] dark:text-[#cccccc] hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c] transition-colors duration-150"
              >
                {cat.label}
                <span className="text-[10px] text-[#7a7a7a] dark:text-[#8a8a8e]">{cat.count}</span>
              </a>
            ))}
          </div>
        </SidebarSection>
      )}

      {/* Recommended Tutorials */}
      {tutorials.length > 0 && (
        <SidebarSection title="Recommended" testId="sidebar-tutorials">
          <ul className="space-y-3">
            {tutorials.map((tutorial) => (
              <li key={tutorial.id}>
                <Link
                  href={tutorial.href}
                  className="group block hover:-translate-y-0.5 transition-transform duration-200"
                >
                  <div className="text-[13px] font-[500] text-[#1d1d1f] dark:text-white group-hover:text-[#0066cc] dark:group-hover:text-[#2997ff] transition-colors duration-150 leading-snug mb-1">
                    {tutorial.title}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-[500] px-1.5 py-0.5 rounded-md ${difficultyColor[tutorial.difficulty]}`}>
                      {tutorial.difficulty}
                    </span>
                    <span className="text-[12px] text-[#7a7a7a] dark:text-[#8a8a8e]">
                      {tutorial.readingTime} min
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </SidebarSection>
      )}

      {/* Trending Posts */}
      {trendingPosts.length > 0 && (
        <SidebarSection title="Trending" testId="sidebar-trending">
          <ol className="space-y-3">
            {trendingPosts.map((post, i) => (
              <li key={post.id} className="flex items-start gap-3">
                <span
                  data-testid={`trending-rank-${i + 1}`}
                  className="text-[22px] font-[700] leading-none text-[#e0e0e0] dark:text-[#3a3a3c] tabular-nums min-w-[24px]"
                >
                  {i + 1}
                </span>
                <a
                  href={post.href}
                  data-testid={`trending-post-${i + 1}`}
                  className="text-[13px] font-[500] text-[#1d1d1f] dark:text-white hover:text-[#0066cc] dark:hover:text-[#2997ff] transition-colors duration-150 leading-snug"
                >
                  {post.title}
                </a>
              </li>
            ))}
          </ol>
        </SidebarSection>
      )}

      {/* GitHub Link */}
      {recentPosts.length > 0 && (
        <SidebarSection title="Recent Posts" testId="sidebar-recent-posts">
          <ul className="space-y-3">
            {recentPosts.map((post) => (
              <li key={post.id}>
                <a
                  href={post.href}
                  data-testid={`recent-post-${post.id}`}
                  className="group block"
                >
                  <div className="text-[13px] font-[500] text-[#1d1d1f] dark:text-white group-hover:text-[#0066cc] dark:group-hover:text-[#2997ff] transition-colors duration-150 leading-snug mb-0.5">
                    {post.title}
                  </div>
                  <div className="text-[11px] text-[#7a7a7a] dark:text-[#8a8a8e]">{post.date}</div>
                </a>
              </li>
            ))}
          </ul>
        </SidebarSection>
      )}

      {tags.length > 0 && (
        <SidebarSection title="Tags" testId="sidebar-tags">
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <a
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                data-testid={`tag-${tag.slug}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] bg-[#f5f5f7] dark:bg-[#2a2a2c] text-[#1d1d1f] dark:text-[#cccccc] hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c] transition-colors duration-150"
              >
                {tag.label}
                <span data-testid={`tag-count-${tag.slug}`} className="text-[10px] text-[#7a7a7a] dark:text-[#8a8a8e]">{tag.count}</span>
              </a>
            ))}
          </div>
        </SidebarSection>
      )}

      {githubUrl && (
        <SidebarSection title="Source" testId="sidebar-github">
          <a
            href={githubUrl}
            data-testid="github-link"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[13px] text-[#1d1d1f] dark:text-white hover:text-[#0066cc] dark:hover:text-[#2997ff] transition-colors duration-150 group"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="shrink-0"
              aria-hidden="true"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span>View on GitHub</span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150"
              aria-hidden="true"
            >
              <path d="M1 9L9 1M9 1H3M9 1v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </a>
        </SidebarSection>
      )}

      {/* Newsletter CTA */}
      {showNewsletter && (
        <SidebarSection title="Newsletter" testId="sidebar-newsletter">
          {subscribed ? (
            <div
              data-testid="newsletter-success"
              className="text-[13px] text-[#34c759] dark:text-[#4ade80] font-[500]"
            >
              Thanks for subscribing!
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-[12px] text-[#7a7a7a] dark:text-[#8a8a8e]">
                AI engineering insights, weekly.
              </p>
              <input
                data-testid="newsletter-email"
                type="email"
                aria-label="Email address for newsletter"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 text-[13px] rounded-md border border-[#e0e0e0] dark:border-[#3a3a3c] bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white placeholder:text-[#cccccc] dark:placeholder:text-[#48484a] focus:outline-none focus:border-[#0066cc] dark:focus:border-[#2997ff] transition-colors duration-150"
              />
              <button
                data-testid="newsletter-submit"
                onClick={handleSubscribe}
                className="w-full py-2 px-3 text-[13px] font-[600] rounded-md bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] hover:bg-[#333333] dark:hover:bg-[#e0e0e0] active:scale-[0.98] transition-all duration-150"
              >
                Subscribe
              </button>
            </div>
          )}
        </SidebarSection>
      )}
    </aside>
  )
}
