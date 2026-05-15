export interface StudyNote {
  slug: string
  title: string
  category: string
  date: string
  readingTime: string
  excerpt: string
  content: string
  tags: string[]
}

export interface Project {
  id: string
  title: string
  category: string
  description: string
  longDescription: string
  tech: string[]
  github: string | null
  demo: string | null
  featured: boolean
  readmeUrl?: string
}

export interface FrontMatter {
  title?: string
  date?: string
  category?: string
  tags?: string
  excerpt?: string
  readingTime?: string
  [key: string]: string | undefined
}
