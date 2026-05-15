import Link from 'next/link'

export default function HeroSection() {
  return (
    <section
      className="tile-parchment hero-shell"
      style={{
        minHeight: 'calc(100vh - 44px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '72px 22px 64px',
      }}
      aria-label="Hero section"
    >
      <div
        data-testid="hero-grid"
        className="hero-grid"
        style={{
          maxWidth: '980px',
          width: '100%',
        }}
      >
        {/* Single centered text column */}
        <div className="hero-inner">
          <p
            className="text-tagline"
            style={{ color: 'var(--color-primary)', marginBottom: '12px' }}
          >
            Frontend Developer
          </p>

          <h1
            className="text-hero-display"
            style={{ marginBottom: '20px' }}
          >
            Allen
          </h1>

          <p
            className="text-body"
            style={{ marginBottom: '16px' }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '13px',
                letterSpacing: '0.02em',
                padding: '4px 12px',
                borderRadius: '9999px',
              }}
            >
              <span aria-hidden="true">📡</span>
              18+ years telecom
            </span>
          </p>

          <p
            className="text-lead hero-lead"
            style={{ marginBottom: '20px' }}
          >
            Clean, fast web interfaces built with product-level polish.
          </p>

          <p
            className="text-body"
            style={{ color: 'var(--color-ink-muted-48)', marginBottom: '32px', maxWidth: '560px' }}
          >
            React, Next.js, design systems, accessibility, and AI-assisted developer workflows.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
            }}
            className="hero-buttons"
          >
            <Link href="/projects" className="btn-primary">
              View Projects
            </Link>
            <Link href="/about" className="btn-secondary">
              About
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .hero-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 720px;
          margin: 0 auto;
        }
        .hero-buttons {
          justify-content: center;
        }
        @media (max-width: 767px) {
          .hero-shell {
            padding-top: 56px !important;
          }
          .hero-lead {
            font-size: 21px !important;
          }
        }
      `}</style>
    </section>
  )
}
