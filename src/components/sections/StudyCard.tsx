import Link from 'next/link'
import Tag from '@/components/ui/Tag'

interface StudyNote {
  slug: string
  title: string
  category: string
  date: string
  readingTime: string
  excerpt: string
  tags?: string[]
}

interface StudyCardProps {
  note: StudyNote
  index?: number
}

export default function StudyCard({ note, index = 0 }: StudyCardProps) {
  const headingColor = 'var(--color-ink)'
  const subColor = 'var(--color-ink-muted-48)'

  return (
    <article>
      <Link
        href={`/study/${note.slug}`}
        style={{ textDecoration: 'none', display: 'block' }}
        className="study-card-link"
      >
        <div
          className="card-utility study-card-inner"
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            transition: 'transform 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Tag variant="default">{note.category}</Tag>
            <span className="text-fine-print" style={{ color: subColor }}>
              {note.readingTime}
            </span>
          </div>

          <p className="text-fine-print" style={{ color: subColor }}>
            {note.date}
          </p>

          <h3 className="text-body-strong" style={{ color: headingColor, margin: 0 }}>
            {note.title}
          </h3>

          <p
            className="text-caption"
            style={{
              color: subColor,
              margin: 0,
              flexGrow: 1,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {note.excerpt}
          </p>

          {note.tags && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: 'auto' }}>
              {note.tags.slice(0, 3).map((tag) => (
                <Tag key={tag} variant="outline">
                  {tag}
                </Tag>
              ))}
            </div>
          )}
        </div>
      </Link>

      <style>{`
        .study-card-link:hover .study-card-inner {
          box-shadow: var(--shadow-subtle);
        }
      `}</style>
    </article>
  )
}
