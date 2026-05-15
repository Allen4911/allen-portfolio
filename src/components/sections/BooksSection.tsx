import { books } from '@/data/books'

interface BooksSectionProps {
  id?: string
}

export default function BooksSection({ id }: BooksSectionProps) {
  return (
    <section
      id={id}
      aria-label="Books"
      className="tile-parchment"
      style={{ paddingLeft: '22px', paddingRight: '22px' }}
    >
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 className="text-display-lg" style={{ marginBottom: '12px' }}>
            Books
          </h2>
          <p className="text-body" style={{ color: 'var(--color-ink-muted-48)' }}>
            직접 읽고 정리한 책 노트
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '24px',
          }}
        >
          {books.map((book) => (
            <div
              key={book.id}
              className="card-utility"
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div
                style={{
                  width: '100%',
                  aspectRatio: '3/4',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: 'var(--color-canvas-parchment)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                }}
              >
                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={book.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span>📚</span>
                )}
              </div>

              <p className="text-body-strong">{book.title}</p>
              <p className="text-nav-link" style={{ color: 'var(--color-ink-muted-48)' }}>
                {book.author}
              </p>

              <div style={{ display: 'flex', gap: '16px' }}>
                <span className="text-nav-link" style={{ color: 'var(--color-ink-muted-48)' }}>
                  조회 <strong>{book.views.toLocaleString()}</strong>
                </span>
                <span className="text-nav-link" style={{ color: 'var(--color-ink-muted-48)' }}>
                  추천 <strong>{book.likes.toLocaleString()}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
