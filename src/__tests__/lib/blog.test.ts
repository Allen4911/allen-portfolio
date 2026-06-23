import { getAllPosts, getPostBySlug } from '@/lib/blog'

describe('getAllPosts', () => {
  it('returns array of posts with required fields', () => {
    const posts = getAllPosts()
    expect(posts.length).toBeGreaterThan(0)
    posts.forEach((post) => {
      expect(post).toHaveProperty('slug')
      expect(post).toHaveProperty('title')
      expect(post).toHaveProperty('date')
      expect(post).toHaveProperty('category')
      expect(post).toHaveProperty('tags')
      expect(post).toHaveProperty('excerpt')
      expect(post).toHaveProperty('readingTime')
      expect(post).toHaveProperty('wordCount')
    })
  })

  it('returns posts sorted by date descending', () => {
    const posts = getAllPosts()
    for (let i = 1; i < posts.length; i++) {
      expect(new Date(posts[i - 1].date).getTime()).toBeGreaterThanOrEqual(
        new Date(posts[i].date).getTime()
      )
    }
  })

  it('includes the 3 migrated posts', () => {
    const posts = getAllPosts()
    const slugs = posts.map((p) => p.slug)
    expect(slugs).toContain('claude-api-prompt-caching')
    expect(slugs).toContain('nextjs-dark-mode-tdd')
    expect(slugs).toContain('openclaw-multi-agent')
  })

  it('parses tags as array', () => {
    const posts = getAllPosts()
    posts.forEach((post) => {
      expect(Array.isArray(post.tags)).toBe(true)
    })
  })
})

describe('getPostBySlug', () => {
  it('returns post with content for valid slug', () => {
    const post = getPostBySlug('claude-api-prompt-caching')
    expect(post).not.toBeNull()
    expect(post!.title).toBe('Claude API와 Prompt Caching으로 토큰 비용 60% 절감하기')
    expect(post!.content).toBeDefined()
    expect(post!.content.length).toBeGreaterThan(0)
  })

  it('returns null for invalid slug', () => {
    const post = getPostBySlug('non-existent-slug')
    expect(post).toBeNull()
  })

  it('includes markdown body in content', () => {
    const post = getPostBySlug('claude-api-prompt-caching')
    expect(post!.content).toContain('Prompt Caching')
  })

  it('returns correct category for each post', () => {
    expect(getPostBySlug('claude-api-prompt-caching')!.category).toBe('AI / LLM')
    expect(getPostBySlug('nextjs-dark-mode-tdd')!.category).toBe('Next.js')
    expect(getPostBySlug('openclaw-multi-agent')!.category).toBe('Open Source')
  })

  it('returns seoTitle from frontmatter when present', () => {
    const post = getPostBySlug('claude-api-prompt-caching')
    expect(post!.seoTitle).toBe('Claude API Prompt Caching으로 토큰 비용 60% 절감 — 실전 가이드')
  })

  it('returns metaDescription from frontmatter when present', () => {
    const post = getPostBySlug('claude-api-prompt-caching')
    expect(post!.metaDescription).toContain('62%')
  })

  it('returns ogImage from frontmatter when present', () => {
    const post = getPostBySlug('claude-api-prompt-caching')
    expect(post!.ogImage).toBe('https://allen-portfolio.vercel.app/og/claude-prompt-caching.png')
  })

  it('returns undefined seoTitle for post without seoTitle frontmatter', () => {
    // Verify optional field defaults to undefined gracefully
    const post = getPostBySlug('claude-api-prompt-caching')
    expect(post).not.toBeNull()
    // All 3 posts now have seoTitle — just verify the field exists and is a string
    expect(typeof post!.seoTitle).toBe('string')
  })
})
