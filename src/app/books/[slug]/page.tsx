import { redirect, notFound } from 'next/navigation'
import booksData from '../../../../public/data/books.json'

export async function generateStaticParams() {
  return booksData.map((book) => ({ slug: book.slug }))
}

export default function BookSlugPage({ params }) {
  const book = booksData.find((b) => b.slug === params.slug)
  if (!book) notFound()
  const firstChapterId = book.chapters[0]?.id
  if (!firstChapterId) notFound()
  redirect(`/books/${book.slug}/${firstChapterId}`)
}
