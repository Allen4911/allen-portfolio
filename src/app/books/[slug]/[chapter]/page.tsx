import { notFound } from 'next/navigation'
import booksData from '../../../../../public/data/books.json'
import BookLayout from '@/components/books/BookLayout'

const GITHUB_REPO = 'Allen4911/Book'
const GITHUB_REF = 'main'
// Build-time only. Provided via env when running `next build`; never shipped to
// the client (the rendered HTML is baked into the static export).
const GITHUB_TOKEN = process.env.BOOK_GITHUB_TOKEN || process.env.GITHUB_TOKEN

export async function generateStaticParams() {
  const params: { slug: string; chapter: string }[] = []
  for (const book of booksData) {
    for (const ch of book.chapters) {
      params.push({ slug: book.slug, chapter: ch.id })
      if (ch.children) {
        for (const child of ch.children) {
          params.push({ slug: book.slug, chapter: child.id })
        }
      }
    }
  }
  return params
}

function findChapter(chapters, id) {
  for (const ch of chapters) {
    if (ch.id === id) return ch
    const found = ch.children?.find((c) => c.id === id)
    if (found) return found
  }
  return null
}

function buildFlatList(chapters: { id: string; children?: { id: string }[] }[]) {
  const list: { id: string }[] = []
  for (const ch of chapters) {
    list.push(ch)
    if (ch.children) list.push(...ch.children)
  }
  return list
}

async function fetchMarkdown(repoFolder, filename) {
  // Private repo → read via the GitHub Contents API with a build-time token.
  // `Accept: application/vnd.github.raw` returns the file body directly.
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${repoFolder}/${filename}?ref=${GITHUB_REF}`
  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github.raw',
        ...(GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {}),
      },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return `> 콘텐츠를 불러올 수 없습니다. (${res.status})`
    const text = await res.text()
    // Rewrite relative image paths (../assets/, ./assets/, assets/) to the
    // static copies in public/book-assets/<folder>/ so they resolve on the site.
    const bookFolder = repoFolder.split('/')[0]
    return text.replace(/(!\[[^\]]*\]\()(?:\.\.\/|\.\/)?assets\//g, `$1/book-assets/${bookFolder}/`)
  } catch {
    return '> 네트워크 오류로 콘텐츠를 불러올 수 없습니다.'
  }
}

export async function generateMetadata({ params }: { params: { slug: string; chapter: string } }) {
  const book = booksData.find((b) => b.slug === params.slug)
  if (!book) return {}
  const chapter = findChapter(book.chapters, params.chapter)
  return { title: chapter ? `${chapter.label} | ${book.title}` : book.title }
}

export default async function ChapterPage({ params }: { params: { slug: string; chapter: string } }) {
  const book = booksData.find((b) => b.slug === params.slug)
  if (!book) notFound()

  const chapter = findChapter(book.chapters, params.chapter)
  if (!chapter) notFound()

  const markdown = await fetchMarkdown(book.repoFolder, chapter.file)
  const flatList = buildFlatList(book.chapters)
  const idx = flatList.findIndex((c) => c.id === params.chapter)
  const prev = idx > 0 ? flatList[idx - 1] : null
  const next = idx < flatList.length - 1 ? flatList[idx + 1] : null

  return (
    <BookLayout
      book={book}
      chapterId={params.chapter}
      markdown={markdown}
      prev={prev}
      next={next}
    />
  )
}
