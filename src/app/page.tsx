import HeroSection from '@/components/sections/HeroSection'
import ProjectTile from '@/components/sections/ProjectTile'
import SkillsGrid from '@/components/sections/SkillsGrid'
import StudyCard from '@/components/sections/StudyCard'
import ContactSection from '@/components/sections/ContactSection'
import { projects } from '@/data/projects'
import { studyNotes } from '@/data/study'
import Link from 'next/link'

export const metadata = {
  title: 'Allen - Frontend Developer',
  description:
    'Frontend Developer specializing in React, Next.js, and modern web experiences. Building clean, performant interfaces.',
}

export default function HomePage() {
  const featuredProjects = projects.filter((p) => p.featured)
  const recentNotes = studyNotes.slice(0, 3)

  return (
    <>
      <HeroSection />

      {featuredProjects.map((project, index) => (
        <ProjectTile key={project.id} project={project} index={index} />
      ))}

      <SkillsGrid />

      <section
        className="tile-light"
        style={{ paddingLeft: '22px', paddingRight: '22px' }}
        aria-label="Study notes preview"
      >
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '40px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <h2 className="text-display-lg" style={{ marginBottom: '8px' }}>
                Study Notes
              </h2>
              <p className="text-body" style={{ color: 'var(--color-ink-muted-48)' }}>
                Notes from the workbench.
              </p>
            </div>
            <Link
              href="/study"
              className="link-primary text-body"
              style={{ whiteSpace: 'nowrap' }}
            >
              See all
            </Link>
          </div>

          <div
            className="study-preview-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
            }}
          >
            {recentNotes.map((note, i) => (
              <StudyCard key={note.slug} note={note} index={i} />
            ))}
          </div>
        </div>
      </section>

      <ContactSection />

      <style>{`
        @media (max-width: 834px) {
          .study-preview-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .study-preview-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  )
}
