import { metadata } from '../app/layout'

describe('SEO metadata — layout.tsx', () => {
  test('og:title is set', () => {
    expect((metadata.openGraph as { title: string }).title).toBe('Allen - Frontend Developer')
  })

  test('og:description is set', () => {
    expect((metadata.openGraph as { description: string }).description).toBeTruthy()
  })

  test('og:image is set with 1200×630 dimensions', () => {
    const images = (metadata.openGraph as { images: { url: string; width: number; height: number; alt: string }[] }).images
    expect(images[0].url).toBe('/og-image.png')
    expect(images[0].width).toBe(1200)
    expect(images[0].height).toBe(630)
    expect(images[0].alt).toBeTruthy()
  })

  test('twitter:card is summary_large_image', () => {
    expect((metadata.twitter as { card: string }).card).toBe('summary_large_image')
  })

  test('twitter:creator is set', () => {
    expect((metadata.twitter as { creator?: string }).creator).toBeTruthy()
  })

  test('twitter:site is set', () => {
    expect((metadata.twitter as { site?: string }).site).toBeTruthy()
  })

  test('metadataBase is set', () => {
    expect(metadata.metadataBase?.toString()).toBe('https://allen-portfolio.vercel.app/')
  })

  test('robots index and follow are true', () => {
    const robots = metadata.robots as { index: boolean; follow: boolean }
    expect(robots.index).toBe(true)
    expect(robots.follow).toBe(true)
  })
})
