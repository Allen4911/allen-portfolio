# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [P2] — 2026-05-14

### Added

- **i18n (다국어 지원)** `2bc70e1`
  - `LanguageContext` (Provider + `useLanguage` hook) — KO/EN 토글
  - `GlobalNav` 언어 토글 버튼 (`aria-label` 동적 변경)

- **ContactForm** `2bc70e1`
  - Formspree 연동 이메일 문의 폼
  - 이메일 정규식 유효성 검사
  - `submitting` 중 버튼 disabled 처리
  - `role="alert"` / `role="status"` 접근성 처리

- **다크모드** `142c68d`
  - `tailwind.config.ts` — `darkMode: 'class'` 설정
  - `DarkModeToggle` 컴포넌트 (GlobalNav 통합)
  - 전체 섹션 `dark:` 클래스 적용

- **SEO 강화** `264fde7`
  - `twitter.creator` / `twitter.site` 메타태그 추가
  - Open Graph 및 Twitter Card 메타태그 TDD 검증

### Fixed

- **ContactForm 접근성 개선** `ba129fb`
  - `aria-required` 3개 필드 추가
  - `isComplete` + `isValidEmail` 통합으로 버튼 UX 개선
  - `trim()` 중복 제거

- **Formspree ID 환경변수 분리** `e63a348`
  - 하드코딩된 endpoint ID → `NEXT_PUBLIC_FORMSPREE_ID` 환경변수 처리

### Documentation

- **README 업데이트** `d7b6abf`
  - P2 추가 기능(다크모드/i18n/ContactForm/SEO) 반영

---

## [P1] — 2026-05 이전

- 초기 포트폴리오 구성 (Hero, About, Projects, Skills 섹션)
