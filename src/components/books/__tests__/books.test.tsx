import { render, screen, fireEvent, within } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }) => (
    <a href={href} {...props}>{children}</a>
  )
  MockLink.displayName = 'MockLink'
  return MockLink
})

jest.mock('next/image', () => {
  const MockImage = ({ src, alt }) => <img src={src} alt={alt} />
  MockImage.displayName = 'MockImage'
  return MockImage
})

jest.mock('react-markdown', () => {
  const MockMarkdown = ({ children }) => (
    <div data-testid="markdown-content">{children}</div>
  )
  MockMarkdown.displayName = 'MockMarkdown'
  return MockMarkdown
})

jest.mock('remark-gfm', () => () => {})

jest.mock('../../../../public/data/books.json', () => [
  {
    slug: 'test-book',
    title: '테스트 책',
    description: '테스트 설명입니다',
    cover: '/test-cover.jpg',
    lang: 'ko',
    author: 'Test Author',
    views: 100,
    likes: 5,
    chapters: [
      { id: 'ch1', label: '챕터 1', file: 'ch1.md' },
      { id: 'ch2', label: '챕터 2', file: 'ch2.md' },
    ],
  },
  {
    slug: 'no-cover-book',
    title: '커버 없는 책',
    description: '커버가 없는 책입니다',
    cover: null,
    lang: 'en',
    author: 'Allen Kim',
    views: 50,
    likes: 2,
    chapters: [
      { id: 'ch1', label: 'Chapter 1', file: 'ch1.md' },
    ],
  },
])

import BooksPage from '../../../app/books/page'
import BookLayout from '../BookLayout'
import LikeButton from '../LikeButton'

const mockBook = {
  slug: 'accordion-book',
  title: '아코디언 테스트 책',
  chapters: [
    {
      id: 'parent-1',
      label: '챕터 1',
      children: [
        { id: 'child-1-1', label: '서브 챕터 1-1', file: 'child-1-1.md' },
        { id: 'child-1-2', label: '서브 챕터 1-2', file: 'child-1-2.md' },
      ],
    },
    {
      id: 'parent-2',
      label: '챕터 2',
      children: [
        { id: 'child-2-1', label: '서브 챕터 2-1', file: 'child-2-1.md' },
      ],
    },
  ],
}

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
  localStorage.clear()
})

// ────────────────────────────────────────────────────
// BooksPage 카드 렌더링
// ────────────────────────────────────────────────────
describe('① BooksPage — books.json mock으로 카드 렌더링', () => {
  test('두 권의 책 제목과 설명이 렌더링된다', () => {
    render(<BooksPage />)
    expect(screen.getByRole('heading', { name: '테스트 책', level: 3 })).toBeInTheDocument()
    expect(screen.getByText('테스트 설명입니다')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '커버 없는 책', level: 3 })).toBeInTheDocument()
    expect(screen.getByText('커버가 없는 책입니다')).toBeInTheDocument()
  })

  test('챕터 수가 올바르게 표시된다', () => {
    render(<BooksPage />)
    expect(screen.getByText('2개 챕터 읽기 →')).toBeInTheDocument()
    expect(screen.getByText('1개 챕터 읽기 →')).toBeInTheDocument()
  })
})

// ────────────────────────────────────────────────────
// 카드 메타 — 작가명 / 조회수 / 추천수
// ────────────────────────────────────────────────────
describe('카드 메타 — 작가명 렌더링', () => {
  test('작가명이 표시된다', () => {
    render(<BooksPage />)
    expect(screen.getByText('Test Author')).toBeInTheDocument()
    expect(screen.getAllByText('Allen Kim')).toHaveLength(2)
  })
})

// ────────────────────────────────────────────────────
// BookLayout 렌더링
// ────────────────────────────────────────────────────
describe('② BookLayout — sidebar/accordion/markdown 렌더링', () => {
  test('사이드바 제목, 챕터 트리, 마크다운이 모두 렌더링된다', () => {
    render(
      <BookLayout
        book={mockBook}
        chapterId="child-1-1"
        markdown="# 테스트 마크다운"
        prev={null}
        next={null}
      />
    )
    expect(screen.getByText('아코디언 테스트 책')).toBeInTheDocument()
    expect(screen.getByText('챕터 1')).toBeInTheDocument()
    expect(screen.getByText('챕터 2')).toBeInTheDocument()
    expect(screen.getByTestId('markdown-content')).toBeInTheDocument()
  })
})

// ────────────────────────────────────────────────────
// chapterId 변경 시 expanded useEffect 갱신
// ────────────────────────────────────────────────────
describe('③ chapterId 변경 시 expanded useEffect 갱신', () => {
  test('chapterId가 바뀌면 해당 부모 챕터만 펼쳐진다', () => {
    const { rerender } = render(
      <BookLayout
        book={mockBook}
        chapterId="child-1-1"
        markdown=""
        prev={null}
        next={null}
      />
    )
    expect(screen.getByLabelText('접기')).toBeInTheDocument()
    expect(screen.getByLabelText('펼치기')).toBeInTheDocument()

    rerender(
      <BookLayout
        book={mockBook}
        chapterId="child-2-1"
        markdown=""
        prev={null}
        next={null}
      />
    )
    const expandBtns = screen.getAllByLabelText('펼치기')
    expect(expandBtns).toHaveLength(1)
    expect(screen.getByLabelText('접기')).toBeInTheDocument()
  })
})

// ────────────────────────────────────────────────────
// cover null → gradient placeholder
// ────────────────────────────────────────────────────
describe('④ cover null → gradient placeholder 렌더링', () => {
  test('cover가 null인 책은 📚 placeholder를 표시한다', () => {
    render(<BooksPage />)
    expect(screen.getByText('📚')).toBeInTheDocument()
  })

  test('cover가 있는 책은 img 태그를 렌더링한다', () => {
    render(<BooksPage />)
    expect(screen.getByAltText('테스트 책')).toBeInTheDocument()
  })
})

// ────────────────────────────────────────────────────
// sidebar toggle
// ────────────────────────────────────────────────────
describe('⑤ sidebar toggle', () => {
  test('토글 버튼 클릭 시 사이드바가 열리고 닫힌다', () => {
    const { container } = render(
      <BookLayout
        book={mockBook}
        chapterId="child-1-1"
        markdown=""
        prev={null}
        next={null}
      />
    )
    const sidebar = container.querySelector('.book-sidebar')
    expect(sidebar).not.toHaveClass('sidebar-closed')

    fireEvent.click(screen.getByLabelText('사이드바 토글'))
    expect(sidebar).toHaveClass('sidebar-closed')

    fireEvent.click(screen.getByLabelText('사이드바 토글'))
    expect(sidebar).not.toHaveClass('sidebar-closed')
  })
})

// ────────────────────────────────────────────────────
// 아코디언 토글 버튼
// ────────────────────────────────────────────────────
describe('⑥ 아코디언 토글 버튼 — 자식 챕터 표시/숨김', () => {
  test('닫힌 챕터의 ▸ 버튼 클릭 시 자식 챕터가 표시된다', () => {
    render(
      <BookLayout
        book={mockBook}
        chapterId="child-1-1"
        markdown=""
        prev={null}
        next={null}
      />
    )
    expect(screen.queryByText('서브 챕터 2-1')).not.toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('펼치기'))
    expect(screen.getByText('서브 챕터 2-1')).toBeInTheDocument()
  })

  test('열린 챕터의 ▾ 버튼 클릭 시 자식 챕터가 숨겨진다', () => {
    render(
      <BookLayout
        book={mockBook}
        chapterId="child-1-1"
        markdown=""
        prev={null}
        next={null}
      />
    )
    expect(screen.getByText('서브 챕터 1-1')).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('접기'))
    expect(screen.queryByText('서브 챕터 1-1')).not.toBeInTheDocument()
  })
})

// ────────────────────────────────────────────────────
// LikeButton
// ────────────────────────────────────────────────────
describe('LikeButton — 클릭 시 추천수 증가 + localStorage', () => {
  test('초기 추천수가 표시된다', () => {
    render(<LikeButton slug="test-book" initialLikes={5} />)
    expect(screen.getByTestId('like-count')).toHaveTextContent('5')
  })

  test('클릭 시 추천수가 1 증가한다', () => {
    render(<LikeButton slug="test-book" initialLikes={5} />)
    fireEvent.click(screen.getByLabelText('추천'))
    expect(screen.getByTestId('like-count')).toHaveTextContent('6')
  })

  test('클릭 후 localStorage에 liked 상태와 count가 함께 저장된다', () => {
    render(<LikeButton slug="test-book" initialLikes={5} />)
    fireEvent.click(screen.getByLabelText('추천'))
    expect(localStorage.getItem('book-liked-test-book')).toBe('true')
    expect(localStorage.getItem('book-likes-test-book')).toBe('6')
  })

  test('localStorage에 count가 있으면 새로고침 후 복원된다', () => {
    localStorage.setItem('book-liked-test-book', 'true')
    localStorage.setItem('book-likes-test-book', '8')
    render(<LikeButton slug="test-book" initialLikes={5} />)
    expect(screen.getByTestId('like-count')).toHaveTextContent('8')
  })

  test('이미 liked 상태면 재클릭해도 추천수가 증가하지 않는다', () => {
    localStorage.setItem('book-liked-test-book', 'true')
    render(<LikeButton slug="test-book" initialLikes={5} />)
    fireEvent.click(screen.getByLabelText('추천'))
    expect(screen.getByTestId('like-count')).toHaveTextContent('5')
  })
})

// ────────────────────────────────────────────────────
// 상단 네비게이션
// ────────────────────────────────────────────────────
describe('⑦ BookLayout — 상단 네비게이션', () => {
  const prevChapter = { id: 'child-1-1', label: '서브 챕터 1-1' }
  const nextChapter = { id: 'child-2-1', label: '서브 챕터 2-1' }

  test('← Books 링크가 항상 표시된다', () => {
    render(
      <BookLayout
        book={mockBook}
        chapterId="child-1-1"
        markdown=""
        prev={null}
        next={null}
      />
    )
    const link = document.querySelector('.book-top-nav-list')
    expect(link).toHaveAttribute('href', '/books')
    expect(link).toHaveTextContent('Books')
  })

  test('prev가 있을 때 ← 이전 챕터 링크가 표시된다', () => {
    render(
      <BookLayout
        book={mockBook}
        chapterId="child-1-2"
        markdown=""
        prev={prevChapter}
        next={null}
      />
    )
    const nav = document.querySelector('.book-top-nav') as HTMLElement
    expect(within(nav).getByRole('link', { name: /이전챕터/ })).toBeInTheDocument()
  })

  test('prev가 없을 때 ← 이전 챕터 링크가 표시되지 않는다', () => {
    render(
      <BookLayout
        book={mockBook}
        chapterId="child-1-1"
        markdown=""
        prev={null}
        next={nextChapter}
      />
    )
    const nav = document.querySelector('.book-top-nav') as HTMLElement
    expect(within(nav).queryByRole('link', { name: /이전챕터/ })).not.toBeInTheDocument()
  })

  test('next가 있을 때 → 다음 챕터 링크가 표시된다', () => {
    render(
      <BookLayout
        book={mockBook}
        chapterId="child-1-1"
        markdown=""
        prev={null}
        next={nextChapter}
      />
    )
    const nav = document.querySelector('.book-top-nav') as HTMLElement
    expect(within(nav).getByRole('link', { name: /다음챕터/ })).toBeInTheDocument()
  })

  test('next가 없을 때 → 다음 챕터 링크가 표시되지 않는다', () => {
    render(
      <BookLayout
        book={mockBook}
        chapterId="child-2-1"
        markdown=""
        prev={prevChapter}
        next={null}
      />
    )
    const nav = document.querySelector('.book-top-nav') as HTMLElement
    expect(within(nav).queryByRole('link', { name: /다음챕터/ })).not.toBeInTheDocument()
  })
})
