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
        {/* Desktop: 2-col (text left, visual right) | Mobile: single col centered */}
        <div className="hero-inner">
          {/* Text column */}
          <div className="hero-text">
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
              Allen Kim
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
              style={{ color: 'var(--color-ink-muted-48)', marginBottom: '32px', maxWidth: '480px' }}
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
              <Link href="/contact" className="btn-secondary">
                Contact
              </Link>
            </div>
          </div>

          {/* Visual column */}
          <div className="hero-visual">
            {/* Code mock */}
            <div
              className="product-frame hero-product"
              style={{
                backgroundColor: 'var(--color-canvas)',
                marginTop: '20px',
              }}
              aria-hidden="true"
            >
              <div
                style={{
                  height: '38px',
                  borderBottom: '1px solid var(--color-hairline)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '0 16px',
                }}
              >
                <span className="window-dot" />
                <span className="window-dot" />
                <span className="window-dot" />
              </div>
              <div style={{ padding: '20px 24px', textAlign: 'left' }}>
                <p
                  className="text-caption"
                  style={{ color: 'var(--color-ink-muted-48)', marginBottom: '10px' }}
                >
                  product-system.jsx
                </p>
                {['const craft = "interface";', 'ship({ speed, clarity, care })', 'measure("accessibility")'].map(
                  (line) => (
                    <p
                      key={line}
                      style={{
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                        fontSize: '13px',
                        lineHeight: '1.9',
                        letterSpacing: 0,
                        color: 'var(--color-ink)',
                      }}
                    >
                      {line}
                    </p>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .window-dot {
          width: 10px;
          height: 10px;
          border-radius: 9999px;
          background: #d2d2d7;
        }

        /* Mobile: single centered column */
        .hero-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 48px;
        }
        .hero-text {
          max-width: 600px;
        }
        .hero-buttons {
          justify-content: center;
        }
        .hero-visual {
          width: 100%;
          max-width: 400px;
        }

        /* Desktop (md: 768px+): 2-column side by side */
        @media (min-width: 768px) {
          .hero-inner {
            display: grid;
            grid-template-columns: 1fr 420px;
            gap: 64px;
            align-items: center;
            text-align: left;
          }
          .hero-buttons {
            justify-content: flex-start;
          }
          .hero-text {
            max-width: none;
          }
          .hero-visual {
            max-width: none;
          }
.hero-lead {
            max-width: 520px;
          }
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
