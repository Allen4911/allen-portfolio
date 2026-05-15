# Contributing to Allen Portfolio

## 개발환경 설정

**요구사항:** Node.js 20+, npm 10+

```bash
git clone https://github.com/Allen4911/work.git
cd work/allen-portfolio
npm install
cp .env.example .env.local   # NEXT_PUBLIC_FORMSPREE_ID 설정
npm run dev                  # http://localhost:3000
```

**테스트 실행:**
```bash
npm test                     # 전체 테스트
npm test -- --coverage       # 커버리지 포함
npm run build                # 프로덕션 빌드 검증
```

## PR 가이드라인

1. `main` 브랜치에서 feature 브랜치 생성: `git checkout -b feat/기능명`
2. 변경사항 커밋 (아래 커밋 컨벤션 참고)
3. PR 생성 전 테스트 전체 통과 확인: `npm test`
4. PR 제목은 커밋 메시지 형식과 동일하게 작성
5. CI 뱃지(GitHub Actions)가 green 상태여야 merge 가능

**브랜치 네이밍:**
- `feat/` — 새 기능
- `fix/` — 버그 수정
- `docs/` — 문서 변경
- `refactor/` — 리팩터링

## 코드 스타일

**커밋 컨벤션 (Conventional Commits):**
```
feat: 새 기능 추가
fix: 버그 수정
docs: 문서 변경
style: 포맷팅 (기능 변경 없음)
refactor: 코드 리팩터링
test: 테스트 추가/수정
chore: 빌드/설정 변경
```

**TypeScript:**
- `any` 타입 사용 금지
- 컴포넌트 props는 명시적 interface 정의

**테스트:**
- 모든 기능은 TDD로 구현 (실패 테스트 → 구현 → 통과)
- 새 컴포넌트에는 렌더링 테스트 필수
- 커버리지 80% 이상 유지

**스타일:**
- Tailwind CSS 클래스 사용 (인라인 스타일 지양)
- 다크모드: `dark:` prefix 클래스 병행 작성
- i18n: 텍스트는 `useLanguage` hook의 번역 키 사용
