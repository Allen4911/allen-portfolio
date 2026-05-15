import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import AboutPage from '../app/about/page'

jest.mock('next/image', () => {
  const MockImage = ({ src, alt, width, height, ...props }: { src: string; alt: string; width?: number; height?: number; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} {...props} />
  )
  MockImage.displayName = 'MockImage'
  return MockImage
})

jest.mock('../components/sections/SkillsGrid', () => {
  const MockSkillsGrid = () => <div data-testid="skills-grid" />
  MockSkillsGrid.displayName = 'MockSkillsGrid'
  return MockSkillsGrid
})

describe('AboutPage — P2-2 profile photo', () => {
  test('renders profile image with alt="Allen"', () => {
    render(<AboutPage />)
    const img = screen.getByAltText('Allen')
    expect(img).toBeInTheDocument()
    expect(img.tagName).toBe('IMG')
    expect(img).toHaveAttribute('src', expect.stringContaining('profile'))
  })

  test('profile image has data-testid="about-profile-image"', () => {
    render(<AboutPage />)
    const img = screen.getByTestId('about-profile-image')
    expect(img).toBeInTheDocument()
  })

  test('profile image has explicit width and height for Next.js Image optimization', () => {
    render(<AboutPage />)
    const img = screen.getByTestId('about-profile-image')
    expect(img).toHaveAttribute('width')
    expect(img).toHaveAttribute('height')
  })
})
