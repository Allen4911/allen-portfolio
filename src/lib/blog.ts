import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), 'content/blog')

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  tags: string[]
  date: string
  readingTime: number
  wordCount: number
  githubUrl?: string
  seriesId?: string
  seoTitle?: string
  metaDescription?: string
  ogImage?: string
}

export interface BlogPostFull extends BlogPost {
  content: string
}

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'))

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.md$/, '')
    const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf8')
    const { data } = matter(raw)

    return {
      id: String(data.id ?? slug),
      slug: data.slug ?? slug,
      title: data.title ?? '',
      excerpt: data.excerpt ?? '',
      category: data.category ?? '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      date: data.date ?? '',
      readingTime: Number(data.readingTime ?? 0),
      wordCount: Number(data.wordCount ?? 0),
      githubUrl: data.githubUrl,
      seriesId: data.seriesId,
      seoTitle: data.seoTitle,
      metaDescription: data.metaDescription,
      ogImage: data.ogImage,
    } satisfies BlogPost
  })

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function getPostBySlug(slug: string): BlogPostFull | null {
  const filepath = path.join(CONTENT_DIR, `${slug}.md`)
  if (!fs.existsSync(filepath)) return null

  const raw = fs.readFileSync(filepath, 'utf8')
  const { data, content } = matter(raw)

  return {
    id: String(data.id ?? slug),
    slug: data.slug ?? slug,
    title: data.title ?? '',
    excerpt: data.excerpt ?? '',
    category: data.category ?? '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    date: data.date ?? '',
    readingTime: Number(data.readingTime ?? 0),
    wordCount: Number(data.wordCount ?? 0),
    githubUrl: data.githubUrl,
    seriesId: data.seriesId,
    seoTitle: data.seoTitle,
    metaDescription: data.metaDescription,
    ogImage: data.ogImage,
    content,
  }
}
