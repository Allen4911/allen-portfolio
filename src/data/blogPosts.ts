export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  tags: string[]
  date: string
  readingTime: number
  wordCount: number
  githubUrl?: string
  seriesId?: string
}

export const blogCategories = [
  { id: 'all', label: 'All', slug: 'all', count: 3 },
  { id: 'ai-llm', label: 'AI / LLM', slug: 'ai-llm', count: 1 },
  { id: 'nextjs', label: 'Next.js', slug: 'nextjs', count: 1 },
  { id: 'open-source', label: 'Open Source', slug: 'open-source', count: 1 },
]

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'claude-api-prompt-caching',
    title: 'Claude API와 Prompt Caching으로 토큰 비용 60% 절감하기',
    excerpt:
      '실제 프로덕션에서 Anthropic SDK의 prompt caching을 적용해 운영 비용을 대폭 줄인 경험. cache_control 설정부터 캐시 히트율 모니터링까지.',
    category: 'AI / LLM',
    tags: ['Claude API', 'Prompt Caching', 'Cost Optimization'],
    date: '2026-05-14',
    readingTime: 8,
    wordCount: 2100,
    githubUrl: 'https://github.com/Allen4911',
  },
  {
    id: '2',
    slug: 'nextjs-dark-mode-tdd',
    title: 'Next.js 15 App Router에서 다크모드 완벽 구현 (Tailwind + TDD)',
    excerpt:
      'tailwind darkMode: "class" 설정부터 SSR hydration mismatch 방지, DarkModeToggle 컴포넌트 TDD 작성까지.',
    category: 'Next.js',
    tags: ['Next.js', 'Tailwind', 'TDD'],
    date: '2026-05-10',
    readingTime: 6,
    wordCount: 1800,
  },
  {
    id: '3',
    slug: 'openclaw-multi-agent',
    title: 'OpenClaw: Telegram → Claude CLI 브릿지 오픈소스 공개',
    excerpt:
      '텔레그램으로 Claude Code 팀 에이전트를 원격 지휘하는 브릿지 시스템. tmux + Redis IPC 기반의 멀티 에이전트 아키텍처.',
    category: 'Open Source',
    tags: ['OpenClaw', 'Claude', 'Telegram'],
    date: '2026-05-02',
    readingTime: 10,
    wordCount: 2800,
    githubUrl: 'https://github.com/Allen4911',
  },
]

export const trendingPosts = blogPosts.map((p, i) => ({
  id: p.id,
  title: p.title,
  href: `/blog/${p.slug}`,
  views: [1240, 890, 670][i],
}))
