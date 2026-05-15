'use client'

import { useMemo, useState } from 'react'
import StudyCard from '@/components/sections/StudyCard'

export default function StudyClientPage({ notes, categories }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesCategory = activeCategory === 'All' || note.category === activeCategory
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        query === '' ||
        note.title.toLowerCase().includes(query) ||
        note.excerpt.toLowerCase().includes(query) ||
        note.tags?.some((t) => t.toLowerCase().includes(query))
      return matchesCategory && matchesSearch
    })
  }, [notes, activeCategory, searchQuery])

  return (
    <>
      <section
        style={{
          backgroundColor: '#f5f5f7',
          padding: '80px 22px 40px',
          textAlign: 'center',
        }}
        aria-label="Study notes header"
      >
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <p className="text-tagline" style={{ color: '#0066cc', marginBottom: '12px' }}>
            Learning Log
          </p>
          <h1
            className="text-hero-display study-hero-title"
            style={{
              color: '#1d1d1f',
              marginBottom: '16px',
            }}
          >
            Study Notes
          </h1>
          <p
            className="text-body"
            style={{
              color: '#7a7a7a',
              margin: '0 auto 40px',
              maxWidth: '520px',
            }}
          >
            Notes I take while going deeper into topics that matter.
          </p>

          <div style={{ position: 'relative', maxWidth: '440px', margin: '0 auto' }}>
            <input
              type="search"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search study notes"
              style={{
                width: '100%',
                height: '44px',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '9999px',
                padding: '12px 20px 12px 44px',
                fontSize: '17px',
                fontWeight: 400,
                lineHeight: 1.47,
                letterSpacing: '-0.374px',
                color: '#1d1d1f',
                outline: 'none',
              }}
              className="search-input"
            />
            <span className="search-glyph" aria-hidden="true" />
          </div>
        </div>
      </section>

      <div
        style={{
          backgroundColor: '#f5f5f7',
          padding: '0 22px 40px',
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          flexWrap: 'wrap',
        }}
        role="group"
        aria-label="Filter by category"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            aria-pressed={activeCategory === cat}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: activeCategory === cat ? '2px solid #0071e3' : '1px solid #e0e0e0',
              backgroundColor: activeCategory === cat ? '#ffffff' : '#ffffff',
              color: '#1d1d1f',
              fontSize: '14px',
              fontWeight: 400,
              letterSpacing: '-0.224px',
              cursor: 'pointer',
              outline: 'none',
            }}
            className="filter-btn"
          >
            {cat}
          </button>
        ))}
      </div>

      <section
        style={{
          backgroundColor: '#ffffff',
          padding: '40px 22px 80px',
        }}
        aria-label="Study notes list"
        aria-live="polite"
      >
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          {filteredNotes.length > 0 ? (
            <div
              className="notes-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
              }}
            >
              {filteredNotes.map((note, i) => (
                <StudyCard key={note.slug} note={note} index={i} />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 0',
                color: '#7a7a7a',
                fontSize: '17px',
              }}
            >
              No notes found for &quot;{searchQuery || activeCategory}&quot;
            </div>
          )}
        </div>
      </section>

      <style>{`
        .search-glyph {
          border: 1.5px solid #7a7a7a;
          border-radius: 9999px;
          height: 13px;
          left: 18px;
          pointer-events: none;
          position: absolute;
          top: 15px;
          width: 13px;
        }

        .search-glyph::after {
          background: #7a7a7a;
          content: '';
          height: 6px;
          left: 10px;
          position: absolute;
          top: 10px;
          transform: rotate(-45deg);
          transform-origin: top;
          width: 1.5px;
        }

        .search-input:focus {
          border-color: #0066cc !important;
          box-shadow: 0 0 0 2px rgba(0,102,204,0.12);
        }

        .filter-btn:active {
          transform: scale(0.95);
        }

        @media (max-width: 834px) {
          .notes-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 640px) {
          .study-hero-title {
            font-size: 34px !important;
          }
          .notes-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  )
}
