import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProjectsCarousel from '../components/sections/ProjectsCarousel'

jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }) => (
    <a href={href} {...props}>{children}</a>
  )
  MockLink.displayName = 'MockLink'
  return MockLink
})

const mockScrollNext = jest.fn()
const mockScrollPrev = jest.fn()
const mockScrollTo = jest.fn()
const mockOn = jest.fn()
const mockOff = jest.fn()
const mockSelectedScrollSnap = jest.fn()
const mockCanScrollPrev = jest.fn()
const mockCanScrollNext = jest.fn()

jest.mock('embla-carousel-react', () =>
  jest.fn(() => [
    jest.fn(),
    {
      scrollNext: mockScrollNext,
      scrollPrev: mockScrollPrev,
      scrollTo: mockScrollTo,
      on: mockOn,
      off: mockOff,
      selectedScrollSnap: mockSelectedScrollSnap,
      canScrollPrev: mockCanScrollPrev,
      canScrollNext: mockCanScrollNext,
    },
  ])
)

const mockProjects = [
  {
    id: 'p1',
    title: 'Alpha Project',
    category: 'Web App',
    description: 'First project description',
    tech: ['React'],
    icon: '🚀',
    result: 'Shipped on time',
    problem: 'Legacy system',
    solution: 'Modern stack',
    github: 'https://github.com',
  },
  {
    id: 'p2',
    title: 'Beta Project',
    category: 'Mobile',
    description: 'Second project description',
    tech: ['React Native'],
    icon: '📱',
    result: '2x faster',
    problem: 'Slow app',
    solution: 'Optimized',
    github: 'https://github.com',
  },
  {
    id: 'p3',
    title: 'Gamma Project',
    category: 'AI',
    description: 'Third project description',
    tech: ['Python'],
    icon: '🤖',
    result: 'Saved 10h/week',
    problem: 'Manual work',
    solution: 'Automated',
    github: 'https://github.com',
  },
]

beforeEach(() => {
  jest.clearAllMocks()
  mockSelectedScrollSnap.mockReturnValue(0)
  mockCanScrollPrev.mockReturnValue(false)
  mockCanScrollNext.mockReturnValue(true)
})

describe('ProjectsCarousel', () => {
  test('renders first project on initial load', () => {
    render(<ProjectsCarousel projects={mockProjects} />)
    expect(screen.getByText('Alpha Project')).toBeInTheDocument()
  })

  test('calls scrollNext when next button is clicked', () => {
    render(<ProjectsCarousel projects={mockProjects} />)
    fireEvent.click(screen.getByLabelText('Next project'))
    expect(mockScrollNext).toHaveBeenCalledTimes(1)
  })

  test('disables next button on last card', () => {
    mockCanScrollNext.mockReturnValue(false)
    render(<ProjectsCarousel projects={mockProjects} />)
    expect(screen.getByLabelText('Next project')).toBeDisabled()
  })
})

describe('CR-02: no global window keydown listener', () => {
  test('does not attach keydown listener to window', () => {
    const addSpy = jest.spyOn(window, 'addEventListener')
    render(<ProjectsCarousel projects={mockProjects} />)
    const keydownCalls = addSpy.mock.calls.filter(([event]) => event === 'keydown')
    expect(keydownCalls.length).toBe(0)
    addSpy.mockRestore()
  })
})

describe('WR-03: onKeyDown e.target guard', () => {
  test('does not call scrollNext when ArrowRight fires on a child element', () => {
    render(<ProjectsCarousel projects={mockProjects} />)
    const carousel = document.querySelector('[tabindex="0"]')!
    const child = carousel.querySelector('a') ?? carousel.firstChild
    fireEvent.keyDown(child!, { key: 'ArrowRight', bubbles: true })
    expect(mockScrollNext).not.toHaveBeenCalled()
  })

  test('calls scrollNext when ArrowRight fires on the carousel container itself', () => {
    render(<ProjectsCarousel projects={mockProjects} />)
    const carousel = document.querySelector('[tabindex="0"]')!
    fireEvent.keyDown(carousel, { key: 'ArrowRight' })
    expect(mockScrollNext).toHaveBeenCalledTimes(1)
  })
})
