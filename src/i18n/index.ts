export type Locale = 'en' | 'ko'

const translations = {
  en: {
    nav: {
      logo: 'Allen',
      about: 'About',
      projects: 'Projects',
      study: 'Study',
      contact: 'Contact',
      hire: 'Hire me',
    },
    hero: {
      tagline: 'Frontend Developer',
      name: 'Allen Kim',
      subtitle: 'I build clean, fast, and thoughtful web experiences.',
      description:
        'Specializing in React and Next.js, with an eye for design systems, accessibility, and performance. Currently exploring AI-driven developer tooling.',
      cta_primary: 'View Projects',
      cta_secondary: 'Contact',
    },
    projects: {
      title: 'Projects',
      subtitle: "Things I've built — problems I found and chose to solve.",
      view_details: 'View Details',
      github: 'GitHub',
      live_demo: 'Live Demo',
      view_all: 'See all projects',
      problem: 'Problem',
      solution: 'Solution',
      result: 'Result',
      tech_stack: 'Tech Stack',
      back: 'Back to Projects',
    },
    skills: {
      title: 'Skills',
      subtitle: 'Technologies I work with daily.',
    },
    study: {
      title: 'Study Notes',
      subtitle: "My ongoing learning log — notes I've taken while going deeper into topics that matter.",
      filter_all: 'All',
      reading_time: 'min read',
      back: 'Back to Study',
      search_placeholder: 'Search notes...',
    },
    contact: {
      title: 'Get in touch',
      subtitle: 'Open to new opportunities, collaborations, and interesting conversations.',
      send_email: 'Send Email',
      email: 'kjkim4911@gmail.com',
      github: 'GitHub',
      linkedin: 'LinkedIn',
    },
    footer: {
      copyright: '© 2026 Allen Kim. All rights reserved.',
      built_with: 'Built with Next.js + Tailwind CSS',
      columns: { about: 'About', projects: 'Projects', study: 'Study', contact: 'Contact' },
      links: {
        about: ['About me', 'Skills', 'Timeline', 'Resume'],
        projects: ['OpenClaw Bridge', 'Developer Portfolio', 'Study Notes App'],
        study: ['React', 'Next.js', 'JavaScript', 'CSS'],
        contact: ['Email', 'GitHub', 'LinkedIn'],
      },
    },
    about: {
      title: 'About',
      subtitle: 'Allen Kim',
      bio: '18+ years of telecom engineering, now building modern web tools and AI-powered developer tooling.',
      bio_extended:
        'Currently focused on React and Next.js ecosystems, building tools that help developers work smarter — including AI-powered CLI tooling and team coordination systems.',
      timeline_title: 'Journey',
      timeline: [
        { year: '2026', title: 'AI Developer Tooling', description: 'Building Claude CLI bridges and AI team coordination systems' },
        { year: '2025', title: 'Full-Stack Transition', description: 'Expanded into Node.js backends and API design' },
        { year: '2024', title: 'Frontend Specialist', description: 'Deep focus on React, Next.js, and design systems' },
        { year: '2023', title: 'Started Coding', description: 'JavaScript fundamentals, first React projects' },
      ],
      skills_title: 'What I work with',
      download_resume: 'Download Resume',
    },
    common: { loading: 'Loading...', not_found: 'Not found', back: 'Back' },
  },
  ko: {
    nav: {
      logo: 'Allen',
      about: '소개',
      projects: '프로젝트',
      study: '학습',
      contact: '연락',
      hire: '채용 문의',
    },
    hero: {
      tagline: '프론트엔드 개발자',
      name: 'Allen Kim',
      subtitle: '깔끔하고 빠르고 사려 깊은 웹 경험을 만듭니다.',
      description:
        'React와 Next.js를 중심으로, 디자인 시스템·접근성·성능에 집중하고 있습니다. 현재는 AI 기반 개발자 도구를 탐구 중입니다.',
      cta_primary: '프로젝트 보기',
      cta_secondary: '연락하기',
    },
    projects: {
      title: '프로젝트',
      subtitle: '제가 만든 것들 — 발견하고 해결하기로 선택한 문제들.',
      view_details: '상세 보기',
      github: 'GitHub',
      live_demo: '라이브 데모',
      view_all: '모든 프로젝트 보기',
      problem: '문제',
      solution: '해결',
      result: '결과',
      tech_stack: '기술 스택',
      back: '프로젝트 목록으로',
    },
    skills: { title: '기술 스택', subtitle: '매일 사용하는 기술들.' },
    study: {
      title: '학습 노트',
      subtitle: '제 지속적인 학습 기록 — 깊이 탐구하는 주제에 대한 노트입니다.',
      filter_all: '전체',
      reading_time: '분 읽기',
      back: '학습 목록으로',
      search_placeholder: '노트 검색...',
    },
    contact: {
      title: '연락하기',
      subtitle: '새로운 기회, 협업, 흥미로운 대화를 환영합니다.',
      send_email: '이메일 보내기',
      email: 'kjkim4911@gmail.com',
      github: 'GitHub',
      linkedin: 'LinkedIn',
    },
    footer: {
      copyright: '© 2026 Allen Kim. All rights reserved.',
      built_with: 'Next.js + Tailwind CSS로 제작',
      columns: { about: '소개', projects: '프로젝트', study: '학습', contact: '연락' },
      links: {
        about: ['소개', '기술 스택', '타임라인', '이력서'],
        projects: ['OpenClaw Bridge', '개발자 포트폴리오', '학습 노트 앱'],
        study: ['React', 'Next.js', 'JavaScript', 'CSS'],
        contact: ['이메일', 'GitHub', 'LinkedIn'],
      },
    },
    about: {
      title: '소개',
      subtitle: 'Allen Kim',
      bio: '통신 분야 18년 경력을 바탕으로 현대 웹 개발과 AI 도구를 만드는 개발자입니다.',
      bio_extended:
        '현재 React와 Next.js 생태계에 집중하며, AI 기반 CLI 도구와 팀 조율 시스템을 포함한 개발자 생산성 도구를 만들고 있습니다.',
      timeline_title: '여정',
      timeline: [
        { year: '2026', title: 'AI 개발자 도구', description: 'Claude CLI 브릿지 및 AI 팀 조율 시스템 개발' },
        { year: '2025', title: '풀스택 전환', description: 'Node.js 백엔드 및 API 설계 영역 확장' },
        { year: '2024', title: '프론트엔드 전문화', description: 'React, Next.js, 디자인 시스템에 집중' },
        { year: '2023', title: '코딩 시작', description: 'JavaScript 기초, 첫 React 프로젝트' },
      ],
      skills_title: '사용하는 기술',
      download_resume: '이력서 다운로드',
    },
    common: { loading: '로딩 중...', not_found: '찾을 수 없습니다', back: '뒤로' },
  },
} as const

export type TranslationKey = typeof translations

export function t(locale: string, path: string): unknown {
  const keys = path.split('.')
  let current: unknown = (translations as Record<string, unknown>)[locale] ?? translations.en
  for (const key of keys) {
    if (current === undefined || current === null) return path
    current = (current as Record<string, unknown>)[key]
  }
  return current ?? path
}

export { translations }
