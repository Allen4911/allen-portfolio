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
  return <LanguageProvider><GlobalNav /></LanguageProvider>
}

describe('CR-03: mobile menu display style', () => {
  test('mobile menu does not have display:none inline style when open', () => {
    render(<Wrapped />)
    fireEvent.click(screen.getByLabelText('Open menu'))
    const dialog = screen.getByRole('dialog')
    expect(dialog).not.toHaveStyle({ display: 'none' })
  })

  test('mobile menu is present in DOM when menuOpen is true', () => {
    render(<Wrapped />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Open menu'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})

describe('WR-01: hamburger button display style', () => {
  test('hamburger button does not have display:none inline style', () => {
    render(<Wrapped />)
    const btn = screen.getByLabelText('Open menu')
    expect(btn).not.toHaveStyle({ display: 'none' })
  })

  test('WR-01b: hamburger button has hamburger-btn class for CSS-based visibility', () => {
    render(<Wrapped />)
    const btn = screen.getByLabelText('Open menu')
    expect(btn).toHaveClass('hamburger-btn')
  })
})
