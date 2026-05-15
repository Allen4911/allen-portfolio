import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import GlobalNav from '../components/layout/GlobalNav'
import { LanguageProvider } from '../contexts/LanguageContext'

jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }) => <a href={href} {...props}>{children}</a>
  MockLink.displayName = 'MockLink'
  return MockLink
})

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

function Wrapped() {
  return (
    <LanguageProvider>
      <GlobalNav />
    </LanguageProvider>
  )
}

describe('Language toggle in GlobalNav', () => {
  test('renders language toggle button', () => {
    render(<Wrapped />)
    expect(screen.getByRole('button', { name: /Switch to Korean/i })).toBeInTheDocument()
  })

  test('shows KO label when locale is en', () => {
    render(<Wrapped />)
    const btn = screen.getByRole('button', { name: /Switch to Korean/i })
    expect(btn).toHaveTextContent('KO')
  })

  test('clicking toggle shows EN label (locale switched to ko)', () => {
    render(<Wrapped />)
    const btn = screen.getByRole('button', { name: /Switch to Korean/i })
    fireEvent.click(btn)
    const enBtn = screen.getByRole('button', { name: /Switch to English/i })
    expect(enBtn).toHaveTextContent('EN')
  })
})
