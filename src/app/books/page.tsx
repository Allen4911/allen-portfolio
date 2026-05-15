import Link from 'next/link'
import Image from 'next/image'
import booksData from '../../../public/data/books.json'

export const metadata = {
  title: 'Books',
  description: '직접 쓴 책들을 모아둔 곳입니다.',
}

export default function BooksPage() {
  return (
    <section style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 22px 80px' }}>
      <p className="text-tagline" style={{ color: 'var(--color-primary)', marginBottom: '12px' }}>
        Books
      </p>
      <h1
        style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          marginBottom: '8px',
          color: 'var(--color-ink)',
        }}
      >
        내가 쓴 책
      </h1>
      <p style={{ color: 'var(--color-ink-muted-48)', marginBottom: '48px' }}>
        Allen
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '28px',
        }}
      >
        {booksData.map((book) => (
          <Link
            key={book.slug}
            href={`/books/${book.slug}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
              style={{
                border: '1px solid var(--color-hairline)',
                borderRadius: '12px',
                overflow: 'hidden',
                background: 'var(--color-canvas)',
                transition: 'box-shadow 0.2s',
              }}
            >
              {/* Cover */}
              <div
                style={{
                  width: '100%',
                  height: '180px',
                  background: 'var(--color-canvas-parchment)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {book.cover ? (
                  <Image
                    src={book.cover}
                    alt={book.title}
                    width={120}
                    height={160}
                    style={{ objectFit: 'cover', height: '100%', width: 'auto' }}
                  />
                ) : (
                  <span style={{ fontSize: '3rem' }}>📚</span>
                )}
              </div>

              {/* Card body */}
              <div style={{ padding: '20px' }}>
                <h3
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    marginBottom: '8px',
                    color: 'var(--color-ink)',
                  }}
                >
                  {book.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--color-ink-muted-48)',
                    marginBottom: '12px',
                    lineHeight: 1.5,
                  }}
                >
                  {book.description}
                </p>
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-ink-muted-48)',
                    marginBottom: '16px',
                  }}
                >
                  {book.author}
                </p>
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--color-primary)',
                  }}
                >
                  {book.chapters.length}개 챕터 읽기 →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
