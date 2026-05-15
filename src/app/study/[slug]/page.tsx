import { studyNotes, getNoteBySlug } from '@/data/study'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Tag from '@/components/ui/Tag'
import ReactMarkdownRenderer from './ReactMarkdownRenderer'

export async function generateStaticParams() {
  return studyNotes.map((note) => ({ slug: note.slug }))
}

export async function generateMetadata({ params }) {
  const note = getNoteBySlug(params.slug)
  if (!note) return {}
  return {
    title: note.title,
    description: note.excerpt,
  }
}

export default function StudyNotePage({ params }) {
  const note = getNoteBySlug(params.slug)
  if (!note) notFound()

  return (
    <>
      {/* Dark hero header */}
      <section
        style={{
          backgroundColor: '#272729',
          padding: '80px 22px',
        }}
        aria-label={`Study note: ${note.title}`}
      >
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          {/* Back link */}
          <Link
            href="/study"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#2997ff',
              fontSize: '14px',
              letterSpacing: '-0.224px',
              textDecoration: 'none',
              marginBottom: '40px',
            }}
            className="back-link"
          >
            ← Back to Study
          </Link>

          {/* Meta */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
            }}
          >
            <Tag variant="outline-dark">{note.category}</Tag>
            <span style={{ fontSize: '12px', color: '#cccccc' }}>{note.readingTime}</span>
            <span style={{ fontSize: '12px', color: '#7a7a7a' }}>{note.date}</span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '40px',
              fontWeight: '600',
              lineHeight: '1.10',
              letterSpacing: '0',
              color: '#ffffff',
              marginBottom: '20px',
            }}
            className="note-title"
          >
            {note.title}
          </h1>

          {/* Excerpt */}
          <p
            style={{
              fontSize: '17px',
              fontWeight: '400',
              lineHeight: '1.47',
              letterSpacing: '-0.374px',
              color: '#cccccc',
            }}
          >
            {note.excerpt}
          </p>
        </div>
      </section>

      {/* Markdown content — light canvas */}
      <section
        style={{
          backgroundColor: '#ffffff',
          padding: '80px 22px',
          colorScheme: 'light',
          color: '#1d1d1f',
        }}
        aria-label="Note content"
      >
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <ReactMarkdownRenderer content={note.content} />

          {/* Tags */}
          {note.tags && (
            <div
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                marginTop: '48px',
                paddingTop: '32px',
                borderTop: '1px solid #e0e0e0',
              }}
            >
              {note.tags.map((tag) => (
                <Tag key={tag} variant="outline">
                  {tag}
                </Tag>
              ))}
            </div>
          )}

          {/* Back to list */}
          <div style={{ marginTop: '48px' }}>
            <Link href="/study" className="link-primary">
              ← Back to Study Notes
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .back-link:hover {
          text-decoration: underline;
        }
        @media (max-width: 640px) {
          .note-title {
            font-size: 28px !important;
          }
        }
      `}</style>
    </>
  )
}
