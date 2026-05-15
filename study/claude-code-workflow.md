# AI-Assisted Development with Claude Code

Claude Code는 터미널에서 실행되는 AI 코딩 에이전트입니다. 단순한 코드 생성 도구가 아니라, 파일 읽기/쓰기, 명령어 실행, Git 작업까지 수행하는 자율 개발 파트너입니다. 이 글은 Claude Code를 팀 개발 환경에 실제로 통합한 경험을 정리합니다.

## 기본 사용 패턴

### 인터랙티브 세션

```bash
claude                    # 대화형 세션 시작
claude "함수 리팩토링해줘"  # 단일 명령 실행
claude -p "코드 리뷰"      # 파이프 입력
```

### 프로젝트 컨텍스트 활용

Claude Code는 시작 시 현재 디렉토리의 `CLAUDE.md`를 자동으로 읽습니다. 프로젝트 규칙, 금지 패턴, 기술 스택을 여기에 정의하면 매 대화마다 반복 설명할 필요가 없습니다.

```markdown
# CLAUDE.md 예시
## 금지 사항
- any 타입 사용 금지
- console.log 커밋 금지
- 테스트 없이 구현 코드 작성 금지

## 기술 스택
- Next.js 14 App Router
- TypeScript strict
- Tailwind CSS
```

## TDD 워크플로우

Claude Code와 TDD를 결합하면 높은 신뢰성을 확보할 수 있습니다.

### 1단계: 테스트 먼저 작성

```bash
claude "EmailValidator 클래스 테스트를 먼저 작성해줘.
유효한 이메일, 빈 문자열, @ 없는 문자열 케이스 포함."
```

Claude가 `__tests__/EmailValidator.test.ts`를 생성합니다:

```typescript
describe('EmailValidator', () => {
  it('유효한 이메일을 통과시킨다', () => {
    expect(EmailValidator.validate('user@example.com')).toBe(true);
  });
  
  it('빈 문자열을 거부한다', () => {
    expect(EmailValidator.validate('')).toBe(false);
  });
  
  it('@ 없는 문자열을 거부한다', () => {
    expect(EmailValidator.validate('notanemail')).toBe(false);
  });
});
```

### 2단계: 실패 확인

```bash
npm test -- EmailValidator  # RED: 3개 실패 확인
```

### 3단계: 구현

```bash
claude "테스트를 통과하도록 EmailValidator 구현해줘"
npm test -- EmailValidator  # GREEN: 3개 통과 확인
```

## 멀티 에이전트 패턴

복잡한 프로젝트에서는 여러 Claude Code 인스턴스를 tmux로 병렬 실행합니다.

```bash
# tmux 레이아웃
tmux new-session -s dev
tmux split-window -h
tmux split-window -v

# Pane 0: 구현 담당
# Pane 1: 테스트/리뷰 담당
# Pane 2: 문서/분석 담당
```

역할 분리의 핵심은 각 에이전트의 `CLAUDE.md`를 다르게 설정하는 것입니다:

```markdown
# 리뷰어 에이전트 CLAUDE.md
당신은 코드 리뷰어입니다.
- 구현 코드를 직접 작성하지 않습니다
- 버그, 보안 취약점, 성능 문제만 지적합니다
- 리뷰 결과를 REVIEW.md에 기록합니다
```

## Git 작업 자동화

Claude Code는 Git 명령어를 직접 실행합니다. 안전하게 활용하는 패턴:

### 커밋 자동화

```bash
claude "변경사항을 커밋해줘. 
컨벤션: feat/fix/refactor/docs/test 접두사 사용"
```

Claude가 `git diff`를 분석하고 적절한 커밋 메시지를 생성합니다:

```
feat: EmailValidator 클래스 추가 및 테스트 3건 작성

- 이메일 형식 검증 로직 구현
- 빈 문자열, @ 누락 케이스 처리
- 단위 테스트 100% 통과
```

### PR 생성

```bash
claude "이 브랜치의 변경사항으로 PR 생성해줘. 
base: main, reviewer: @teamlead"
```

## Hooks를 이용한 자동화

`settings.json`에 Hooks를 설정하면 Claude Code 이벤트에 자동으로 반응합니다:

### 코드 저장 시 자동 lint

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "npm run lint --fix" }
        ]
      }
    ]
  }
}
```

### 작업 완료 시 Telegram 알림

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "curl -s -X POST '$TELEGRAM_API' -d 'chat_id=$CHAT_ID&text=Claude+작업완료'"
          }
        ]
      }
    ]
  }
}
```

## 컨텍스트 관리

Claude Code의 컨텍스트 창은 유한합니다. 긴 세션에서 효율적으로 관리하는 방법:

### /clear 전략

중요 결정사항을 파일에 저장한 뒤 `/clear`로 컨텍스트를 초기화합니다:

```bash
claude "현재 세션의 결정사항을 SESSION_NOTES.md에 저장해줘"
# /clear
claude "SESSION_NOTES.md 읽고 이어서 작업해줘"
```

### 압축 요약 활용

```bash
claude "지금까지 작업한 내용을 3줄로 요약하고, 
다음 세션에서 재개할 체크포인트를 CHECKPOINT.md에 저장해줘"
```

## 실무 팁

### 구체적인 지시가 좋은 결과를 만든다

```bash
# 나쁜 지시
claude "이 코드 고쳐줘"

# 좋은 지시  
claude "src/utils/date.js의 formatDate 함수가 
UTC 시간을 KST(+9:00)로 변환하지 못하는 버그를 수정해줘.
수정 후 기존 테스트가 모두 통과하는지 확인해줘."
```

### 작업 단위를 작게 쪼개기

하나의 대화에서 너무 많은 작업을 요청하면 중간에 실수가 발생해도 추적이 어렵습니다. 기능 단위로 분리해서 각각 확인하는 것이 안전합니다.

### 검증을 Claude에게 맡기기

```bash
claude "방금 작성한 코드가 기존 기능을 깨지 않는지 
전체 테스트 스위트를 실행하고 결과 알려줘"
```

## 보안 고려사항

- `settings.json`의 `permissions.deny`에 위험한 명령어 등록
- `.env` 파일은 Claude가 읽을 수 없도록 `.gitignore`에 명시
- 프로덕션 데이터베이스 자격증명은 환경변수로만 관리
- `--dangerously-skip-permissions` 플래그는 CI 환경 외 사용 금지

```json
{
  "permissions": {
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force *)",
      "Bash(DROP TABLE *)"
    ]
  }
}
```

## 요약

Claude Code의 핵심 가치는 반복적인 작업 자동화와 즉각적인 피드백 루프입니다. CLAUDE.md로 프로젝트 규칙을 학습시키고, Hooks로 검증을 자동화하고, TDD 워크플로우로 신뢰성을 확보하면, AI가 단순 도구가 아니라 실제 팀원처럼 협업할 수 있는 환경이 만들어집니다.
