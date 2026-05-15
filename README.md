# Allen Kim Portfolio

[![CI](https://github.com/Allen4911/work/actions/workflows/allen-portfolio-ci.yml/badge.svg)](https://github.com/Allen4911/work/actions/workflows/allen-portfolio-ci.yml)
![Tests](https://img.shields.io/badge/tests-92%20passed-brightgreen)

Personal portfolio site built with Next.js 14.

## Featured Projects

- **OpenClaw Bridge** — Telegram-to-Claude CLI bridge for AI team coordination ([GitHub](https://github.com/Allen4911/openclaw-claude-bridge))
- **OpenClaw 실전 가이드** — 스마트폰으로 AI 팀 원격 지휘 전자책

## Tech Stack

React, Next.js 14, Tailwind CSS, Vercel

## Features

### Dark Mode
- `tailwind.config.js` — `darkMode: 'class'` 설정
- `DarkModeToggle` 컴포넌트 — `<html>` 클래스 토글, aria-label 동적 변경
- GlobalNav에 통합

### i18n (한/영 전환)
- `LanguageContext` — React Context + Provider + `useLanguage` hook
- GlobalNav KO/EN 토글 버튼
- `src/i18n/index.ts` — 전체 페이지 한/영 번역 데이터

### Contact Form
- `ContactForm` 컴포넌트 — name / email / message 필드
- 이메일 형식 검증 (`isValidEmail`), 공백 방지
- Formspree 연동 (`NEXT_PUBLIC_FORMSPREE_ID` 환경변수)
- 접근성: `aria-required`, `role="alert"`, `role="status"`

### SEO
- Open Graph: `og:title`, `og:description`, `og:image` (1200×630)
- Twitter Card: `summary_large_image`, `twitter:creator`, `twitter:site`
- `metadataBase`, `robots` 설정

## Tests

```bash
npm test
```

92개 테스트 통과 (Jest + Testing Library)

## Development

```bash
npm install && npm run dev
```

## Environment Variables

```
NEXT_PUBLIC_FORMSPREE_ID=your_formspree_id
ADMIN_SESSION_SECRET=your_secret
ADMIN_USER=admin
ADMIN_PASSWORD=your_password
```
