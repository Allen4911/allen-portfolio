import studyData from '../../public/data/study.json'

export interface StudyNote {
  slug: string
  title: string
  category: string
  date: string
  readingTime: string
  excerpt: string
  summary?: string
  content?: string
  tags: string[]
}

export const studyNotes: StudyNote[] = studyData as StudyNote[]

export function getNoteBySlug(slug: string): StudyNote | null {
  return studyNotes.find((n) => n.slug === slug) ?? null
}
