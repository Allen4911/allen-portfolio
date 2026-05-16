import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogLayout from '../components/blog/BlogLayout'

jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  )
  MockLink.displayName = 'MockLink'
  return MockLink
})

describe('BlogLayout', () => {
  it('renders main content', () => {
    render(
      <BlogLayout sidebar={<div data-testid="sidebar-slot" />}>
        <div data-testid="main-content">포스트 목록</div>
      </BlogLayout>
    )
    expect(screen.getByTestId('main-content')).toBeInTheDocument()
  })

  it('renders sidebar slot', () => {
    render(
      <BlogLayout sidebar={<div data-testid="sidebar-slot" />}>
        <div>content</div>
      </BlogLayout>
    )
    expect(screen.getByTestId('sidebar-slot')).toBeInTheDocument()
  })

  it('renders blog-layout wrapper with correct testid', () => {
    render(
      <BlogLayout sidebar={<div />}>
        <div>content</div>
      </BlogLayout>
    )
    expect(screen.getByTestId('blog-layout')).toBeInTheDocument()
  })

  it('renders without sidebar when not provided', () => {
    render(
      <BlogLayout>
        <div data-testid="main-content">content</div>
      </BlogLayout>
    )
    expect(screen.getByTestId('main-content')).toBeInTheDocument()
  })
})
