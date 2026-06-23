'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Books', href: '/books' },
  { label: 'Study', href: '/study' },
  { label: 'Contact', href: '/contact' },
]

export default function GlobalNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const { locale, toggleLanguage } = useLanguage()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <>
      <nav
        role="navigation"
        aria-label="Global navigation"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: '44px',
          backgroundColor: '#ffffff',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 22px',
          }}
        >
          <Link
            href="/"
            aria-label="Allen Home"
            style={{
              color: '#0d111b',
              fontSize: '17px',
              fontWeight: 600,
              letterSpacing: '-0.374px',
              lineHeight: 1,
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            Allen
          </Link>

          <div
            aria-hidden={menuOpen}
            style={{ display: 'flex', alignItems: 'center', gap: '28px' }}
            className="hidden-mobile"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: '#0f0f0f',
                  fontSize: '12px',
                  fontWeight: 400,
                  letterSpacing: '-0.12px',
                  lineHeight: 1,
                  textDecoration: 'none',
                }}
                className="nav-desktop-link"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={toggleLanguage}
              aria-label={locale === 'en' ? 'Switch to Korean (KO)' : 'Switch to English (EN)'}
              style={{
                background: 'none',
                border: '1px solid rgba(0,0,0,0.2)',
                borderRadius: '4px',
                color: '#0f0f0f',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                padding: '3px 7px',
                cursor: 'pointer',
                lineHeight: 1,
              }}
              className="lang-toggle"
            >
              {locale === 'en' ? 'KO' : 'EN'}
            </button>

            <Link
              href="/contact"
              style={{
                backgroundColor: 'var(--color-onyx-button)',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 400,
                letterSpacing: '-0.12px',
                padding: '7px 14px',
                borderRadius: '9999px',
                textDecoration: 'none',
                lineHeight: 1,
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
              }}
              className="hire-cta"
            >
              Hire me
            </Link>

            <button
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
              className="hamburger-btn"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                flexDirection: 'column',
                gap: '5px',
                padding: '4px',
              }}
            >
              {[0, 1, 2].map((line) => (
                <span
                  key={line}
                  style={{
                    display: 'block',
                    width: '18px',
                    height: '1px',
                    backgroundColor: '#0f0f0f',
                    opacity: menuOpen && line === 1 ? 0 : 1,
                    transform:
                      menuOpen && line === 0
                        ? 'translateY(6px) rotate(45deg)'
                        : menuOpen && line === 2
                          ? 'translateY(-6px) rotate(-45deg)'
                          : 'none',
                    transition: 'transform 0.2s ease, opacity 0.2s ease',
                  }}
                />
              ))}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div
          role="dialog"
          aria-label="Mobile navigation menu"
          style={{
            position: 'fixed',
            top: '44px',
            left: 0,
            right: 0,
            zIndex: 49,
            backgroundColor: '#ffffff',
            padding: '16px 22px 24px',
          }}
          className="mobile-menu"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'block',
                color: '#0f0f0f',
                fontSize: '17px',
                fontWeight: 400,
                letterSpacing: '-0.374px',
                lineHeight: 1.47,
                padding: '10px 0',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(0,0,0,0.08)',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 835px) {
          .hamburger-btn { display: none; }
        }

        @media (max-width: 834px) {
          .hidden-mobile {
            display: none !important;
          }
          .hamburger-btn {
            display: flex;
          }
          .mobile-menu {
            display: block !important;
          }
        }

        .nav-desktop-link:hover {
          color: #0d111b !important;
        }

        .hire-cta:active {
          transform: scale(0.95);
        }
      `}</style>
    </>
  )
}
