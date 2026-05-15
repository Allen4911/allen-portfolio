import Link from 'next/link'

export const metadata = {
  title: '404 — Page Not Found',
}

export default function NotFound() {
  return (
    <section
      style={{
        minHeight: 'calc(100vh - 44px)',
        backgroundColor: '#f5f5f7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 22px',
        textAlign: 'center',
      }}
      aria-label="Page not found"
    >
      <div style={{ maxWidth: '480px' }}>
        <p
          style={{
            fontSize: '14px',
            fontWeight: '400',
            lineHeight: '1.43',
            color: '#7a7a7a',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '16px',
          }}
        >
          404
        </p>
        <h1
          style={{
            fontSize: '40px',
            fontWeight: '600',
            lineHeight: '1.10',
            letterSpacing: '0',
            color: '#1d1d1f',
            marginBottom: '16px',
          }}
        >
          Page not found.
        </h1>
        <p
          style={{
            fontSize: '17px',
            fontWeight: '400',
            lineHeight: '1.47',
            letterSpacing: '-0.374px',
            color: '#7a7a7a',
            marginBottom: '40px',
          }}
        >
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="btn-primary">
          Go home
        </Link>
      </div>
    </section>
  )
}
