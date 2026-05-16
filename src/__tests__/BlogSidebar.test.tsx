import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogSidebar, {
  type Category,
  type SeriesItem,
  type TocItem,
  type Tutorial,
  type TrendingPost,
  type RecentPost,
  type TagItem,
} from '../components/blog/BlogSidebar'

jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  )
  MockLink.displayName = 'MockLink'
  return MockLink
})

const mockCategories: Category[] = [
  { id: '1', label: 'LLM', slug: 'llm', count: 12 },
  { id: '2', label: 'RAG', slug: 'rag', count: 8 },
  { id: '3', label: 'Fine-tuning', slug: 'fine-tuning', count: 5 },
]

const mockSeries: SeriesItem[] = [
  { id: '1', title: 'Building RAG Systems', slug: '/blog/series/rag', current: false, index: 1 },
  { id: '2', title: 'LLM Prompt Engineering', slug: '/blog/series/prompt', current: true, index: 2 },
  { id: '3', title: 'Vector Databases', slug: '/blog/series/vector', current: false, index: 3 },
]

const mockToc: TocItem[] = [
  { id: 'intro', label: 'Introduction', level: 2 },
  { id: 'setup', label: 'Setup', level: 2 },
  { id: 'advanced', label: 'Advanced Usage', level: 3 },
]

const mockTutorials: Tutorial[] = [
  { id: '1', title: 'Build a RAG Pipeline', href: '/blog/rag-pipeline', difficulty: 'beginner', readingTime: 8 },
  { id: '2', title: 'Fine-tune Llama 3', href: '/blog/llama-finetune', difficulty: 'advanced', readingTime: 15 },
]

const mockTrending: TrendingPost[] = [
  { id: '1', title: 'Claude vs GPT-4', href: '/blog/claude-vs-gpt4', views: 4200 },
  { id: '2', title: 'RAG vs Fine-tuning', href: '/blog/rag-vs-finetune', views: 3100 },
  { id: '3', title: 'Prompt Engineering Guide', href: '/blog/prompt-guide', views: 2800 },
]

describe('BlogSidebar', () => {
  describe('renders without crashing', () => {
    test('renders with no props', () => {
      const { container } = render(<BlogSidebar />)
      expect(container).toBeInTheDocument()
    })

    test('has data-testid="blog-sidebar"', () => {
      render(<BlogSidebar />)
      expect(screen.getByTestId('blog-sidebar')).toBeInTheDocument()
    })
  })

  describe('AI Categories section', () => {
    test('renders categories section heading', () => {
      render(<BlogSidebar categories={mockCategories} />)
      expect(screen.getByTestId('sidebar-categories')).toBeInTheDocument()
    })

    test('renders all category tags', () => {
      render(<BlogSidebar categories={mockCategories} />)
      expect(screen.getByText('LLM')).toBeInTheDocument()
      expect(screen.getByText('RAG')).toBeInTheDocument()
      expect(screen.getByText('Fine-tuning')).toBeInTheDocument()
    })

    test('renders category post counts', () => {
      render(<BlogSidebar categories={mockCategories} />)
      expect(screen.getByText('12')).toBeInTheDocument()
      expect(screen.getByText('8')).toBeInTheDocument()
    })

    test('category links point to correct slugs', () => {
      render(<BlogSidebar categories={mockCategories} />)
      const llmLink = screen.getByTestId('category-llm')
      expect(llmLink).toHaveAttribute('href', '/blog/category/llm')
    })

    test('does not render categories section when empty', () => {
      render(<BlogSidebar categories={[]} />)
      expect(screen.queryByTestId('sidebar-categories')).not.toBeInTheDocument()
    })
  })

  describe('Series Navigation section', () => {
    test('renders series section', () => {
      render(<BlogSidebar series={mockSeries} />)
      expect(screen.getByTestId('sidebar-series')).toBeInTheDocument()
    })

    test('renders all series items', () => {
      render(<BlogSidebar series={mockSeries} />)
      expect(screen.getByText('Building RAG Systems')).toBeInTheDocument()
      expect(screen.getByText('LLM Prompt Engineering')).toBeInTheDocument()
      expect(screen.getByText('Vector Databases')).toBeInTheDocument()
    })

    test('highlights current series item', () => {
      render(<BlogSidebar series={mockSeries} />)
      const currentItem = screen.getByTestId('series-item-2')
      expect(currentItem).toHaveClass('current')
    })

    test('a11y: current series item has aria-current="true"', () => {
      render(<BlogSidebar series={mockSeries} />)
      const currentItem = screen.getByTestId('series-item-2')
      expect(currentItem).toHaveAttribute('aria-current', 'true')
    })

    test('a11y: non-current series items do not have aria-current', () => {
      render(<BlogSidebar series={mockSeries} />)
      const nonCurrentItem = screen.getByTestId('series-item-1')
      expect(nonCurrentItem).not.toHaveAttribute('aria-current')
    })

    test('does not render series section when empty', () => {
      render(<BlogSidebar series={[]} />)
      expect(screen.queryByTestId('sidebar-series')).not.toBeInTheDocument()
    })
  })

  describe('Table of Contents (TOC) section', () => {
    test('renders TOC section', () => {
      render(<BlogSidebar toc={mockToc} />)
      expect(screen.getByTestId('sidebar-toc')).toBeInTheDocument()
    })

    test('renders all TOC items', () => {
      render(<BlogSidebar toc={mockToc} />)
      expect(screen.getByText('Introduction')).toBeInTheDocument()
      expect(screen.getByText('Setup')).toBeInTheDocument()
      expect(screen.getByText('Advanced Usage')).toBeInTheDocument()
    })

    test('TOC links have correct anchor hrefs', () => {
      render(<BlogSidebar toc={mockToc} />)
      const introLink = screen.getByTestId('toc-intro')
      expect(introLink).toHaveAttribute('href', '#intro')
    })

    test('h3 items have indentation class', () => {
      render(<BlogSidebar toc={mockToc} />)
      const h3Item = screen.getByTestId('toc-advanced')
      expect(h3Item).toHaveClass('toc-level-3')
    })

    test('highlights active TOC heading', () => {
      render(<BlogSidebar toc={mockToc} activeHeading="setup" />)
      const activeItem = screen.getByTestId('toc-setup')
      expect(activeItem).toHaveClass('active')
    })

    test('a11y: active TOC item has aria-current="true"', () => {
      render(<BlogSidebar toc={mockToc} activeHeading="setup" />)
      const activeItem = screen.getByTestId('toc-setup')
      expect(activeItem).toHaveAttribute('aria-current', 'true')
    })

    test('a11y: non-active TOC items do not have aria-current', () => {
      render(<BlogSidebar toc={mockToc} activeHeading="setup" />)
      const inactiveItem = screen.getByTestId('toc-intro')
      expect(inactiveItem).not.toHaveAttribute('aria-current')
    })

    test('does not render TOC when empty', () => {
      render(<BlogSidebar toc={[]} />)
      expect(screen.queryByTestId('sidebar-toc')).not.toBeInTheDocument()
    })
  })

  describe('Recommended Tutorials section', () => {
    test('renders tutorials section', () => {
      render(<BlogSidebar tutorials={mockTutorials} />)
      expect(screen.getByTestId('sidebar-tutorials')).toBeInTheDocument()
    })

    test('renders tutorial titles', () => {
      render(<BlogSidebar tutorials={mockTutorials} />)
      expect(screen.getByText('Build a RAG Pipeline')).toBeInTheDocument()
      expect(screen.getByText('Fine-tune Llama 3')).toBeInTheDocument()
    })

    test('renders difficulty badges', () => {
      render(<BlogSidebar tutorials={mockTutorials} />)
      expect(screen.getByText('beginner')).toBeInTheDocument()
      expect(screen.getByText('advanced')).toBeInTheDocument()
    })

    test('renders reading time', () => {
      render(<BlogSidebar tutorials={mockTutorials} />)
      expect(screen.getByText('8 min')).toBeInTheDocument()
      expect(screen.getByText('15 min')).toBeInTheDocument()
    })

    test('does not render tutorials section when empty', () => {
      render(<BlogSidebar tutorials={[]} />)
      expect(screen.queryByTestId('sidebar-tutorials')).not.toBeInTheDocument()
    })
  })

  describe('GitHub Link section', () => {
    test('renders GitHub link when provided', () => {
      render(<BlogSidebar githubUrl="https://github.com/Allen4911/allen-portfolio" />)
      expect(screen.getByTestId('sidebar-github')).toBeInTheDocument()
    })

    test('GitHub link opens in new tab', () => {
      render(<BlogSidebar githubUrl="https://github.com/Allen4911/allen-portfolio" />)
      const link = screen.getByTestId('github-link')
      expect(link).toHaveAttribute('href', 'https://github.com/Allen4911/allen-portfolio')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })

    test('does not render GitHub section without URL', () => {
      render(<BlogSidebar />)
      expect(screen.queryByTestId('sidebar-github')).not.toBeInTheDocument()
    })
  })

  describe('Newsletter CTA section', () => {
    test('renders newsletter section', () => {
      render(<BlogSidebar showNewsletter />)
      expect(screen.getByTestId('sidebar-newsletter')).toBeInTheDocument()
    })

    test('renders email input', () => {
      render(<BlogSidebar showNewsletter />)
      const input = screen.getByTestId('newsletter-email')
      expect(input).toHaveAttribute('type', 'email')
      expect(input).toHaveAttribute('placeholder')
    })

    test('a11y: email input has aria-label', () => {
      render(<BlogSidebar showNewsletter />)
      const input = screen.getByTestId('newsletter-email')
      expect(input).toHaveAttribute('aria-label')
    })

    test('renders subscribe button', () => {
      render(<BlogSidebar showNewsletter />)
      expect(screen.getByTestId('newsletter-submit')).toBeInTheDocument()
    })

    test('email input updates on change', () => {
      render(<BlogSidebar showNewsletter />)
      const input = screen.getByTestId('newsletter-email') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'test@example.com' } })
      expect(input.value).toBe('test@example.com')
    })

    test('shows success state after submission', () => {
      render(<BlogSidebar showNewsletter />)
      const input = screen.getByTestId('newsletter-email')
      const button = screen.getByTestId('newsletter-submit')
      fireEvent.change(input, { target: { value: 'test@example.com' } })
      fireEvent.click(button)
      expect(screen.getByTestId('newsletter-success')).toBeInTheDocument()
    })

    test('does not render newsletter section by default', () => {
      render(<BlogSidebar />)
      expect(screen.queryByTestId('sidebar-newsletter')).not.toBeInTheDocument()
    })
  })

  describe('Reading Time Stats section', () => {
    test('renders reading stats section when provided', () => {
      render(<BlogSidebar readingTimeMinutes={7} wordCount={1750} />)
      expect(screen.getByTestId('sidebar-reading-stats')).toBeInTheDocument()
    })

    test('displays reading time in minutes', () => {
      render(<BlogSidebar readingTimeMinutes={7} wordCount={1750} />)
      expect(screen.getByText('7 min read')).toBeInTheDocument()
    })

    test('displays word count', () => {
      render(<BlogSidebar readingTimeMinutes={7} wordCount={1750} />)
      expect(screen.getByText('1,750 words')).toBeInTheDocument()
    })

    test('a11y: clock SVG icon has aria-hidden="true"', () => {
      render(<BlogSidebar readingTimeMinutes={7} wordCount={1750} />)
      const clockSvg = screen.getByTestId('clock-icon')
      expect(clockSvg).toHaveAttribute('aria-hidden', 'true')
    })

    test('does not render stats section without readingTimeMinutes', () => {
      render(<BlogSidebar />)
      expect(screen.queryByTestId('sidebar-reading-stats')).not.toBeInTheDocument()
    })
  })

  describe('Recent Posts section', () => {
    const mockRecentPosts: RecentPost[] = [
      { id: '1', title: 'Claude API Caching', href: '/blog/claude-caching', date: '2026-05-14' },
      { id: '2', title: 'Next.js Dark Mode', href: '/blog/dark-mode', date: '2026-05-10' },
      { id: '3', title: 'OpenClaw Release', href: '/blog/openclaw', date: '2026-05-02' },
    ]

    test('renders recent posts section', () => {
      render(<BlogSidebar recentPosts={mockRecentPosts} />)
      expect(screen.getByTestId('sidebar-recent-posts')).toBeInTheDocument()
    })

    test('renders all recent post titles', () => {
      render(<BlogSidebar recentPosts={mockRecentPosts} />)
      expect(screen.getByText('Claude API Caching')).toBeInTheDocument()
      expect(screen.getByText('Next.js Dark Mode')).toBeInTheDocument()
      expect(screen.getByText('OpenClaw Release')).toBeInTheDocument()
    })

    test('renders recent post dates', () => {
      render(<BlogSidebar recentPosts={mockRecentPosts} />)
      expect(screen.getByText('2026-05-14')).toBeInTheDocument()
    })

    test('recent post links are correct', () => {
      render(<BlogSidebar recentPosts={mockRecentPosts} />)
      expect(screen.getByTestId('recent-post-1')).toHaveAttribute('href', '/blog/claude-caching')
    })

    test('does not render section when empty', () => {
      render(<BlogSidebar recentPosts={[]} />)
      expect(screen.queryByTestId('sidebar-recent-posts')).not.toBeInTheDocument()
    })
  })

  describe('Tags section', () => {
    const mockTags: TagItem[] = [
      { id: '1', label: 'Claude API', slug: 'claude-api', count: 5 },
      { id: '2', label: 'Next.js', slug: 'nextjs', count: 3 },
      { id: '3', label: 'TDD', slug: 'tdd', count: 4 },
    ]

    test('renders tags section', () => {
      render(<BlogSidebar tags={mockTags} />)
      expect(screen.getByTestId('sidebar-tags')).toBeInTheDocument()
    })

    test('renders all tag labels', () => {
      render(<BlogSidebar tags={mockTags} />)
      expect(screen.getByText('Claude API')).toBeInTheDocument()
      expect(screen.getByText('Next.js')).toBeInTheDocument()
      expect(screen.getByText('TDD')).toBeInTheDocument()
    })

    test('renders tag counts', () => {
      render(<BlogSidebar tags={mockTags} />)
      expect(screen.getByTestId('tag-count-claude-api')).toHaveTextContent('5')
    })

    test('tag links point to correct href', () => {
      render(<BlogSidebar tags={mockTags} />)
      expect(screen.getByTestId('tag-claude-api')).toHaveAttribute('href', '/blog/tag/claude-api')
    })

    test('does not render section when empty', () => {
      render(<BlogSidebar tags={[]} />)
      expect(screen.queryByTestId('sidebar-tags')).not.toBeInTheDocument()
    })
  })

  describe('Trending Posts section', () => {
    test('renders trending section', () => {
      render(<BlogSidebar trendingPosts={mockTrending} />)
      expect(screen.getByTestId('sidebar-trending')).toBeInTheDocument()
    })

    test('renders trending post titles', () => {
      render(<BlogSidebar trendingPosts={mockTrending} />)
      expect(screen.getByText('Claude vs GPT-4')).toBeInTheDocument()
      expect(screen.getByText('RAG vs Fine-tuning')).toBeInTheDocument()
    })

    test('renders rank numbers', () => {
      render(<BlogSidebar trendingPosts={mockTrending} />)
      expect(screen.getByTestId('trending-rank-1')).toBeInTheDocument()
      expect(screen.getByTestId('trending-rank-2')).toBeInTheDocument()
      expect(screen.getByTestId('trending-rank-3')).toBeInTheDocument()
    })

    test('trending post links are correct', () => {
      render(<BlogSidebar trendingPosts={mockTrending} />)
      const firstLink = screen.getByTestId('trending-post-1')
      expect(firstLink).toHaveAttribute('href', '/blog/claude-vs-gpt4')
    })

    test('does not render trending section when empty', () => {
      render(<BlogSidebar trendingPosts={[]} />)
      expect(screen.queryByTestId('sidebar-trending')).not.toBeInTheDocument()
    })
  })
})
