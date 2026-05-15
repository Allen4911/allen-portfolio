export interface ExpertiseArea {
  icon: string
  title: string
  description: string
  tags: string[]
}

export const expertiseIntro =
  '실무 통신 SW 엔지니어로서 임베디드 레이어부터 프로토콜 스택까지, 수직 통합된 기술 역량을 보유하고 있습니다. AI 에이전트 시스템 구축 및 기술 저술 분야도 병행하고 있습니다.'

export const expertiseAreas: ExpertiseArea[] = [
  {
    icon: '📡',
    title: 'Satellite Communication',
    description:
      'Military SATCOM 시스템 설계 및 운용. GEO/LEO 위성 통신 링크 버짓 분석, 항재밍 파형 연구.',
    tags: ['Satellite', 'Communication', 'Military'],
  },
  {
    icon: '📶',
    title: 'LTE / 5G Modem SW',
    description:
      'PHY/MAC/RLC 계층 소프트웨어 구현. 3GPP 표준 기반 모뎀 프레임워크 설계 및 최적화.',
    tags: ['LTE', '5G', 'Modem', 'Protocol'],
  },
  {
    icon: '⚡',
    title: 'Xilinx RFSoC / FPGA',
    description:
      'Zynq UltraScale+ RFSoC 플랫폼 활용. 고속 ADC/DAC 직접 샘플링, DSP 파이프라인 설계.',
    tags: ['RFSoC', 'Xilinx', 'Embedded'],
  },
  {
    icon: '🔌',
    title: 'Embedded Systems',
    description:
      '리얼타임 임베디드 SW 개발. 베어메탈 BSP 및 RTOS 기반 드라이버/미들웨어 구현.',
    tags: ['Embedded', 'Network'],
  },
  {
    icon: '🤖',
    title: 'AI Agent Systems',
    description:
      'Claude CLI 기반 멀티에이전트 팀 구성 및 운용. Telegram 브릿지, TMUX 세션 관리, 장기 기억 시스템 설계.',
    tags: ['Claude', 'AI', 'Automation', 'Telegram'],
  },
  {
    icon: '📚',
    title: 'Technical Writing',
    description:
      'AI 도구 실전 활용 전자책 저술. WikiDocs 출판 경험 보유, 개발자 독자를 위한 단계별 기술 가이드 집필.',
    tags: ['WikiDocs', 'Technical Writing', 'Guide'],
  },
]
