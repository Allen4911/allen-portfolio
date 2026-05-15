import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import HeroSection from '../components/sections/HeroSection'

jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }) => (
    <a href={href} {...props}>{children}</a>
  )
  MockLink.displayName = 'MockLink'
  return MockLink
})

describe('HeroSection', () => {
  test('P1: renders profile image instead of AK text placeholder', () => {
    render(<HeroSection />)
    const img = screen.getByAltText('Allen')
    expect(img).toBeInTheDocument()
    expect(img.tagName).toBe('IMG')
    expect(img).toHaveAttribute('src', expect.stringContaining('profile'))
  })

  test('P2: has two-column layout container on desktop', () => {
    render(<HeroSection />)
    const heroGrid = document.querySelector('[data-testid="hero-grid"]')
    expect(heroGrid).toBeInTheDocument()
  })

  test('P3: shows 18+ years telecom experience text', () => {
    render(<HeroSection />)
    expect(screen.getByText('18+ years telecom')).toBeInTheDocument()
  })
})
