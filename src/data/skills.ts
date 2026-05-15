export type SkillLevel = 'Advanced' | 'Intermediate' | 'Beginner'

export interface Skill {
  name: string
  level: SkillLevel
  icon: string
  category: string
}

export interface LevelColor {
  bg: string
  text: string
}

export const skills: Skill[] = [
  { name: 'JavaScript', level: 'Advanced', icon: 'JS', category: 'Language' },
  { name: 'React', level: 'Advanced', icon: 'Re', category: 'Framework' },
  { name: 'Next.js', level: 'Intermediate', icon: 'N', category: 'Framework' },
  { name: 'Tailwind CSS', level: 'Advanced', icon: 'TW', category: 'Styling' },
  { name: 'Node.js', level: 'Intermediate', icon: 'No', category: 'Backend' },
  { name: 'Git', level: 'Advanced', icon: 'Gt', category: 'Tool' },
  { name: 'Python', level: 'Intermediate', icon: 'Py', category: 'Language' },
  { name: 'TypeScript', level: 'Intermediate', icon: 'TS', category: 'Language' },
  { name: 'Claude API', level: 'Advanced', icon: 'AI', category: 'AI' },
  { name: 'Telegram Bot API', level: 'Advanced', icon: 'TG', category: 'AI' },
  { name: 'tmux', level: 'Advanced', icon: 'TX', category: 'Tool' },
  { name: 'C / C++', level: 'Advanced', icon: 'C+', category: 'Language' },
  { name: 'RTOS / BSP', level: 'Advanced', icon: 'RT', category: 'Embedded' },
  { name: 'LTE / 5G (3GPP)', level: 'Advanced', icon: '5G', category: 'Protocol' },
]

export const levelColors: Record<SkillLevel, LevelColor> = {
  Advanced: { bg: '#0066cc', text: '#ffffff' },
  Intermediate: { bg: '#e0e0e0', text: '#1d1d1f' },
  Beginner: { bg: '#f5f5f7', text: '#7a7a7a' },
}
