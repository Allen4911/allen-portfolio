'use client'

import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogClientPage from '../app/blog/BlogClientPage'
import { blogPosts, blogCategories } from '../data/blogPosts'

jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  )
  MockLink.displayName = 'MockLink'
  return MockLink
})

const categories = ['All', ...Array.from(new Set(blogPosts.map((p) => p.category)))]

describe('BlogClientPage', () => {
  it('renders all posts by default', () => {
    render(<BlogClientPage posts={blogPosts} categories={categories} />)
    const postList = screen.getByTestId('blog-post-list')
    expect(postList.children.length).toBe(blogPosts.length)
  })

  it('renders category filter buttons', () => {
    render(<BlogClientPage posts={blogPosts} categories={categories} />)
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'AI / LLM' })).toBeInTheDocument()
  })

  it('filters posts when a category is selected', () => {
    render(<BlogClientPage posts={blogPosts} categories={categories} />)
    fireEvent.click(screen.getByRole('button', { name: 'AI / LLM' }))
    const postList = screen.getByTestId('blog-post-list')
    const aiPosts = blogPosts.filter((p) => p.category === 'AI / LLM')
    expect(postList.children.length).toBe(aiPosts.length)
  })

  it('shows all posts when All is selected after a category', () => {
    render(<BlogClientPage posts={blogPosts} categories={categories} />)
    fireEvent.click(screen.getByRole('button', { name: 'AI / LLM' }))
    fireEvent.click(screen.getByRole('button', { name: 'All' }))
    const postList = screen.getByTestId('blog-post-list')
    expect(postList.children.length).toBe(blogPosts.length)
  })

  it('marks All as active by default', () => {
    render(<BlogClientPage posts={blogPosts} categories={categories} />)
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('marks selected category as active', () => {
    render(<BlogClientPage posts={blogPosts} categories={categories} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next.js' }))
    expect(screen.getByRole('button', { name: 'Next.js' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false')
  })

  describe('search', () => {
    it('renders a search input', () => {
      render(<BlogClientPage posts={blogPosts} categories={categories} />)
      expect(screen.getByRole('searchbox')).toBeInTheDocument()
    })

    it('filters posts by title keyword', () => {
      render(<BlogClientPage posts={blogPosts} categories={categories} />)
      fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Claude API' } })
      const postList = screen.getByTestId('blog-post-list')
      expect(postList.children.length).toBe(1)
      expect(screen.getByText(/Claude API와 Prompt Caching/)).toBeInTheDocument()
    })

    it('filters posts by excerpt keyword', () => {
      render(<BlogClientPage posts={blogPosts} categories={categories} />)
      fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'tmux' } })
      const postList = screen.getByTestId('blog-post-list')
      expect(postList.children.length).toBe(1)
      expect(screen.getByRole('heading', { name: /OpenClaw/ })).toBeInTheDocument()
    })

    it('shows all posts when search is cleared', () => {
      render(<BlogClientPage posts={blogPosts} categories={categories} />)
      fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Claude' } })
      fireEvent.change(screen.getByRole('searchbox'), { target: { value: '' } })
      const postList = screen.getByTestId('blog-post-list')
      expect(postList.children.length).toBe(blogPosts.length)
    })

    it('is case-insensitive', () => {
      render(<BlogClientPage posts={blogPosts} categories={categories} />)
      fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'claude api' } })
      const postList = screen.getByTestId('blog-post-list')
      expect(postList.children.length).toBe(1)
    })

    it('combines search with category filter', () => {
      render(<BlogClientPage posts={blogPosts} categories={categories} />)
      fireEvent.click(screen.getByRole('button', { name: 'AI / LLM' }))
      fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Claude' } })
      const postList = screen.getByTestId('blog-post-list')
      expect(postList.children.length).toBe(1)
    })
  })
})
