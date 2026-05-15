import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProjectTile from '../components/sections/ProjectTile'
import projects from '../../public/data/projects.json'

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

const baseProject = {
  id: 'test-project',
  title: 'Test Project',
  category: 'Web',
  description: 'A test project',
  tech: ['React'],
  icon: '🧪',
  result: 'Done',
  problem: 'Problem text',
  solution: 'Solution text',
}

describe('SS-01: project screenshot image', () => {
  test('renders img tag when project has image field', () => {
    const { container } = render(
      <ProjectTile
        project={{ ...baseProject, image: '/images/projects/test.svg', github: null, demo: null }}
        index={0}
      />
    )
    const img = container.querySelector('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/images/projects/test.svg')
    expect(img).toHaveAttribute('alt', '')
  })

  test('does not render img tag when project has no image field', () => {
    const { container } = render(
      <ProjectTile project={{ ...baseProject, github: null, demo: null }} index={0} />
    )
    expect(container.querySelector('img')).not.toBeInTheDocument()
  })
})

describe('SS-02: projects.json image fields', () => {
  test('every project has a non-empty image field', () => {
    projects.forEach((project) => {
      expect(project).toHaveProperty('image')
      expect(typeof (project as any).image).toBe('string')
      expect((project as any).image.length).toBeGreaterThan(0)
    })
  })

  test('every project image path points to /images/projects/', () => {
    projects.forEach((project) => {
      expect((project as any).image).toMatch(/^\/images\/projects\//)
    })
  })
})

describe('CR-01: null link guard', () => {
  test('does not render href="null" when both github and demo are null', () => {
    render(<ProjectTile project={{ ...baseProject, github: null, demo: null }} index={0} />)
    screen.queryAllByRole('link').forEach(link => {
      expect(link).not.toHaveAttribute('href', 'null')
    })
  })

  test('does not render GitHub or Live Demo button when both are null', () => {
    render(<ProjectTile project={{ ...baseProject, github: null, demo: null }} index={0} />)
    expect(screen.queryByText('GitHub')).not.toBeInTheDocument()
    expect(screen.queryByText('Live Demo')).not.toBeInTheDocument()
  })

  test('renders GitHub link when github is set and demo is null', () => {
    render(<ProjectTile project={{ ...baseProject, github: 'https://github.com/test', demo: null }} index={0} />)
    expect(screen.getByText('GitHub')).toBeInTheDocument()
  })
})
