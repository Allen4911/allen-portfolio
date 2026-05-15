import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import ContactForm from '../components/contact/ContactForm'

describe('ContactForm', () => {
  test('renders name, email, message fields and submit button', () => {
    render(<ContactForm />)
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  test('submit button is disabled when fields are empty', () => {
    render(<ContactForm />)
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled()
  })

  test('submit button is enabled when all fields are filled', () => {
    render(<ContactForm />)
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Allen' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'allen@test.com' } })
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Hello' } })
    expect(screen.getByRole('button', { name: /send/i })).toBeEnabled()
  })

  test('submit button disabled for invalid email format (no @ symbol)', () => {
    render(<ContactForm />)
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Allen' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'not-an-email' } })
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Hello' } })
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled()
  })

  test('shows success message after successful submit', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true })
    render(<ContactForm />)
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Allen' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'allen@test.com' } })
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Hello there' } })
    fireEvent.click(screen.getByRole('button', { name: /send/i }))
    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument()
    })
    ;(global.fetch as jest.Mock).mockRestore?.()
  })

  test('shows error message when submit fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false })
    render(<ContactForm />)
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Allen' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'allen@test.com' } })
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Hello' } })
    fireEvent.click(screen.getByRole('button', { name: /send/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
    ;(global.fetch as jest.Mock).mockRestore?.()
  })

  // ① aria-required
  test('name, email, message fields have aria-required="true"', () => {
    render(<ContactForm />)
    expect(screen.getByLabelText(/name/i)).toHaveAttribute('aria-required', 'true')
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-required', 'true')
    expect(screen.getByLabelText(/message/i)).toHaveAttribute('aria-required', 'true')
  })

  // ② isComplete 형식 검증 — 공백만 입력 시 버튼 비활성
  test('submit button stays disabled when fields contain only whitespace', () => {
    render(<ContactForm />)
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: '   ' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'allen@test.com' } })
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: '   ' } })
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled()
  })

  test('submit button stays disabled when email format is clearly invalid', () => {
    render(<ContactForm />)
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Allen' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'notanemail' } })
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Hello' } })
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled()
  })
})
