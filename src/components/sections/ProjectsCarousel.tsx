'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import ProjectTile from './ProjectTile'

export default function ProjectsCarousel({ projects }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    onSelect()
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])


  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index) => emblaApi?.scrollTo(index), [emblaApi])

  const btnBase = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 10,
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: '1px solid var(--color-hairline)',
    backgroundColor: 'var(--color-canvas)',
    color: 'var(--color-ink)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    transition: 'opacity 0.2s, transform 0.1s',
    fontSize: '18px',
    lineHeight: '1',
  } as React.CSSProperties

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={emblaRef}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return
          if (e.key === 'ArrowLeft') { e.preventDefault(); emblaApi?.scrollPrev() }
          if (e.key === 'ArrowRight') { e.preventDefault(); emblaApi?.scrollNext() }
        }}
        style={{ overflow: 'hidden' }}
      >
        <div style={{ display: 'flex' }}>
          {projects.map((project, index) => (
            <div
              key={project.id}
              style={{ flex: '0 0 100%', minWidth: 0 }}
            >
              <ProjectTile project={project} index={index} />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label="Previous project"
        style={{
          ...btnBase,
          left: '12px',
          opacity: canScrollPrev ? 1 : 0.3,
        }}
      >
        ‹
      </button>

      <button
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label="Next project"
        style={{
          ...btnBase,
          right: '12px',
          opacity: canScrollNext ? 1 : 0.3,
        }}
      >
        ›
      </button>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          padding: '20px 0 8px',
          backgroundColor: 'var(--color-canvas-parchment)',
        }}
      >
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            aria-label={`Go to project ${index + 1}`}
            style={{
              width: selectedIndex === index ? '20px' : '8px',
              height: '8px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: selectedIndex === index
                ? 'var(--color-primary)'
                : 'var(--color-hairline)',
              cursor: 'pointer',
              padding: 0,
              transition: 'width 0.2s, background-color 0.2s',
            }}
          />
        ))}
      </div>
    </div>
  )
}
