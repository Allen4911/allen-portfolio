export default function ContactSection() {
  return (
    <section
      aria-label="Contact"
      className="tile-dark"
      style={{ paddingLeft: '22px', paddingRight: '22px', textAlign: 'center' }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div>
          <p
            className="text-tagline"
            style={{ color: 'var(--color-primary-on-dark)', marginBottom: '16px' }}
          >
            Contact
          </p>

          <h2 className="text-display-lg" style={{ marginBottom: '16px' }}>
            Get in touch.
          </h2>

          <p
            className="text-body"
            style={{ color: 'var(--color-body-muted)', marginBottom: '40px' }}
          >
            Open to new opportunities, collaborations, and interesting conversations.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <a href="mailto:kjkim4911@gmail.com" className="btn-primary">
              Send Email
            </a>
            <a
              href="https://github.com/Allen4911"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary-dark"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
