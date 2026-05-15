const LS_KEY = 'allen_study_uploads'

export interface PostMeta {
  title?: string
  date?: string
  tags?: string | string[]
  summary?: string
  draft?: string
}

export interface Post {
  slug: string
  title: string
  date: string
  tags: string[]
  summary: string
  draft: boolean
  content: string
  raw: string
  uploaded: boolean
}

export function parseFrontmatter(raw: string): { data: PostMeta; content: string } {
  const fmRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/
  const match = raw.match(fmRegex)
  if (!match) return { data: {}, content: raw }

  const yamlStr = match[1]
  const content = match[2]
  const data: PostMeta = {}

  yamlStr.split('\n').forEach((line) => {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) return
    const key = line.slice(0, colonIdx).trim() as keyof PostMeta
    let value: string | string[] = line.slice(colonIdx + 1).trim()

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map((v) => v.trim().replace(/^["']|["']$/g, '')).filter(Boolean)
    }
    ;(data as Record<string, unknown>)[key] = value
  })

  return { data, content }
}

function rawToPost(slug: string, raw: string, uploaded = false): Post {
  const { data, content } = parseFrontmatter(raw)
  return {
    slug,
    title: data.title || slug,
    date: data.date || '',
    tags: Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [],
    summary: data.summary || '',
    draft: data.draft === 'true',
    content,
    raw,
    uploaded,
  }
}

// Client-side: uploaded posts from localStorage
function getUploadedRaws(): { slug: string; raw: string }[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') }
  catch { return [] }
}

function saveUploadedRaws(items: { slug: string; raw: string }[]): void {
  localStorage.setItem(LS_KEY, JSON.stringify(items))
}

// Client-side only: merges bundled (passed as prop) + uploaded
export function getAllPosts(bundled: Post[] = []): Post[] {
  const bundledSlugs = new Set(bundled.map((p) => p.slug))
  const uploaded = getUploadedRaws()
    .map(({ slug, raw }) => rawToPost(slug, raw, true))
    .filter((p) => !bundledSlugs.has(p.slug))
  return [...bundled, ...uploaded].filter((p) => !p.draft).sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string, bundled: Post[] = []): Post | null {
  return getAllPosts(bundled).find((p) => p.slug === slug) || null
}

export function deleteUploadedPost(slug: string): void {
  saveUploadedRaws(getUploadedRaws().filter((i) => i.slug !== slug))
}

interface UploadMeta { title: string; date: string; tags: string[]; summary: string }

export function uploadWithMeta(filename: string, content: string, meta: UploadMeta, bundled: Post[] = []): { ok: boolean; slug?: string } {
  const baseSlug = filename.replace(/\.md$/, '')
  const existingSlugs = new Set(getAllPosts(bundled).map((p) => p.slug))
  const slug = existingSlugs.has(baseSlug) ? `${baseSlug}-${Date.now()}` : baseSlug
  const tagsStr = meta.tags.length ? `[${meta.tags.map((t) => `"${t}"`).join(', ')}]` : '[]'
  const lines = ['---', `title: "${meta.title}"`, `date: "${meta.date}"`, `tags: ${tagsStr}`]
  if (meta.summary) lines.push(`summary: "${meta.summary}"`)
  lines.push('---')
  const raw = `${lines.join('\n')}\n\n${content}`
  const items = getUploadedRaws()
  const idx = items.findIndex((i) => i.slug === slug)
  if (idx !== -1) items[idx] = { slug, raw }
  else items.push({ slug, raw })
  saveUploadedRaws(items)
  return { ok: true, slug }
}

export function downloadPost(post: Post): void {
  const blob = new Blob([post.raw], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${post.slug}.md`
  a.click()
  URL.revokeObjectURL(url)
}
