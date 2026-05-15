import { skills } from '@/data/skills'

interface SkillsGridProps {
  id?: string
}

const levelBadge: Record<string, { bg: string; color: string }> = {
  Advanced: { bg: 'var(--color-primary)', color: 'var(--color-on-dark)' },
  Intermediate: { bg: 'var(--color-hairline)', color: 'var(--color-ink)' },
  Beginner: { bg: 'var(--color-divider-soft)', color: 'var(--color-ink-muted-48)' },
}

export default function SkillsGrid({ id }: SkillsGridProps) {
  return (
    <section
      id={id}
      aria-label="Skills"
      className="tile-parchment"
      style={{ paddingLeft: '22px', paddingRight: '22px' }}
    >
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 className="text-display-lg" style={{ marginBottom: '12px' }}>
            Skills
          </h2>
          <p className="text-body" style={{ color: 'var(--color-ink-muted-48)' }}>
            Technologies I work with daily.
          </p>
        </div>

        <div
          className="skills-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
          }}
        >
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="card-utility"
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '11px',
                  backgroundColor: 'var(--color-canvas-parchment)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: 'var(--color-ink)',
                    fontFamily: 'monospace',
                  }}
                >
                  {skill.icon}
                </span>
              </div>

              <p className="text-body-strong">{skill.name}</p>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span className="text-nav-link" style={{ color: 'var(--color-ink-muted-48)' }}>
                  {skill.category}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '400',
                    lineHeight: '1.0',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    backgroundColor: levelBadge[skill.level]?.bg || 'var(--color-divider-soft)',
                    color: levelBadge[skill.level]?.color || 'var(--color-ink-muted-48)',
                  }}
                >
                  {skill.level}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
