import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import DarkModeToggle from '../components/ui/DarkModeToggle'

describe('DarkModeToggle', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
  })

  test('renders toggle button', () => {
    render(<DarkModeToggle />)
    expect(screen.getByRole('button', { name: /dark mode|light mode/i })).toBeInTheDocument()
  })

  test('clicking adds dark class to <html>', () => {
    render(<DarkModeToggle />)
    fireEvent.click(screen.getByRole('button'))
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  test('clicking again removes dark class from <html>', () => {
    render(<DarkModeToggle />)
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByRole('button'))
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  test('shows light mode label when dark mode is active', () => {
    render(<DarkModeToggle />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button', { name: /light mode/i })).toBeInTheDocument()
  })

  test('shows dark mode label when light mode is active', () => {
    render(<DarkModeToggle />)
    expect(screen.getByRole('button', { name: /dark mode/i })).toBeInTheDocument()
  })
})
