import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BooksSection from './BooksSection'

jest.mock('next/image', () => {
  const MockImage = ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  )
  MockImage.displayName = 'MockImage'
  return MockImage
})

jest.mock('@/data/books', () => ({
  books: [
    { id: 'jump-to-python', title: '점프 투 파이썬', author: '박응용', views: 25415, likes: 7811, cover: null },
    { id: 'claude-code-guide', title: '클로드 코드 가이드', author: '박재홍', views: 24286, likes: 255, cover: null },
  ],
}))

describe('BooksSection', () => {
  test('섹션 제목 "Books"가 렌더링된다', () => {
    render(<BooksSection />)
    expect(screen.getByRole('heading', { name: 'Books' })).toBeInTheDocument()
  })

  test('두 권의 책 제목이 모두 렌더링된다', () => {
    render(<BooksSection />)
    expect(screen.getByText('점프 투 파이썬')).toBeInTheDocument()
    expect(screen.getByText('클로드 코드 가이드')).toBeInTheDocument()
  })

  test('저자명이 렌더링된다', () => {
    render(<BooksSection />)
    expect(screen.getByText('박응용')).toBeInTheDocument()
    expect(screen.getByText('박재홍')).toBeInTheDocument()
  })

  test('조회수가 포맷되어 렌더링된다', () => {
    render(<BooksSection />)
    expect(screen.getByText('25,415')).toBeInTheDocument()
    expect(screen.getByText('24,286')).toBeInTheDocument()
  })

  test('추천수가 포맷되어 렌더링된다', () => {
    render(<BooksSection />)
    expect(screen.getByText('7,811')).toBeInTheDocument()
    expect(screen.getByText('255')).toBeInTheDocument()
  })

  test('cover가 없으면 📚 placeholder가 렌더링된다', () => {
    render(<BooksSection />)
    const placeholders = screen.getAllByText('📚')
    expect(placeholders).toHaveLength(2)
  })
})
