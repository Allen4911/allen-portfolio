'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function findParentId(chapters, chapterId) {
  for (const ch of chapters) {
    if (ch.children?.some((c) => c.id === chapterId)) return ch.id
  }
  return null
}

function initExpanded(chapters, chapterId) {
  const parentId = findParentId(chapters, chapterId)
  const init = {}
  for (const ch of chapters) {
    init[ch.id] = ch.id === parentId || ch.id === chapterId
  }
  return init
}

export default function BookLayout({ book, chapterId, markdown, prev, next }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expanded, setExpanded] = useState(() => initExpanded(book.chapters, chapterId))
  const [isMobile, setIsMobile] = useState(false)

  // ① 챕터 이동 시 expanded 갱신
  useEffect(() => {
    setExpanded(initExpanded(book.chapters, chapterId))
  }, [chapterId, book.chapters])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const handler = (e) => {
      setIsMobile(e.matches)
      if (e.matches) setSidebarOpen(false)
    }
    setIsMobile(mq.matches)
    if (mq.matches) setSidebarOpen(false)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggleChapter = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="book-layout">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="book-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`book-sidebar${sidebarOpen ? '' : ' sidebar-closed'}`}>
        {/* Book title */}
        <div className="sidebar-header">
          <Link href="/books" className="sidebar-back">← Books</Link>
          <div className="sidebar-title">{book.title}</div>
          <button
            className="sidebar-toggle-inside"
            onClick={() => setSidebarOpen(false)}
            aria-label="사이드바 닫기"
          >
            ✕
          </button>
        </div>

        {/* Chapter tree */}
        <nav className="sidebar-nav">
          {book.chapters.map((ch) => {
            const isParentActive = ch.id === chapterId
            const hasChildren = ch.children?.length > 0
            const isExpanded = expanded[ch.id]

            return (
              <div key={ch.id} className="sidebar-group">
                <div className="sidebar-parent-row">
                  <Link
                    href={`/books/${book.slug}/${ch.id}`}
                    className={`sidebar-chapter${isParentActive ? ' active' : ''}`}
                  >
                    {ch.label}
                  </Link>
                  {hasChildren && (
                    <button
                      className="sidebar-arrow"
                      onClick={() => toggleChapter(ch.id)}
                      aria-label={isExpanded ? '접기' : '펼치기'}
                    >
                      {isExpanded ? '▾' : '▸'}
                    </button>
                  )}
                </div>

                {hasChildren && isExpanded && (
                  <ul className="sidebar-children">
                    {ch.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={`/books/${book.slug}/${child.id}`}
                          className={`sidebar-child${child.id === chapterId ? ' active' : ''}`}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="book-main-wrapper">
        {/* Toggle button (outside sidebar) */}
        <button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label="사이드바 토글"
        >
          {sidebarOpen && !isMobile ? '◀' : '☰'}
        </button>

        <main className="book-main">
          {/* 상단 네비게이션 */}
          <nav className="book-top-nav">
            {prev ? (
              <Link href={`/books/${book.slug}/${prev.id}`} className="book-top-nav-btn">
                <span className="book-nav-label">← 이전챕터</span>
                <span className="book-nav-title">{prev.label}</span>
              </Link>
            ) : <span />}
            <Link href="/books" className="book-top-nav-btn book-top-nav-list">
              ← Books
            </Link>
            {next ? (
              <Link href={`/books/${book.slug}/${next.id}`} className="book-top-nav-btn book-top-nav-right">
                <span className="book-nav-label">다음챕터 →</span>
                <span className="book-nav-title">{next.label}</span>
              </Link>
            ) : <span />}
          </nav>

          {/* ④ useMemo로 markdown 리렌더 최소화 */}
          <article className="book-content">
            {useMemo(() => (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
            ), [markdown])}
          </article>

          {/* Prev / Next */}
          <div className="book-pagination">
            {prev ? (
              <Link href={`/books/${book.slug}/${prev.id}`} className="book-page-btn book-page-prev">
                <span className="book-nav-label">← 이전챕터</span>
                <span className="book-nav-title">{prev.label}</span>
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/books/${book.slug}/${next.id}`} className="book-page-btn book-page-next">
                <span className="book-nav-label">다음챕터 →</span>
                <span className="book-nav-title">{next.label}</span>
              </Link>
            ) : <span />}
          </div>
        </main>
      </div>
    </div>
  )
}
