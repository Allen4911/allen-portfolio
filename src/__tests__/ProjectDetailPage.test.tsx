/**
 * TDD: ProjectDetailPage — readmeUrl 버튼 렌더링 검증
 * Tests written BEFORE implementation check.
 */
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProjectDetailPage from '../app/projects/[id]/page'

jest.mock('next/navigation', () => ({
  notFound: () => { throw new Error('NEXT_NOT_FOUND') },
}))

jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>
  MockLink.displayName = 'MockLink'
  return MockLink
})

jest.mock('../components/ui/Tag', () => {
  const MockTag = ({ children }: any) => <span>{children}</span>
  MockTag.displayName = 'MockTag'
  return MockTag
})

jest.mock('../data/projects', () => ({
  projects: [
    { id: 'with-readme', title: 'With README', category: 'Test', description: 'desc', longDescription: 'long', tech: [], github: null, demo: null, featured: false, readmeUrl: 'https://github.com/test#readme' },
    { id: 'no-readme', title: 'No README', category: 'Test', description: 'desc', longDescription: 'long', tech: [], github: null, demo: null, featured: false },
  ],
  getProjectById: (id: string) => {
    const map: Record<string, any> = {
      'with-readme': { id: 'with-readme', title: 'With README', category: 'Test', description: 'desc', longDescription: 'long', tech: [], github: null, demo: null, featured: false, readmeUrl: 'https://github.com/test#readme' },
      'no-readme': { id: 'no-readme', title: 'No README', category: 'Test', description: 'desc', longDescription: 'long', tech: [], github: null, demo: null, featured: false },
    }
    return map[id] ?? null
  },
}))

describe('ProjectDetailPage — View README 버튼', () => {
  it('readmeUrl이 있을 때 View README 버튼을 렌더링한다', () => {
    render(<ProjectDetailPage params={{ id: 'with-readme' }} />)
    const btn = screen.getByRole('link', { name: /view readme/i })
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveAttribute('href', 'https://github.com/test#readme')
  })

  it('readmeUrl이 없을 때 View README 버튼을 렌더링하지 않는다', () => {
    render(<ProjectDetailPage params={{ id: 'no-readme' }} />)
    expect(screen.queryByRole('link', { name: /view readme/i })).not.toBeInTheDocument()
  })
})
