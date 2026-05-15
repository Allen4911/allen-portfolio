import ProjectsCarousel from '@/components/sections/ProjectsCarousel'
import { projects } from '@/data/projects'

export const metadata = {
  title: 'Projects',
  description: "Things I've built — problems I found and chose to solve.",
}

export default function ProjectsPage() {
  return (
    <>
      <section
        className="tile-parchment"
        style={{ paddingLeft: '22px', paddingRight: '22px', textAlign: 'center' }}
        aria-label="Projects header"
      >
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <p
            className="text-tagline"
            style={{ color: 'var(--color-primary)', marginBottom: '12px' }}
          >
            Work
          </p>
          <h1
            className="text-hero-display projects-hero-title"
            style={{ marginBottom: '20px' }}
          >
            Projects
          </h1>
          <p className="text-lead projects-hero-sub" style={{ color: 'var(--color-ink-muted-48)' }}>
            {"Things I've built — problems I found and chose to solve."}
          </p>
        </div>
      </section>

      <ProjectsCarousel projects={projects} />

      <style>{`
        @media (max-width: 640px) {
          .projects-hero-title {
            font-size: 34px !important;
          }
          .projects-hero-sub {
            font-size: 21px !important;
          }
        }
      `}</style>
    </>
  )
}
