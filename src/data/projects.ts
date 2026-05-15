export interface Project {
  id: string
  title: string
  category: string
  description: string
  longDescription: string
  tech: string[]
  github: string | null
  readmeUrl?: string
  demo: string | null
  image?: string
  featured: boolean
  icon: string
  color: string
  problem: string
  solution: string
  result: string
}

export const projects: Project[] = [
  {
    id: 'ai-secretary-book',
    title: '나만의 AI 비서 만들기',
    category: 'Publication',
    description: 'Openclaw 실전 가이드 — 스마트폰 하나로 6인 AI 팀을 원격 지휘하는 전자책',
    longDescription:
      '스마트폰 메시지 하나로 6명의 역할 분리된 AI 팀을 원격 지휘하는 방법을 단계별로 설명한 실전 가이드. Openclaw + Claude CLI + Telegram 브릿지 구축, TMUX 멀티에이전트 팀 운용, 장기 기억 시스템, 토큰 최적화(RTK)까지 수록. 코딩 전문가가 아니어도 따라할 수 있도록 구성.',
    tech: ['Openclaw', 'Claude CLI', 'Telegram Bot API', 'tmux', 'WSL2'],
    github: null,
    demo: 'https://wikidocs.net/book/19639',
    image: '/images/projects/ai-secretary-book.svg',
    featured: true,
    icon: '📖',
    color: '#272729',
    problem: 'AI가 강력하다는 건 알지만 실제로 나의 일에 어떻게 써야 할지 모른다.',
    solution:
      'Openclaw 브릿지를 통해 스마트폰 Telegram에서 AI 팀에게 실시간 지시를 내리는 완결형 시스템을 구축.',
    result: '월 API 비용 60~90% 절감, 24시간 AI 비서 팀 운용 가능.',
  },
  {
    id: 'claude-agent-book',
    title: 'Claude Code 팀 에이전트 운용 가이드',
    category: 'Publication',
    description: 'Remote-Control로 멀티에이전트를 원격 지휘하는 전자책 (집필 중)',
    longDescription:
      'Claude Code Remote-Control 기능을 활용해 멀티에이전트 팀을 구성하고 원격 지휘하는 방법을 다루는 기술 가이드. Claude Code + TMUX 기반 팀 에이전트 구성, gstack/superpowers/GSD 통합 워크플로우, Triple Crown 전략, 실전 운용 노하우까지 집필 중.',
    tech: ['Claude Code', 'tmux', 'gstack', 'superpowers', 'GSD'],
    github: null,
    demo: null,
    image: '/images/projects/claude-agent-book.svg',
    featured: true,
    icon: '📘',
    color: '#1a1a2e',
    problem: '멀티에이전트 시스템은 강력하지만 구성과 운용 방법을 체계적으로 다룬 자료가 없다.',
    solution:
      'Remote-Control 아키텍처와 Triple Crown(gstack + GSD + Superpowers) 전략을 결합한 실전 운용 가이드 집필.',
    result: '집필 중 — WikiDocs 출판 예정.',
  },
  {
    id: 'openclaw-bridge',
    title: 'OpenClaw Bridge',
    category: 'Automation',
    description: 'Telegram-to-Claude CLI bridge for team coordination',
    longDescription:
      'A real-time bridge connecting Telegram messaging to Claude CLI sessions via the OpenClaw platform. Built to coordinate a virtual development team across multiple tmux panes, routing messages to specific AI agents based on message prefixes. Handles multi-pane broadcasting, context resets, and response routing, enabling async human-AI team workflows without context switching.',
    tech: ['Node.js', 'Telegram Bot API', 'Claude API', 'Bash', 'tmux'],
    github: 'https://github.com/bettep-dev/openclaw-claude-bridge',
    readmeUrl: 'https://github.com/bettep-dev/openclaw-claude-bridge#readme',
    demo: null,
    image: '/images/projects/openclaw-bridge.svg',
    featured: true,
    icon: 'BC',
    color: '#272729',
    problem:
      'Coordinating multiple AI agents across terminal panes required constant manual switching and repeated commands.',
    solution:
      'Automated message routing parses mention syntax and pipes messages to the correct tmux pane in real time.',
    result: '5x faster team coordination with zero context-switch overhead.',
  },
  {
    id: 'allen-portfolio',
    title: 'Developer Portfolio',
    category: 'Frontend',
    description: 'Apple-design-system inspired developer portfolio built with Next.js 14',
    longDescription:
      "A focused implementation of Apple's product-page design language applied to a developer portfolio. Features alternating light and dark full-bleed sections, SF Pro-inspired typography, a single Action Blue accent, Framer Motion reveal animations, and polished responsive layouts. Built with Next.js 14 App Router, Tailwind CSS custom design tokens, and server components by default.",
    tech: ['Next.js 14', 'Tailwind CSS', 'Framer Motion', 'React', 'Design Tokens'],
    github: 'https://github.com/Allen4911',
    demo: 'https://allen-portfolio.vercel.app',
    image: '/images/projects/allen-portfolio.svg',
    featured: true,
    icon: 'AP',
    color: '#f5f5f7',
    problem: 'Generic portfolio templates rarely communicate design taste or technical depth.',
    solution:
      "Applied Apple's design token system across spacing, typography, elevation, and page rhythm as a portfolio showcase.",
    result: 'A cleaner portfolio surface with product-style hierarchy and focused case-study flow.',
  },
  {
    id: 'study-notes',
    title: 'Study Notes App',
    category: 'Fullstack',
    description: 'Markdown-based study note system with upload, search, and reading time',
    longDescription:
      'A personal knowledge system that renders markdown study notes with syntax highlighting, generates reading time estimates, and supports category filtering. Features a drag-and-drop upload modal for adding new notes, language-ready structure, and an offline-first architecture using local file storage.',
    tech: ['React', 'Markdown', 'rehype-highlight', 'i18n', 'reading-time'],
    github: 'https://github.com/Allen4911',
    demo: null,
    image: '/images/projects/study-notes.svg',
    featured: true,
    icon: 'SN',
    color: '#272729',
    problem: 'Study notes were scattered across tools, paper, and code comments with no unified retrieval.',
    solution:
      'Centralized a markdown-first system with category taxonomy, search, and reading-time metadata.',
    result: 'A personal knowledge base organized across core frontend categories.',
  },
]

export function getProjectById(id: string): Project | null {
  return projects.find((p) => p.id === id) || null
}
