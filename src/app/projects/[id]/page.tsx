import { projects, getProjectById } from '@/data/projects'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Tag from '@/components/ui/Tag'

export async function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }) {
  const project = getProjectById(params.id)
  if (!project) return {}
  return {
    title: project.title,
    description: project.description,
  }
}

export default function ProjectDetailPage({ params }) {
  const project = getProjectById(params.id)
  if (!project) notFound()

  return (
    <>
      {/* Back link + dark hero */}
      <section
        style={{
          backgroundColor: '#272729',
          padding: '80px 22px',
        }}
        aria-label={`Project: ${project.title}`}
      >
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          {/* Back */}
          <Link
            href="/projects"
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
            ← Back to Projects
          </Link>

          {/* Category */}
          <p
            style={{
              fontSize: '21px',
              fontWeight: '600',
              lineHeight: '1.19',
              letterSpacing: '0.231px',
              color: '#2997ff',
              marginBottom: '12px',
            }}
          >
            {project.category}
          </p>

          {/* Title */}
          <h1
            style={{
              fontSize: '56px',
              fontWeight: '600',
              lineHeight: '1.07',
              letterSpacing: '-0.28px',
              color: '#ffffff',
              marginBottom: '20px',
            }}
            className="detail-title"
          >
            {project.title}
          </h1>

          {/* One-liner */}
          <p
            style={{
              fontSize: '28px',
              fontWeight: '400',
              lineHeight: '1.14',
              letterSpacing: '0.196px',
              color: '#cccccc',
              marginBottom: '40px',
            }}
            className="detail-subtitle"
          >
            {project.description}
          </p>

          {/* Visual placeholder */}
          <div
            style={{
              width: '100%',
              aspectRatio: '16/9',
              borderRadius: '18px',
              backgroundColor: '#1a1a1c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'rgba(0,0,0,0.22) 3px 5px 30px',
              marginBottom: '40px',
            }}
          >
            <span
              style={{
                fontSize: '64px',
                fontWeight: '700',
                color: '#3a3a3c',
                fontFamily: 'monospace',
                letterSpacing: '-2px',
              }}
            >
              {project.icon}
            </span>
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Live Demo
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary-dark"
              >
                GitHub
              </a>
            )}
            {project.readmeUrl && (
              <a
                href={project.readmeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary-dark"
              >
                View README
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Project details — light canvas */}
      <section
        style={{
          backgroundColor: '#ffffff',
          padding: '80px 22px',
        }}
        aria-label="Project details"
      >
        <div
          style={{
            maxWidth: '780px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '64px',
          }}
          className="detail-grid"
        >
          {/* Long description + story */}
          <div>
            <h2
              style={{
                fontSize: '34px',
                fontWeight: '600',
                lineHeight: '1.47',
                letterSpacing: '-0.374px',
                color: '#1d1d1f',
                marginBottom: '20px',
              }}
            >
              About this project
            </h2>
            <p
              style={{
                fontSize: '17px',
                fontWeight: '400',
                lineHeight: '1.47',
                letterSpacing: '-0.374px',
                color: '#1d1d1f',
                marginBottom: '32px',
              }}
            >
              {project.longDescription}
            </p>

            {/* Problem / Solution / Result */}
            {[
              { label: 'Problem', value: project.problem },
              { label: 'Solution', value: project.solution },
              { label: 'Result', value: project.result },
            ].map(({ label, value }) => (
              value && (
                <div key={label} style={{ marginBottom: '24px' }}>
                  <p
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      lineHeight: '1.29',
                      letterSpacing: '-0.224px',
                      color: '#0066cc',
                      marginBottom: '6px',
                    }}
                  >
                    {label}
                  </p>
                  <p
                    style={{
                      fontSize: '17px',
                      fontWeight: '400',
                      lineHeight: '1.47',
                      letterSpacing: '-0.374px',
                      color: '#1d1d1f',
                    }}
                  >
                    {value}
                  </p>
                </div>
              )
            ))}
          </div>

          {/* Tech stack sidebar */}
          <div>
            <h2
              style={{
                fontSize: '34px',
                fontWeight: '600',
                lineHeight: '1.47',
                letterSpacing: '-0.374px',
                color: '#1d1d1f',
                marginBottom: '20px',
              }}
            >
              Tech Stack
            </h2>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {project.tech.map((t) => (
                <Tag key={t} variant="outline">
                  {t}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .back-link:hover {
          text-decoration: underline;
        }
        @media (max-width: 640px) {
          .detail-title {
            font-size: 34px !important;
          }
          .detail-subtitle {
            font-size: 21px !important;
          }
          .detail-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </>
  )
}
