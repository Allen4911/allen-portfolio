import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const POSTS_DIRS = [
  path.join(process.cwd(), 'content/posts'),
  path.join(process.cwd(), 'content/wordpress'),
]

export interface PostMeta {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  thumbnail: string
  published: boolean
  draft: boolean
  readingTime: string
}

export interface Post extends PostMeta {
  content: string
}

function getSlug(filename: string) {
  return filename.replace(/\.mdx?$/, '')
}

function readPostsFromDir(dir: string): PostMeta[] {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(dir, filename), 'utf-8')
      const { data, content } = matter(raw)
      const rt = readingTime(content)
      return {
        slug: getSlug(filename),
        title: data.title ?? '',
        description: data.description ?? '',
        date: data.date ?? '',
        tags: Array.isArray(data.tags) ? data.tags : [],
        thumbnail: data.thumbnail ?? '',
        published: data.published !== false,
        draft: data.draft === true,
        readingTime: rt.text,
      } satisfies PostMeta
    })
    .filter((p) => p.published && !p.draft)
}

export function getAllPosts(): PostMeta[] {
  const all = POSTS_DIRS.flatMap(readPostsFromDir)
  const seen = new Set<string>()
  const deduped = all.filter((p) => {
    if (seen.has(p.slug)) return false
    seen.add(p.slug)
    return true
  })
  return deduped.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPost(slug: string): Post | null {
  for (const dir of POSTS_DIRS) {
    const mdxPath = path.join(dir, `${slug}.mdx`)
    const mdPath = path.join(dir, `${slug}.md`)
    const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null
    if (!filePath) continue

    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(raw)
    const rt = readingTime(content)

    return {
      slug,
      title: data.title ?? '',
      description: data.description ?? '',
      date: data.date ?? '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      thumbnail: data.thumbnail ?? '',
      published: data.published !== false,
      draft: data.draft === true,
      readingTime: rt.text,
      content,
    }
  }
  return null
}

export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tagSet = new Set<string>()
  posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)))
  return Array.from(tagSet).sort()
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((p) => p.tags.includes(tag))
}

export function getAdjacentPosts(slug: string): { prev: PostMeta | null; next: PostMeta | null } {
  const posts = getAllPosts()
  const idx = posts.findIndex((p) => p.slug === slug)
  return {
    prev: idx > 0 ? posts[idx - 1] : null,
    next: idx < posts.length - 1 ? posts[idx + 1] : null,
  }
}
