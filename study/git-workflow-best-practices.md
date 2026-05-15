# Git Workflow Best Practices

Git은 도구가 아니라 팀 협업의 언어입니다. 코드 변경 이력을 명확하게 관리하고, 빠른 협업과 안전한 배포를 가능하게 하는 Git 워크플로우 패턴을 정리합니다.

## 브랜치 전략

### GitHub Flow (소규모 팀, 빠른 배포)

```
main (항상 배포 가능한 상태)
  ├── feature/user-auth
  ├── fix/login-500-error
  └── chore/update-deps
```

1. `main`에서 브랜치 생성
2. 작업 완료 → PR 생성
3. 리뷰 + CI 통과 → `main`에 merge
4. 즉시 배포

**언제 쓰나:** 웹 서비스, SaaS, 지속적 배포 환경

### Git Flow (복잡한 릴리즈 관리)

```
main        (프로덕션)
develop     (통합 브랜치)
  ├── feature/payment-api
  ├── feature/notification
  └── release/v2.3.0
        └── hotfix/critical-bug → main + develop
```

**언제 쓰나:** 모바일 앱, 정해진 릴리즈 주기가 있는 제품

### Trunk-Based Development (대규모 팀)

모든 개발자가 `main`에 직접 작업. Feature Flag로 미완성 기능을 숨깁니다:

```javascript
// 기능 플래그 예시
if (featureFlags.isEnabled('new-checkout')) {
  return <NewCheckoutFlow />;
}
return <LegacyCheckoutFlow />;
```

## 커밋 컨벤션 (Conventional Commits)

```
<type>(<scope>): <subject>

<body>

<footer>
```

### type 목록

| type | 용도 |
|------|------|
| `feat` | 새 기능 추가 |
| `fix` | 버그 수정 |
| `refactor` | 기능 변경 없는 코드 개선 |
| `perf` | 성능 개선 |
| `test` | 테스트 추가/수정 |
| `docs` | 문서 변경 |
| `chore` | 빌드, 의존성, 설정 변경 |
| `ci` | CI/CD 설정 변경 |
| `revert` | 이전 커밋 되돌리기 |

### 좋은 커밋 메시지

```bash
# 나쁜 예
git commit -m "수정"
git commit -m "fix bug"
git commit -m "작업 완료"

# 좋은 예
git commit -m "fix(auth): 로그인 실패 시 500 반환하던 버그 수정

세션이 만료된 상태에서 /api/me 호출 시 서버가 500을 반환하던 문제.
JWT 검증 실패를 401로 올바르게 처리하도록 수정.

Fixes #234"
```

**원칙:**
- 제목은 50자 이내, 현재형 동사로 시작
- "what"이 아닌 "why"를 설명
- 관련 이슈 번호 참조

## 효과적인 PR(Pull Request)

### PR 크기

큰 PR은 리뷰가 어렵습니다. 하루에 리뷰할 수 있는 적절한 크기:

```
이상적: 200~400 라인 변경
허용:   400~800 라인 변경
위험:   800 라인 이상 → 분리 검토
```

### PR 설명 템플릿

```markdown
## 변경 내용
- 사용자 프로필 수정 API 추가 (PATCH /api/users/:id)
- 이름, 이메일, 바이오 필드 변경 지원
- 이메일 변경 시 인증 재확인 로직 추가

## 변경 이유
기존에 프로필 수정 기능이 없어 사용자가 가입 후 정보를 수정할 수 없었음.

## 테스트 방법
1. `npm test -- --grep "profile update"`
2. Postman: PATCH /api/users/1 with { "name": "새이름" }

## 스크린샷 (UI 변경 시)
[이미지]

## 체크리스트
- [x] 테스트 작성
- [x] 문서 업데이트
- [ ] 마이그레이션 필요 (없음)
```

## 자주 쓰는 Git 명령어

### 작업 임시 저장

```bash
# 작업 중 다른 브랜치로 전환할 때
git stash push -m "WIP: 결제 모듈 구현 중"

# 저장 목록 확인
git stash list

# 가장 최근 stash 복원
git stash pop

# 특정 stash 복원
git stash apply stash@{2}
```

### 커밋 수정

```bash
# 마지막 커밋 메시지 수정
git commit --amend -m "fix(auth): 로그인 버그 수정"

# 마지막 커밋에 파일 추가
git add forgotten-file.js
git commit --amend --no-edit

# 주의: push한 커밋을 amend하면 강제 push 필요 (팀 작업 시 위험)
```

### 변경 이력 탐색

```bash
# 특정 파일 변경 이력
git log --follow -p src/utils/date.js

# 특정 문자열이 언제 추가/삭제됐는지
git log -S "formatDate" --patch

# 누가 이 줄을 작성했는지
git blame src/utils/date.js

# 특정 날짜 범위
git log --after="2024-01-01" --before="2024-03-31"
```

### 실수 복구

```bash
# 스테이징 취소 (파일 변경 유지)
git restore --staged file.js

# 파일 변경 취소 (마지막 커밋 상태로 복원)
git restore file.js

# 커밋 취소 (변경사항 유지)
git reset --soft HEAD~1

# 커밋 취소 (변경사항도 삭제) — 주의!
git reset --hard HEAD~1

# 이미 push한 커밋을 되돌릴 때 (새 커밋으로 안전하게)
git revert HEAD
```

### 인터랙티브 리베이스

```bash
# 최근 3개 커밋 정리
git rebase -i HEAD~3

# 에디터에서:
# pick → squash (이전 커밋과 합치기)
# pick → reword (메시지 수정)
# pick → drop (커밋 삭제)
# pick → edit (커밋 분리)
```

## CI/CD 연동 전략

```yaml
# .github/workflows/pr-check.yml
name: PR Check

on:
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
      - run: npm run build
      
      - name: Coverage Report
        uses: codecov/codecov-action@v4
```

## 보안 고려사항

```bash
# .gitignore에 반드시 포함
.env
.env.local
*.pem
*.key
node_modules/
.DS_Store

# 이미 커밋된 민감 정보 제거 (BFG Repo-Cleaner)
bfg --delete-files .env
bfg --replace-text passwords.txt

# 커밋 후 반드시 자격증명 교체
```

### git-secrets 설치 (예방)

```bash
git secrets --install
git secrets --register-aws  # AWS 키 패턴 등록
git secrets --add 'password\s*=\s*.+'
```

## 팀 표준 설정

```bash
# .gitconfig 권장 설정
[core]
  autocrlf = input        # CRLF → LF 자동 변환
  editor = code --wait

[pull]
  rebase = true           # pull 시 rebase 기본값

[push]
  default = current       # 현재 브랜치만 push

[alias]
  lg = log --oneline --graph --decorate --all
  st = status -s
  co = checkout
  br = branch
  unstage = restore --staged
```

Git 워크플로우의 핵심은 "이력이 나중에 의미 있는가"입니다. 깔끔한 커밋 이력은 버그 추적, 기능 롤백, 신규 팀원 온보딩을 모두 쉽게 만듭니다. 도구보다 팀 전체가 따르는 규칙이 더 중요합니다.
