import booksData from './books.json'

export interface Book {
  id: string
  title: string
  author: string
  views: number
  likes: number
  cover: string | null
}

export const books: Book[] = booksData
