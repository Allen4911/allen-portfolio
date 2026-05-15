export interface StudyTranslations {
  badge: string
  title: string
  subtitle: string
  uploadBtn: string
  searchPlaceholder: string
  postsCount: (n: number) => string
  dropHint: string
  emptyMsg: string
  emptyHint: string
  deleteConfirm: string
  toastDeleted: string
  toastUploaded: (n: number) => string
  toastMdOnly: string
  tagAll: string
  modalTitle: string
  modalQueue: (n: number) => string
  modalFieldTitle: string
  modalFieldDate: string
  modalAutoDate: string
  modalFieldTags: string
  modalTagPlaceholder: string
  modalTagHint: string
  modalFieldSummary: string
  modalSummaryPlaceholder: string
  modalCancel: string
  modalConfirm: string
}

export interface AppTranslations {
  nav: { home: string; study: string; portfolio: string; contact: string }
  home: {
    badge: string
    heroTitle1: string
    heroTitle2: string
    heroSubtitle: string
    heroCta: string
    heroPortfolio: string
    expertiseTitle: string
    expertiseDesc: string
    editDone: string
    editBtn: string
    addCard: string
    techTitle: string
    recentTitle: string
    viewAll: string
    contactTitle: string
    contactDesc: string
    deleteCardConfirm: string
  }
  study: StudyTranslations
  post: {
    back: string
    download: string
    backList: string
    uploaded: string
    notFound: string
    notFoundMsg: string
    notFoundLink: string
  }
  footer: { stack: string }
}

export type Locale = 'ko' | 'en'

export const translations: Record<Locale, AppTranslations> = {
  ko: {
    nav: {
      home: 'Home',
      study: 'Study',
      portfolio: 'Portfolio',
      contact: 'Contact',
    },
    home: {
      badge: 'Embedded Communication Engineer',
      heroTitle1: '통신 스택을 만듭니다',
      heroTitle2: '실리콘부터 프로토콜까지',
      heroSubtitle: '군용 위성통신 · LTE/5G 모뎀 SW · Xilinx RFSoC · 유무선 네트워크',
      heroCta: 'Study Archive →',
      heroPortfolio: 'Portfolio',
      expertiseTitle: 'Expertise',
      expertiseDesc:
        '실무 통신 SW 엔지니어로서 임베디드 레이어부터 프로토콜 스택까지, 수직 통합된 기술 역량을 보유하고 있습니다.',
      editDone: '완료',
      editBtn: '편집',
      addCard: '카드 추가',
      techTitle: 'Tech Stack',
      recentTitle: 'Recent Study',
      viewAll: 'All posts →',
      contactTitle: 'Contact',
      contactDesc: '기술 협업, 프로젝트 문의, 연구 교류는 언제든 환영합니다.',
      deleteCardConfirm: '이 카드를 삭제할까요?',
    },
    study: {
      badge: 'Technical Archive',
      title: 'Study',
      subtitle:
        '임베디드 통신 시스템, 무선 프로토콜, RF 하드웨어에 관한 기술 문서 아카이브입니다.',
      uploadBtn: 'Upload .md',
      searchPlaceholder: '게시글 검색...',
      postsCount: (n: number) => `${n}개 게시글`,
      dropHint: '.md 파일을 여기에 놓으세요',
      emptyMsg: '일치하는 게시글이 없습니다.',
      emptyHint: '.md 파일을 드래그하거나 Upload 버튼으로 추가하세요.',
      deleteConfirm: '이 게시글을 삭제할까요?',
      toastDeleted: '삭제됐습니다.',
      toastUploaded: (n: number) => `${n}개 파일이 업로드됐습니다.`,
      toastMdOnly: '.md 파일만 업로드할 수 있습니다.',
      tagAll: '전체',
      modalTitle: '게시글 정보 입력',
      modalQueue: (n: number) => `${n}개 대기 중`,
      modalFieldTitle: 'Title',
      modalFieldDate: 'Date',
      modalAutoDate: '자동',
      modalFieldTags: 'Tags',
      modalTagPlaceholder: '태그 입력 후 Enter 또는 ,',
      modalTagHint: 'Enter 또는 , 로 태그를 추가하세요.',
      modalFieldSummary: 'Summary',
      modalSummaryPlaceholder: '게시글 한 줄 요약 (선택)',
      modalCancel: '건너뛰기',
      modalConfirm: '업로드',
    },
    post: {
      back: '← Study',
      download: 'Download .md',
      backList: '← 목록으로 돌아가기',
      uploaded: 'Uploaded',
      notFound: '404 — 게시글을 찾을 수 없습니다.',
      notFoundMsg: '해당 게시글을 찾을 수 없습니다.',
      notFoundLink: '← Study 목록으로',
    },
    footer: { stack: 'React + Vite로 제작 · 기본 다크 모드' },
  },

  en: {
    nav: {
      home: 'Home',
      study: 'Study',
      portfolio: 'Portfolio',
      contact: 'Contact',
    },
    home: {
      badge: 'Embedded Communication Engineer',
      heroTitle1: 'Building the',
      heroTitle2: 'Communication Stack\nfrom Silicon to Protocol',
      heroSubtitle:
        'Military SATCOM · LTE/5G Modem SW · Xilinx RFSoC · Wired & Wireless Networks',
      heroCta: 'Study Archive →',
      heroPortfolio: 'Portfolio',
      expertiseTitle: 'Expertise',
      expertiseDesc:
        'As a practical communication SW engineer, I hold vertically integrated technical capabilities from the embedded layer to the full protocol stack.',
      editDone: 'Done',
      editBtn: 'Edit',
      addCard: 'Add Card',
      techTitle: 'Tech Stack',
      recentTitle: 'Recent Study',
      viewAll: 'All posts →',
      contactTitle: 'Contact',
      contactDesc: 'Open to technical collaboration, project inquiries, and research exchanges.',
      deleteCardConfirm: 'Delete this card?',
    },
    study: {
      badge: 'Technical Archive',
      title: 'Study',
      subtitle:
        'A technical document archive on embedded communication systems, wireless protocols, and RF hardware.',
      uploadBtn: 'Upload .md',
      searchPlaceholder: 'Search posts...',
      postsCount: (n: number) => `${n} post${n !== 1 ? 's' : ''}`,
      dropHint: 'Drop .md files here',
      emptyMsg: 'No matching posts found.',
      emptyHint: 'Drag .md files or click the Upload button to add posts.',
      deleteConfirm: 'Delete this post?',
      toastDeleted: 'Deleted.',
      toastUploaded: (n: number) => `${n} file${n !== 1 ? 's' : ''} uploaded.`,
      toastMdOnly: 'Only .md files are allowed.',
      tagAll: 'All',
      modalTitle: 'Post Information',
      modalQueue: (n: number) => `${n} in queue`,
      modalFieldTitle: 'Title',
      modalFieldDate: 'Date',
      modalAutoDate: 'auto',
      modalFieldTags: 'Tags',
      modalTagPlaceholder: 'Type a tag and press Enter or ,',
      modalTagHint: 'Press Enter or , to add a tag.',
      modalFieldSummary: 'Summary',
      modalSummaryPlaceholder: 'Brief description (optional)',
      modalCancel: 'Skip',
      modalConfirm: 'Upload',
    },
    post: {
      back: '← Study',
      download: 'Download .md',
      backList: '← Back to list',
      uploaded: 'Uploaded',
      notFound: '404 — Post Not Found',
      notFoundMsg: 'The requested post could not be found.',
      notFoundLink: '← Back to Study',
    },
    footer: { stack: 'Built with React + Vite · Dark by default' },
  },
}
