import Link from 'next/link'
import Tag from '@/components/ui/Tag'

function ProjectVisual({ project, isDark }) {
  const surface = isDark ? 'var(--color-ink)' : 'var(--color-surface-pearl)'
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  const muted = isDark ? 'var(--color-body-muted)' : 'var(--color-ink-muted-48)'
  const ink = isDark ? 'var(--color-on-dark)' : 'var(--color-ink)'
  const innerCardBg = isDark ? 'var(--color-surface-tile-3)' : 'var(--color-canvas)'

  if (project.image) {
    return (
      <div
        className={`product-frame ${isDark ? 'product-frame-dark' : ''}`}
        style={{
          width: '100%',
          maxWidth: '620px',
          margin: '0 auto 40px',
          backgroundColor: surface,
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <img
          src={project.image}
          alt=""
          style={{ width: '100%', display: 'block', objectFit: 'cover' }}
        />
      </div>
    )
  }

  return (
    <div
      className={`product-frame ${isDark ? 'product-frame-dark' : ''}`}
      style={{
        width: '100%',
        maxWidth: '620px',
        margin: '0 auto 40px',
        backgroundColor: surface,
      }}
      aria-hidden="true"
    >
      <div
        style={{
          minHeight: '310px',
          display: 'grid',
          gridTemplateColumns: '0.85fr 1.15fr',
        }}
        className="project-visual-grid"
      >
        <div
          style={{
            borderRight: `1px solid ${border}`,
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            textAlign: 'left',
          }}
        >
          <div>
            <p className="text-caption" style={{ color: muted, marginBottom: '10px' }}>
              Featured project
            </p>
            <p
              style={{
                color: ink,
                fontSize: '34px',
                fontWeight: 600,
                lineHeight: 1.1,
                letterSpacing: '-0.28px',
                margin: 0,
              }}
            >
              {project.icon}
            </p>
          </div>
          <p className="text-caption" style={{ color: muted }}>
            {project.result}
          </p>
        </div>
        <div
          style={{
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '12px',
            textAlign: 'left',
          }}
        >
          {[project.problem, project.solution].map((copy, i) => (
            <div
              key={copy}
              style={{
                border: `1px solid ${border}`,
                borderRadius: '11px',
                padding: '16px',
                backgroundColor: innerCardBg,
              }}
            >
              <p
                className="text-caption-strong"
                style={{
                  color: i === 0 ? muted : 'var(--color-primary)',
                  marginBottom: '6px',
                }}
              >
                {i === 0 ? 'Problem' : 'Solution'}
              </p>
              <p className="text-caption" style={{ color: ink, margin: 0 }}>
                {copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ProjectTile({ project, index }) {
  const isDark = index % 2 !== 0
  const isParchment = !isDark && index % 3 === 2

  const tileClass = isDark ? 'tile-dark' : isParchment ? 'tile-parchment' : 'tile-light'
  const descColor = isDark ? 'var(--color-body-muted)' : 'var(--color-ink-muted-48)'
  const categoryColor = isDark ? 'var(--color-primary-on-dark)' : 'var(--color-primary)'

  return (
    <section
      aria-label={`Project: ${project.title}`}
      className={tileClass}
      style={{ width: '100%', paddingLeft: '22px', paddingRight: '22px' }}
    >
      <div
        style={{
          maxWidth: '980px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <div>
          <p className="text-tagline" style={{ color: categoryColor, marginBottom: '12px' }}>
            {project.category}
          </p>

          <h2
            className="text-display-lg project-tile-title"
            style={{ marginBottom: '16px' }}
          >
            {project.title}
          </h2>

          <p
            className="text-lead project-tile-desc"
            style={{ color: descColor, margin: '0 auto 32px', maxWidth: '720px' }}
          >
            {project.description}
          </p>

          <div
            style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '40px',
            }}
          >
            {project.tech.map((t) => (
              <Tag key={t} variant={isDark ? 'outline-dark' : 'outline'}>
                {t}
              </Tag>
            ))}
          </div>

          <ProjectVisual project={project} isDark={isDark} />

          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link href={`/projects/${project.id}`} className="btn-primary">
              View Details
            </Link>
            {project.demo ? (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className={isDark ? 'btn-secondary-dark' : 'btn-secondary'}
              >
                Live Demo
              </a>
            ) : project.github ? (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className={isDark ? 'btn-secondary-dark' : 'btn-secondary'}
              >
                GitHub
              </a>
            ) : null}
          </div>
        </div>
      </div>

    </section>
  )
}
