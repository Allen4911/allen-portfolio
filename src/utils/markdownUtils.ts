export function getReadingTime(content: string): string {
  if (!content) return '1 min read'

  const stripped = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/[*_~`]/g, '')
    .replace(/>\s/g, '')
    .replace(/[-*+]\s/g, '')
    .trim()

  const words = stripped.split(/\s+/).filter(Boolean).length
  const minutes = Math.ceil(words / 200)
  return `${minutes} min read`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function extractExcerpt(markdown: string, maxLength = 150): string {
  const stripped = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/[*_~]/g, '')
    .replace(/>\s/g, '')
    .replace(/\n+/g, ' ')
    .trim()

  if (stripped.length <= maxLength) return stripped
  return stripped.slice(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

export function formatDate(dateString: string, locale: 'en' | 'ko' = 'en'): string {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString

  if (locale === 'ko') {
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
