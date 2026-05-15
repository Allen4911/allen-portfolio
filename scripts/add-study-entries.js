const fs = require('fs')
const path = require('path')

const dataPath = path.join(__dirname, '../public/data/study.json')
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

const newEntries = [
  {
    slug: 'claude-md-hooks-guide',
    title: 'CLAUDE.md & Hooks: Configuring Claude Code Behavior',
    category: 'AI',
    date: '2026-05-01',
    readingTime: '8 min read',
    excerpt: 'How to use CLAUDE.md files and Claude Code hooks to enforce coding standards, automate workflows, and persist context across sessions.',
    content: `# CLAUDE.md & Hooks: Configuring Claude Code Behavior

## What is CLAUDE.md?

CLAUDE.md is a markdown file that Claude Code automatically loads as context at the start of every session. It defines how Claude should behave in a specific project or directory — enforcing conventions, team rules, and workflow patterns without manual re-prompting.

There are three scopes:
- \`~/.claude/CLAUDE.md\` — Global (applies to all projects)
- \`/project-root/CLAUDE.md\` — Project-level (checked into git)
- \`/subdir/CLAUDE.md\` — Directory-specific (for monorepos)

## Anatomy of a CLAUDE.md

\`\`\`markdown
# Project: My App

## Tech Stack
- Next.js 15, TypeScript, Tailwind CSS
- Testing: Jest + React Testing Library

## Coding Standards
- Use TDD: write failing test before implementation
- No comments unless WHY is non-obvious
- Prefer editing existing files over creating new ones

## Git Conventions
- Commit message: type(scope): description
- Never push to main directly — use feature branches
\`\`\`

## Claude Code Hooks

Hooks are shell commands that run automatically on specific Claude Code events. Configured in \`settings.json\`:

\`\`\`json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{ "type": "command", "command": "rtk proxy" }]
    }],
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{ "type": "command", "command": "npx eslint --fix $CLAUDE_FILE_PATH 2>/dev/null || true" }]
    }]
  }
}
\`\`\`

### Hook Event Types

| Event | When it fires | Common use |
|-------|--------------|-----------|
| \`PreToolUse\` | Before any tool call | Input filtering, logging |
| \`PostToolUse\` | After any tool call | Linting, formatting |
| \`Stop\` | When Claude ends turn | Notifications, cleanup |
| \`UserPromptSubmit\` | On user message | Message routing |

## Practical Patterns

### Auto-format on write

\`\`\`json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{ "type": "command", "command": "npx prettier --write $CLAUDE_FILE_PATH" }]
    }]
  }
}
\`\`\`

### RTK token filtering

RTK (Rust Token Killer) installs as a PreToolUse hook on Bash calls, filtering verbose output before it reaches Claude's context window — saving 60–90% on tokens for dev operations.

\`\`\`bash
# Install RTK
curl -fsSL https://rtk.dev/install | bash
rtk gain  # Show token savings analytics
\`\`\`

### Memory system via CLAUDE.md imports

\`\`\`markdown
# ~/.claude/CLAUDE.md
@memory/user-profile.md
@memory/project-context.md
@memory/team-workflow.md
\`\`\`

The \`@file\` syntax imports additional markdown files, letting you build a modular, composable context system.

## Settings Hierarchy

\`\`\`
~/.claude/settings.json          ← user global
~/.claude/settings.local.json    ← user local (gitignored)
.claude/settings.json            ← project (committed)
.claude/settings.local.json      ← project local (gitignored)
\`\`\`

Project settings override global; local settings override committed. Keep secrets in \`*.local.json\`.

## Summary

CLAUDE.md + hooks = reproducible, team-shareable Claude Code behavior. Define conventions once, enforce them automatically across every session.`,
    tags: ['AI', 'Claude Code', 'Automation']
  },
  {
    slug: 'ai-agent-evaluation',
    title: 'Evaluating AI Agent Systems: Metrics and Failure Modes',
    category: 'AI',
    date: '2026-04-15',
    readingTime: '10 min read',
    excerpt: 'How to measure AI agent quality beyond accuracy: latency, token efficiency, hallucination rate, and multi-agent coordination failures.',
    content: `# Evaluating AI Agent Systems: Metrics and Failure Modes

## Why Standard ML Metrics Fall Short

Accuracy and F1 score were designed for classification tasks. AI agents — systems that reason, use tools, and produce long-form outputs — require a different evaluation framework. An agent can be correct in its final answer while being expensive, slow, or fragile.

## Core Evaluation Dimensions

### 1. Task Completion Rate

The fraction of tasks where the agent reaches a correct, verifiable final state.

\`\`\`python
def task_completion_rate(results: list[dict]) -> float:
    completed = sum(1 for r in results if r['status'] == 'success' and r['correct'])
    return completed / len(results)
\`\`\`

Measure separately for: simple tasks (single tool call), multi-step tasks (3+ tool calls), and recovery tasks (agent must handle a tool failure).

### 2. Token Efficiency

Tokens consumed per unit of useful work. An agent that uses 50k tokens to answer a 3-hop question is worse than one using 8k tokens.

\`\`\`python
def token_efficiency(tasks: list[dict]) -> float:
    # Lower is better
    return sum(t['tokens_used'] for t in tasks) / sum(t['steps_correct'] for t in tasks)
\`\`\`

Optimization levers:
- Prompt caching (Anthropic API: up to 90% cost reduction on repeated context)
- Context compaction (Claude Code's \`/compact\` command)
- RTK output filtering (60–90% reduction on shell command tokens)

### 3. Hallucination Rate

For agents that retrieve information, measure how often they assert facts not present in their tool outputs.

\`\`\`python
def hallucination_rate(responses: list[dict]) -> float:
    hallucinated = sum(
        1 for r in responses
        if any(claim not in r['tool_outputs'] for claim in r['extracted_claims'])
    )
    return hallucinated / len(responses)
\`\`\`

Mitigation: citations mode (Claude API), grounding assertions to retrieved documents.

### 4. Latency Distribution

P50/P95/P99 latency matters more than average. A slow tail means unreliable UX.

\`\`\`python
import numpy as np

def latency_stats(latencies: list[float]) -> dict:
    return {
        'p50': np.percentile(latencies, 50),
        'p95': np.percentile(latencies, 95),
        'p99': np.percentile(latencies, 99),
        'mean': np.mean(latencies),
    }
\`\`\`

## Multi-Agent Failure Modes

When multiple agents collaborate (PM → Developer → Reviewer), new failure categories emerge:

| Failure Mode | Description | Detection |
|-------------|-------------|-----------|
| Context drift | Agent A's output is misinterpreted by Agent B | Compare intent vs. execution |
| Role collision | Two agents perform the same task | Deduplication check on outputs |
| Infinite loop | Agent A waits for B, B waits for A | Timeout + circuit breaker |
| Cascade failure | One agent's error corrupts downstream agents | Checkpoint validation |

## Evaluation Dataset Design

A good eval set for code-generation agents:

\`\`\`json
{
  "id": "eval-001",
  "task": "Add input validation to the login form",
  "context": "React + TypeScript, Zod for validation",
  "success_criteria": {
    "tests_pass": true,
    "no_regressions": true,
    "type_errors": 0,
    "lines_changed_max": 50
  },
  "difficulty": "medium",
  "tags": ["validation", "react", "typescript"]
}
\`\`\`

Distribute across difficulty levels: 40% easy, 40% medium, 20% hard.

## Production Monitoring

\`\`\`typescript
interface AgentMetrics {
  sessionId: string
  tokensUsed: number
  toolCallCount: number
  taskCompletedAt: Date | null
  errorCount: number
  cacheHitRate: number
}

function trackSession(metrics: AgentMetrics): void {
  const tokensPerCall = metrics.tokensUsed / Math.max(metrics.toolCallCount, 1)
  if (tokensPerCall > 5000) {
    console.warn('High token-per-call ratio:', metrics.sessionId)
  }
  if (metrics.cacheHitRate < 0.3) {
    console.warn('Low cache hit rate — consider restructuring prompts')
  }
}
\`\`\`

## Key Takeaway

Evaluate AI agents like distributed systems: measure what matters to users (task success, latency, cost), monitor for new failure modes, and run evaluations continuously as models and prompts evolve.`,
    tags: ['AI', 'Evaluation', 'LLM']
  }
]

// Check for duplicates
const existingSlugs = new Set(data.map(e => e.slug))
const toAdd = newEntries.filter(e => !existingSlugs.has(e.slug))

if (toAdd.length === 0) {
  console.log('All entries already exist, no changes made')
  process.exit(0)
}

const updated = [...toAdd, ...data]
fs.writeFileSync(dataPath, JSON.stringify(updated, null, 2))

const ai = updated.filter(e =>
  e.category === 'AI' ||
  (e.tags && e.tags.some(t => ['AI', 'Claude', 'Claude Code'].includes(t)))
)
console.log('Added entries:', toAdd.map(e => e.slug).join(', '))
console.log('AI entries now:', ai.length)
console.log('Total entries:', updated.length)
