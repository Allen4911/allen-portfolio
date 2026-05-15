# CLAUDE.md & Hooks: Configuring Claude Code Behavior

Claude Code는 단순한 AI 코딩 도우미가 아닙니다. `CLAUDE.md` 파일과 Hooks 시스템을 통해 프로젝트별로 AI의 행동을 세밀하게 제어할 수 있습니다. 이 가이드는 실무에서 즉시 활용 가능한 설정 패턴을 다룹니다.

## CLAUDE.md 파일이란?

`CLAUDE.md`는 Claude Code가 프로젝트를 열 때 자동으로 읽는 마크다운 파일입니다. 여기에 작성된 지시사항은 모든 대화에 자동으로 적용됩니다.

### 파일 위치 우선순위

```
~/.claude/CLAUDE.md          # 전역 설정 (모든 프로젝트)
/project-root/CLAUDE.md      # 프로젝트 설정
/project-root/src/CLAUDE.md  # 하위 디렉토리 설정
```

하위 디렉토리 파일이 상위를 덮어쓰지 않고 **병합**됩니다. 전역 설정에 팀 규칙을, 프로젝트 설정에 코드베이스 특이사항을 분리하는 패턴이 효과적입니다.

### 실전 CLAUDE.md 작성법

```markdown
# Project Rules

## Tech Stack
- Next.js 14 App Router (pages/ 디렉토리 사용 금지)
- TypeScript strict mode
- Tailwind CSS (인라인 style 속성 사용 금지)

## Code Conventions
- 컴포넌트: PascalCase, 파일명 일치
- 훅: use 접두사 필수
- 테스트: 구현 전 실패 테스트 먼저 작성 (TDD)

## Forbidden Actions
- console.log 커밋 금지
- any 타입 사용 금지
- TODO 주석 없이 커밋 금지
```

## @참조로 파일 분리하기

CLAUDE.md가 길어지면 `@파일명` 문법으로 분리할 수 있습니다:

```markdown
# CLAUDE.md
@.claude/tdd-rules.md
@.claude/api-conventions.md
@.claude/deployment-guide.md
```

각 파일이 독립적으로 관리되므로 팀별 소유권 분리가 가능합니다.

## Hooks 시스템

Hooks는 Claude Code의 특정 이벤트에 쉘 명령어를 자동 실행하는 메커니즘입니다. `settings.json`에 정의합니다.

### 설정 위치

```
~/.claude/settings.json       # 전역 hooks
.claude/settings.json         # 프로젝트 hooks
.claude/settings.local.json   # 로컬 전용 (gitignore 권장)
```

### Hook 이벤트 종류

| 이벤트 | 트리거 시점 |
|--------|------------|
| `PreToolUse` | 도구 실행 직전 |
| `PostToolUse` | 도구 실행 직후 |
| `Notification` | 알림 발생 시 |
| `Stop` | Claude 응답 완료 시 |
| `SubagentStop` | 서브에이전트 완료 시 |

### 실전 Hook 예시

**코드 수정 시 자동 lint 실행:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npm run lint --fix 2>&1 | tail -5"
          }
        ]
      }
    ]
  }
}
```

**git push 전 테스트 강제 실행:**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo $CLAUDE_TOOL_INPUT | grep -q 'git push' && npm test || true"
          }
        ]
      }
    ]
  }
}
```

**Claude 응답 완료 시 Telegram 알림:**

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "curl -s -X POST 'https://api.telegram.org/bot$BOT_TOKEN/sendMessage' -d 'chat_id=$CHAT_ID&text=Claude+완료'"
          }
        ]
      }
    ]
  }
}
```

## 환경변수와 보안

Hooks에서 민감한 값은 환경변수로 관리합니다:

```bash
# .env.local (gitignore 필수)
CLAUDE_HOOK_SECRET=your-secret
BOT_TOKEN=telegram-bot-token
```

`settings.local.json`은 git에 포함하지 않아야 합니다. 팀 공유가 필요한 설정은 `settings.json`에, 개인 토큰은 `settings.local.json`에 분리하세요.

## 실무 활용 패턴

### 1. Token 최적화 (RTK 연동)

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "~/.local/bin/rtk intercept"
          }
        ]
      }
    ]
  }
}
```

### 2. 파일 변경 추적

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"[$(date)] 수정: $CLAUDE_TOOL_INPUT\" >> .claude/change-log.txt"
          }
        ]
      }
    ]
  }
}
```

### 3. 프로덕션 파일 보호

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "echo $CLAUDE_TOOL_INPUT | grep -q 'production' && echo 'BLOCKED: production file' && exit 1 || true"
          }
        ]
      }
    ]
  }
}
```

## 권한 설정

`settings.json`의 `permissions` 섹션으로 Claude가 실행할 수 있는 명령어를 제한합니다:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(git status)",
      "Bash(git diff *)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force)"
    ]
  }
}
```

`allow`에 없는 명령어는 실행 전 사용자 승인을 요청합니다. CI 환경에서는 `--dangerously-skip-permissions` 플래그로 우회할 수 있지만 신중하게 사용해야 합니다.

## 정리

| 기능 | 사용처 |
|------|--------|
| CLAUDE.md | 코딩 규칙, 금지 패턴, 기술 스택 명시 |
| @참조 | 대형 규칙집 모듈화 |
| PreToolUse Hook | 위험 작업 차단, 사전 검증 |
| PostToolUse Hook | 자동 lint/format, 변경 추적 |
| Stop Hook | 완료 알림, 리포트 생성 |
| permissions | 도구 실행 범위 제한 |

CLAUDE.md와 Hooks를 조합하면 팀 전체에 일관된 AI 협업 규칙을 강제할 수 있으며, 개인 설정(settings.local.json)과 팀 설정(settings.json)을 명확히 분리해 유지보수성을 높일 수 있습니다.
