import Link from 'next/link'
import Tag from '@/components/ui/Tag'

function ProjectVisual({ project }) {
  if (project.image) {
    return (
      <div
        className="product-frame"
        style={{
          width: '100%',
          maxWidth: '620px',
          margin: '0 auto 40px',
          backgroundColor: 'var(--color-surface-pearl)',
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
      className="product-frame"
      style={{
        width: '100%',
        maxWidth: '620px',
        margin: '0 auto 40px',
        backgroundColor: 'var(--color-surface-pearl)',
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
            borderRight: '1px solid rgba(0,0,0,0.08)',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            textAlign: 'left',
          }}
        >
          <div>
            <p className="text-caption" style={{ color: 'var(--color-ink-muted-48)', marginBottom: '10px' }}>
              Featured project
            </p>
            <p
              style={{
                color: 'var(--color-ink)',
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
          <p className="text-caption" style={{ color: 'var(--color-ink-muted-48)' }}>
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
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '11px',
                padding: '16px',
                backgroundColor: 'var(--color-canvas)',
              }}
            >
              <p
                className="text-caption-strong"
                style={{
                  color: i === 0 ? 'var(--color-ink-muted-48)' : 'var(--color-primary)',
                  marginBottom: '6px',
                }}
              >
                {i === 0 ? 'Problem' : 'Solution'}
              </p>
              <p className="text-caption" style={{ color: 'var(--color-ink)', margin: 0 }}>
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
  const tileClass = index % 2 === 0 ? 'tile-light' : 'tile-parchment'

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
          <p className="text-tagline" style={{ color: 'var(--color-primary)', marginBottom: '12px' }}>
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
            style={{ color: 'var(--color-charcoal-whisper)', margin: '0 auto 32px', maxWidth: '720px' }}
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
              <Tag key={t} variant="outline">
                {t}
              </Tag>
            ))}
          </div>

          <ProjectVisual project={project} />

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
                className="btn-secondary"
              >
                Live Demo
              </a>
            ) : project.github ? (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
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
