import { readFileSync } from 'fs'
import { join } from 'path'
import StudyClientPage from './StudyClientPage'

export const metadata = {
  title: 'Study Notes',
  description:
    "My ongoing learning log — notes I've taken while going deeper into topics that matter.",
}

export default function StudyPage() {
  const notes = JSON.parse(
    readFileSync(join(process.cwd(), 'public', 'data', 'study.json'), 'utf-8')
  )
  const categories = [
    'All',
    ...Array.from(new Set(notes.map((n) => n.category).filter(Boolean))),
  ]
  return <StudyClientPage notes={notes} categories={categories} />
}
