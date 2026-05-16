# AI 블로그 사이드바 UI — 수아 디자인 스펙

> 작성자: 수아 | 날짜: 2026-05-16 | 대상: 서연(구현)

---

## 개요

allen-portfolio에 `/blog` 라우트를 신설하고, 기존 `BlogSidebar.tsx`를 실제 레이아웃에 통합한다.
AI 엔지니어링 포트폴리오 성격에 맞게 사이드바는 글 탐색과 콘텐츠 발견에 집중한다.

---

## 1. 페이지 레이아웃

### 1-1. 블로그 목록 페이지 (`/blog`)

```
┌──────────────────────────────────────────────────┐
│  Nav (기존 공통 헤더)                              │
├──────────────────────────────────────────────────┤
│  Hero 영역 (제목 + 설명 — 좁게, 40px 이하)         │
├────────────────────────┬─────────────────────────┤
│                        │                         │
│  PostCard 목록 (2col)  │  BlogSidebar            │
│  — 최신순              │  — Categories           │
│  — 카테고리 필터 탭    │  — Trending             │
│                        │  — Newsletter           │
│                        │                         │
└────────────────────────┴─────────────────────────┘
```

**컬럼 비율**: `main: 2fr` / `sidebar: 1fr` (max 320px)
**Gap**: `64px`
**모바일(<768px)**: 사이드바 숨김 → 목록 풀너비

---

### 1-2. 블로그 상세 페이지 (`/blog/[slug]`)

```
┌──────────────────────────────────────────────────┐
│  Nav                                              │
├──────────────────────────────────────────────────┤
│  Breadcrumb: Blog > 카테고리 > 글 제목             │
├────────────────────────┬─────────────────────────┤
│                        │                         │
│  Article               │  BlogSidebar (sticky)   │
│  — h1 제목             │  — Reading Stats        │
│  — 메타 (날짜·태그)    │  — On This Page (ToC)   │
│  — 본문 (mdx)          │  — Series               │
│                        │  — Recommended          │
│                        │  — GitHub               │
│                        │                         │
└────────────────────────┴─────────────────────────┘
```

**Sidebar position**: `sticky top-24` (Nav 높이 고려)
**Article max-width**: `680px`

---

## 2. BlogSidebar 기능 정의

기존 `BlogSidebar.tsx`의 섹션별 사용 지침:

| 섹션 | 목록 페이지 | 상세 페이지 | 비고 |
|------|:-----------:|:-----------:|------|
| Reading Stats | ✗ | ✓ | 상세에서만 의미 있음 |
| On This Page | ✗ | ✓ | mdx 헤딩 자동 추출 |
| Series | ✗ | 조건부 | 시리즈 글에만 표시 |
| Categories | ✓ | ✗ | 목록 탐색용 |
| Recommended | ✓ | ✓ | 튜토리얼 추천 |
| Trending | ✓ | ✗ | 목록 발견용 |
| GitHub | ✗ | 조건부 | 코드 첨부 글만 |
| Newsletter | ✓ | ✓ | 항상 표시 |

---

## 3. 디자인 토큰 (DESIGN.md 준수)

| 속성 | 값 |
|------|----|
| 사이드바 배경 | 투명 (카드 없음) |
| 섹션 구분선 | `border-t border-[#e0e0e0] dark:border-[#3a3a3c]` |
| 섹션 제목 | `11px / 600 / uppercase / tracking-[0.08em] / #7a7a7a` |
| Active 색상 | `#0066cc` (light) / `#2997ff` (dark) |
| Body 텍스트 | `13px / #1d1d1f dark:white` |
| Muted 텍스트 | `#7a7a7a dark:#8a8a8e` |
| Radius | `rounded-md` (8px) |

---

## 4. 반응형 정의

| 브레이크포인트 | 레이아웃 |
|---------------|---------|
| `< 768px` | 1컬럼, 사이드바 숨김 |
| `768px ~ 1024px` | 사이드바 너비 240px |
| `> 1024px` | 사이드바 너비 280~320px |

**모바일 대체 UI**: 상세 페이지에서 사이드바 숨길 때 ToC는 본문 상단에 드로어로 노출 (`[목차 보기]` 버튼)

---

## 5. 파일 구조 (서연 구현 가이드)

```
src/
  app/
    blog/
      page.tsx              ← 블로그 목록 페이지
      [slug]/
        page.tsx            ← 블로그 상세 페이지
  components/
    blog/
      BlogSidebar.tsx       ← 기존 (수정 최소화)
      BlogLayout.tsx        ← NEW: 2컬럼 레이아웃 래퍼
      PostCard.tsx          ← 기존 활용
  data/
    blog/                   ← mdx 또는 json 포스트
```

---

## 6. 주요 인터랙션

- **ToC 활성 헤딩**: `IntersectionObserver`로 스크롤 위치 추적 → `activeHeading` prop 전달
- **카테고리 필터**: 클릭 시 URL 쿼리 파라미터 `?category=slug` 업데이트, 목록 필터링
- **Newsletter**: 현재 mock (setSubscribed) → 추후 실제 API 연동 고려

---

## 7. 수아 메모

- `BlogSidebar.tsx`는 이미 완성도 높음. **수정 최소화** 원칙.
- 핵심 작업은 `BlogLayout.tsx` + 라우트 페이지 2개 신설.
- 샘플 포스트 데이터(JSON 또는 mdx) 최소 3개 필요 → 지훈에게 콘텐츠 요청 고려.
- 다크모드 대응은 DESIGN.md 토큰 그대로 사용, 별도 처리 불필요.
