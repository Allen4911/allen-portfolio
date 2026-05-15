import ContactForm from '@/components/contact/ContactForm'

export const metadata = {
  title: 'Contact',
  description: 'Open to new opportunities, collaborations, and interesting conversations.',
}

const socialLinks = [
  {
    label: 'Email',
    href: 'mailto:kjkim4911@gmail.com',
    description: 'kjkim4911@gmail.com',
    external: true,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Allen4911',
    description: 'github.com/Allen4911',
    external: true,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/allen4911',
    description: 'linkedin.com/in/allen4911',
    external: true,
  },
]

export default function ContactPage() {
  return (
    <>
      {/* Centered parchment hero */}
      <section
        style={{
          backgroundColor: '#f5f5f7',
          minHeight: 'calc(100vh - 44px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 22px',
          textAlign: 'center',
        }}
        aria-label="Contact"
      >
        <div style={{ maxWidth: '600px', width: '100%' }}>
          <p
            style={{
              fontSize: '21px',
              fontWeight: '600',
              lineHeight: '1.19',
              letterSpacing: '0.231px',
              color: '#0066cc',
              marginBottom: '12px',
            }}
          >
            Contact
          </p>

          <h1
            style={{
              fontSize: '56px',
              fontWeight: '600',
              lineHeight: '1.07',
              letterSpacing: '-0.28px',
              color: '#1d1d1f',
              marginBottom: '20px',
            }}
            className="contact-title"
          >
            Get in touch.
          </h1>

          <p
            style={{
              fontSize: '17px',
              fontWeight: '400',
              lineHeight: '1.47',
              letterSpacing: '-0.374px',
              color: '#7a7a7a',
              marginBottom: '48px',
              maxWidth: '480px',
              margin: '0 auto 48px',
            }}
          >
            Open to new opportunities, collaborations, and interesting conversations.
          </p>

          {/* Contact Form */}
          <div style={{ textAlign: 'left', marginBottom: '48px' }}>
            <ContactForm />
          </div>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              backgroundColor: '#e0e0e0',
              margin: '0 auto 40px',
              maxWidth: '320px',
            }}
          />

          {/* Social links */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              alignItems: 'center',
            }}
          >
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textDecoration: 'none',
                }}
                className="social-link"
              >
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    lineHeight: '1.29',
                    letterSpacing: '-0.224px',
                    color: '#0066cc',
                    minWidth: '60px',
                    textAlign: 'right',
                  }}
                >
                  {link.label}
                </span>
                <span
                  style={{
                    width: '1px',
                    height: '14px',
                    backgroundColor: '#e0e0e0',
                  }}
                />
                <span
                  style={{
                    fontSize: '17px',
                    fontWeight: '400',
                    lineHeight: '1.47',
                    letterSpacing: '-0.374px',
                    color: '#1d1d1f',
                  }}
                >
                  {link.description}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .social-link:hover span:first-child {
          text-decoration: underline;
        }
        @media (max-width: 640px) {
          .contact-title {
            font-size: 34px !important;
          }
        }
      `}</style>
    </>
  )
}
