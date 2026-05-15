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
  isDark?: boolean
}

export default function StudyCard({ note, index = 0, isDark = false }: StudyCardProps) {
  const headingColor = isDark ? 'var(--color-on-dark)' : 'var(--color-ink)'
  const subColor = isDark ? 'var(--color-body-muted)' : 'var(--color-ink-muted-48)'

  return (
    <article>
      <Link
        href={`/study/${note.slug}`}
        style={{ textDecoration: 'none', display: 'block' }}
        className="study-card-link"
      >
        <div
          className={isDark ? 'study-card-inner' : 'card-utility study-card-inner'}
          style={{
            ...(isDark && {
              backgroundColor: '#1a1a1c',
              border: '1px solid #3a3a3c',
              borderRadius: '18px',
              padding: '24px',
            }),
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            transition: 'transform 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Tag variant={isDark ? 'outline-dark' : 'default'}>{note.category}</Tag>
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
                <Tag key={tag} variant={isDark ? 'outline-dark' : 'outline'}>
                  {tag}
                </Tag>
              ))}
            </div>
          )}
        </div>
      </Link>

      <style>{`
        .study-card-link:hover .study-card-inner {
          transform: translateY(-2px);
        }
      `}</style>
    </article>
  )
}
