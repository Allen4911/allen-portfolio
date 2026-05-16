import Link from 'next/link'

const footerColumns = [
  {
    heading: 'About',
    links: [
      { label: 'About me', href: '/about' },
      { label: 'Skills', href: '/about#skills' },
      { label: 'Timeline', href: '/about#timeline' },
    ],
  },
  {
    heading: 'Projects',
    links: [
      { label: 'OpenClaw Bridge', href: '/projects/openclaw-bridge' },
      { label: 'Developer Portfolio', href: '/projects/allen-portfolio' },
      { label: 'Study Notes App', href: '/projects/study-notes' },
    ],
  },
  {
    heading: 'Study',
    links: [
      { label: 'React', href: '/study?category=React' },
      { label: 'Next.js', href: '/study?category=Next.js' },
      { label: 'JavaScript', href: '/study?category=JavaScript' },
      { label: 'CSS', href: '/study?category=CSS' },
    ],
  },
  {
    heading: 'Contact',
    links: [
      { label: 'Email', href: 'mailto:kjkim4911@gmail.com', external: true },
      { label: 'GitHub', href: 'https://github.com/Allen4911', external: true },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/allen4911', external: true },
    ],
  },
]

export default function Footer() {
  return (
    <footer
      className="tile-parchment"
      style={{
        paddingTop: '64px',
        paddingLeft: '22px',
        paddingRight: '22px',
        paddingBottom: '32px',
      }}
    >
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
            marginBottom: '48px',
          }}
          className="footer-grid"
        >
          {footerColumns.map((col) => (
            <div key={col.heading}>
              <p className="text-caption-strong" style={{ marginBottom: '12px' }}>
                {col.heading}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="footer-link">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            height: '1px',
            backgroundColor: 'var(--color-hairline)',
            marginBottom: '24px',
          }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <p className="text-fine-print" style={{ color: 'var(--color-ink-muted-48)' }}>
            Copyright 2026 Allen Kim. All rights reserved.
          </p>
          <p className="text-fine-print" style={{ color: 'var(--color-ink-muted-48)' }}>
            Built with Next.js and Tailwind CSS
          </p>
        </div>
      </div>

      <style>{`
        .footer-link {
          color: var(--color-ink-muted-80);
          display: block;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: -0.12px;
          line-height: 2.41;
          text-decoration: none;
        }

        .footer-link:hover {
          color: var(--color-primary) !important;
        }

        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 400px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}
