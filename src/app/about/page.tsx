import SkillsGrid from '@/components/sections/SkillsGrid'

export const metadata = {
  title: 'About',
  description:
    'Communications software engineer with 18+ years of experience in protocol stacks, modem development, and AI tooling.',
}

const publications = [
  {
    title: '클로드 코드 멀티에이전트 팀 자동화 완성 가이드',
    description:
      'Windows·macOS·Docker 위에서 Claude Code 6인 에이전트 팀을 구성하고 Remote-Control로 원격 지휘. 환경 구축, 팀 레이아웃, 자동 실행, 핵심 도구(gstack·GSD·superpowers), 실전 운용까지 10장 수록.',
    url: '/books/claude-team-agent',
    status: '전자책',
  },
  {
    title: '텔레그램으로 만드는 나만의 AI 비서',
    description:
      '매일 아침 뉴스·영어회화·한미 주식 브리핑을 텔레그램으로 받는 ChatGPT 자동화 가이드. OpenClaw + ChatGPT(OAuth/API) 연결, 뉴스·주식 파이프라인, 09:00 스케줄링까지 단계별 수록.',
    url: '/books/my-secretary',
    status: '전자책 · WikiDocs',
  },
  {
    title: '클로드 코드 멀티에이전트 팀 지식관리 완성 가이드',
    description:
      'LLMWiki로 팀의 지식을 사라지지 않는 장기 기억으로. Atomic Note·Knowledge Pipeline·2계층 메모리·팀 산출물 자동 지식화로 스스로 학습하는 AI 개발팀을 구축하는 후속편.',
    url: '/books/llmwiki',
    status: '전자책',
  },
]

const timeline = [
  {
    year: '2023 –',
    title: 'AI Developer Tooling & Technical Writing',
    description: 'Claude CLI 기반 멀티에이전트 팀 시스템 구축. 전자책 3권 저술 — 멀티에이전트 팀 자동화 완성 가이드, 나만의 AI 비서 만들기, 팀 지식관리 완성 가이드.',
  },
  {
    year: '2020 –',
    title: '5G Modem SW',
    description: '5G NR PHY/MAC/RLC layer software implementation. Designed and optimized modem frameworks based on 3GPP Rel-15/16 standards.',
  },
  {
    year: '2015 –',
    title: 'LTE Modem SW & SATCOM',
    description: 'LTE MAC/RLC L2 protocol stack development. Military SATCOM link budget analysis and anti-jamming waveform research.',
  },
  {
    year: '2010 –',
    title: 'Embedded L2/L3 Protocol',
    description: 'Communication protocol L2/L3 stack design. Bare-metal BSP and RTOS-based driver and middleware implementation.',
  },
  {
    year: '2008 –',
    title: '통신 SW 엔지니어링',
    description: '임베디드 시스템 개발 시작. 상위 APP 계층부터 로우 레벨 SW 및 모뎀까지 수직 통합된 통신 소프트웨어 엔지니어링.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero — light canvas */}
      <section
        className="tile-light"
        style={{ paddingLeft: '22px', paddingRight: '22px' }}
        aria-label="About hero"
      >
        <div
          style={{
            maxWidth: '780px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '64px',
            alignItems: 'center',
          }}
          className="about-hero-grid"
        >
          {/* Bio */}
          <div>
            <p
              className="text-tagline"
              style={{ color: 'var(--color-primary)', marginBottom: '16px' }}
            >
              About
            </p>
            <h1 className="text-display-lg" style={{ marginBottom: '20px' }}>
              Allen
            </h1>
            <p className="text-body" style={{ marginBottom: '16px' }}>
              AI 팀 자동화와 Agentic AI Workflow를 중심으로, 사람과 AI가 협업하는 멀티 에이전트 시스템을 설계합니다.
            </p>
            <p
              className="text-body"
              style={{ color: 'var(--color-charcoal-whisper)', marginBottom: '32px' }}
            >
              Redis, GitHub, Obsidian, Claude Code 기반의 자동화 환경 위에서 효율적인 워크플로우와 안정적인 개발 시스템을 구축하고 있습니다. 복잡한 기술을 단순한 흐름으로 연결하고, 깔끔한 인터페이스와 견고한 구조를 만드는 것을 지향합니다.
            </p>
            <a href="/resume.pdf" className="btn-primary" style={{ display: 'inline-flex' }}>
              Download Resume
            </a>
          </div>
        </div>
      </section>

      {/* Timeline — dark tile */}
      <section
        id="timeline"
        className="tile-dark"
        style={{ paddingLeft: '22px', paddingRight: '22px' }}
        aria-label="Career timeline"
      >
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <p
            className="text-tagline"
            style={{ color: 'var(--color-primary)', marginBottom: '16px', textAlign: 'center' }}
          >
            Journey
          </p>
          <h2 className="text-display-lg" style={{ marginBottom: '48px', textAlign: 'center' }}>
            How I got here.
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {timeline.map((item, i) => (
              <div
                key={item.year}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr',
                  gap: '32px',
                  paddingBottom: i < timeline.length - 1 ? '40px' : '0',
                  position: 'relative',
                }}
                className="timeline-item"
              >
                {/* Year column */}
                <div style={{ paddingTop: '4px' }}>
                  <span
                    className="text-caption-strong"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {item.year}
                  </span>
                  {i < timeline.length - 1 && (
                    <div
                      style={{
                        width: '1px',
                        height: 'calc(100% - 24px)',
                        backgroundColor: 'var(--color-hairline)',
                        marginTop: '12px',
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-body-strong" style={{ marginBottom: '8px' }}>
                    {item.title}
                  </h3>
                  <p className="text-body" style={{ color: 'var(--color-charcoal-whisper)' }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publications — light canvas */}
      <section
        className="tile-light"
        style={{ paddingLeft: '22px', paddingRight: '22px' }}
        aria-label="Publications"
      >
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <p
            className="text-tagline"
            style={{ color: 'var(--color-primary)', marginBottom: '16px', textAlign: 'center' }}
          >
            Publications
          </p>
          <h2 className="text-display-lg" style={{ marginBottom: '48px', textAlign: 'center' }}>
            저서
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {publications.map((pub) => (
              <div
                key={pub.title}
                style={{
                  padding: '28px 32px',
                  borderRadius: '18px',
                  backgroundColor: 'var(--color-canvas-parchment)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <h3 className="text-body-strong" style={{ flex: 1 }}>
                    {pub.title}
                  </h3>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      padding: '4px 10px',
                      borderRadius: '100px',
                      backgroundColor: pub.status === '출판됨' ? 'var(--color-onyx-button)' : '#e0e0e0',
                      color: pub.status === '출판됨' ? '#ffffff' : 'var(--color-ink-muted-48)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {pub.status}
                  </span>
                </div>
                <p className="text-body" style={{ color: 'var(--color-charcoal-whisper)' }}>
                  {pub.description}
                </p>
                {pub.url && (
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-caption-strong"
                    style={{ color: 'var(--color-primary)', textDecoration: 'none' }}
                  >
                    Blog에서 읽기 →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills on parchment */}
      <SkillsGrid id="skills" />

      <style>{`
        @media (max-width: 640px) {
          .about-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .timeline-item {
            grid-template-columns: 60px 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </>
  )
}
