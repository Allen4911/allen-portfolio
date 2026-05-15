import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { projects, getProjectById } from '../data/projects'
import ProjectTile from '../components/sections/ProjectTile'

jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }) => <a href={href} {...props}>{children}</a>
  MockLink.displayName = 'MockLink'
  return MockLink
})

jest.mock('../components/ui/Tag', () => {
  const MockTag = ({ children }) => <span>{children}</span>
  MockTag.displayName = 'MockTag'
  return MockTag
})

describe('openclaw-bridge project data', () => {
  const project = getProjectById('openclaw-bridge')!

  it('exists in projects list', () => {
    expect(project).not.toBeNull()
  })

  it('has correct GitHub link', () => {
    expect(project.github).toBe('https://github.com/bettep-dev/openclaw-claude-bridge')
  })

  it('has readmeUrl pointing to GitHub README', () => {
    expect(project.readmeUrl).toBe(
      'https://github.com/bettep-dev/openclaw-claude-bridge#readme'
    )
  })
})

describe('ProjectTile — openclaw-bridge GitHub button', () => {
  it('renders GitHub button with correct href for openclaw-bridge', () => {
    const project = getProjectById('openclaw-bridge')!
    render(<ProjectTile project={project} index={0} />)
    const githubLink = screen.getByText('GitHub').closest('a')
    expect(githubLink).toHaveAttribute('href', 'https://github.com/bettep-dev/openclaw-claude-bridge')
  })
})
