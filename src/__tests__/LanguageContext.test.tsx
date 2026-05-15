import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext'

function TestConsumer() {
  const { locale, toggleLanguage } = useLanguage()
  return (
    <>
      <span data-testid="locale">{locale}</span>
      <button onClick={toggleLanguage}>toggle</button>
    </>
  )
}

describe('LanguageContext', () => {
  test('default locale is en', () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    )
    expect(screen.getByTestId('locale')).toHaveTextContent('en')
  })

  test('toggleLanguage switches en → ko', () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    )
    fireEvent.click(screen.getByRole('button', { name: 'toggle' }))
    expect(screen.getByTestId('locale')).toHaveTextContent('ko')
  })

  test('toggleLanguage switches ko → en', () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    )
    fireEvent.click(screen.getByRole('button', { name: 'toggle' }))
    fireEvent.click(screen.getByRole('button', { name: 'toggle' }))
    expect(screen.getByTestId('locale')).toHaveTextContent('en')
  })

  test('useLanguage throws without LanguageProvider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<TestConsumer />)).toThrow()
    spy.mockRestore()
  })
})
