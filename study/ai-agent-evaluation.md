# Evaluating AI Agent Systems: Metrics and Failure Modes

AI Agent를 프로덕션에 배포하는 것은 모델 선택보다 평가 체계 설계가 더 어렵습니다. 이 글은 실제 에이전트 시스템을 운영하면서 겪은 실패 패턴과 측정 지표를 정리합니다.

## AI Agent란?

AI Agent는 단순 LLM 호출과 다릅니다. 도구(Tool)를 사용하고, 다단계 추론을 하며, 목표 달성을 위해 자율적으로 행동합니다.

```
사용자 목표
    ↓
계획 수립 (Planning)
    ↓
도구 선택 → 실행 → 관찰
    ↓
목표 달성 여부 판단
    ↓ (미달성 시 반복)
최종 응답
```

## 핵심 평가 지표

### 1. Task Completion Rate (TCR)

가장 기본적인 지표. 에이전트가 주어진 작업을 끝까지 완료하는 비율입니다.

```python
tcr = successful_completions / total_attempts

# 주의: "완료"의 정의가 중요
# 나쁜 정의: 에이전트가 응답을 반환함
# 좋은 정의: 사용자가 원하는 결과물이 실제로 존재함
```

TCR만 보면 안 됩니다. 에이전트가 "완료"를 선언하지만 결과가 틀린 경우(Hallucinated Completion)가 빈번하기 때문입니다.

### 2. Step Efficiency

목표 달성에 필요한 최소 단계 대비 실제 사용 단계의 비율입니다.

```python
efficiency = optimal_steps / actual_steps
# 1.0이 이상적, 낮을수록 비효율적
```

에이전트가 같은 파일을 5번 읽거나, 이미 실패한 접근법을 반복하는 경우 이 지표가 낮아집니다.

### 3. Tool Call Accuracy

에이전트가 올바른 도구를 올바른 인수로 호출하는 비율입니다.

```python
# 측정 항목
tool_selection_accuracy = correct_tool / total_tool_calls
argument_validity = valid_args / total_tool_calls
```

실무에서 흔한 실패: 파일 경로를 잘못 추정하거나, 존재하지 않는 API 파라미터를 사용합니다.

### 4. Hallucination Rate

에이전트가 실제 확인하지 않은 정보를 사실로 주장하는 비율입니다.

```python
# 감지 방법
def check_hallucination(claim, tool_outputs):
    # claim이 tool_outputs에서 도출 가능한지 검증
    return not can_be_derived(claim, tool_outputs)
```

### 5. Recovery Rate

작업 중 오류 발생 시 스스로 복구하는 비율입니다. 좋은 에이전트는 실패를 인식하고 대안 경로를 찾습니다.

## 주요 실패 모드

### 실패 1: Infinite Loop (무한 반복)

에이전트가 같은 작업을 반복하며 탈출하지 못합니다.

```
시도 1: 파일 읽기 → 실패
시도 2: 파일 읽기 → 실패
시도 3: 파일 읽기 → 실패
... (무한 반복)
```

**원인:** 실패 상태를 메모리에 저장하지 않거나, 대안 경로 탐색 능력 부족.

**대응:** 최대 재시도 횟수 설정, 실패 패턴 감지 로직 추가.

```python
MAX_RETRIES = 3
retry_tracker = defaultdict(int)

def before_tool_call(tool, args):
    key = f"{tool}:{args}"
    retry_tracker[key] += 1
    if retry_tracker[key] > MAX_RETRIES:
        raise MaxRetriesExceeded(f"중단: {key} {MAX_RETRIES}회 실패")
```

### 실패 2: Goal Drift (목표 이탈)

긴 작업 중 초기 목표를 잊고 새로운 방향으로 이탈합니다.

**예시:** "파일 A를 수정해줘" → 파일 B, C, D를 수정하고 A는 그대로.

**대응:** 각 단계에서 초기 목표와의 연관성을 명시적으로 검증합니다.

```python
system_prompt = """
현재 목표: {original_goal}

각 행동 전 자문하세요:
1. 이 행동이 목표 달성에 직접 기여하는가?
2. 목표와 무관한 작업을 하고 있지 않은가?
"""
```

### 실패 3: Premature Completion (성급한 완료 선언)

실제로 작업이 끝나지 않았는데 완료라고 선언합니다.

**감지 방법:**

```python
def verify_completion(goal, agent_output):
    verifier_prompt = f"""
    목표: {goal}
    에이전트 결과: {agent_output}
    
    목표가 완전히 달성되었는가? 달성되지 않은 부분을 구체적으로 나열하라.
    """
    return call_llm(verifier_prompt)
```

별도의 Verifier 에이전트를 두는 패턴이 효과적입니다.

### 실패 4: Context Overflow

긴 대화에서 초기 정보가 컨텍스트 창 밖으로 밀려나 잊혀집니다.

**증상:** 이미 수행한 작업을 다시 시도, 이전에 확인한 정보를 재확인.

**대응:**

```python
# 핵심 정보를 별도 메모리에 저장
memory = {
    "goal": original_goal,
    "completed_steps": [],
    "failed_attempts": [],
    "discovered_facts": []
}

# 매 단계 메모리 업데이트
def update_memory(step_result):
    memory["completed_steps"].append(step_result)
```

### 실패 5: Tool Abuse

에이전트가 한 도구에 과도하게 의존합니다.

**예시:** 모든 정보를 웹 검색으로만 찾으려 하고, 이미 주어진 컨텍스트를 활용하지 않음.

## 평가 환경 구축

### 테스트 케이스 설계

```python
test_cases = [
    {
        "task": "src/utils/date.js 파일에서 formatDate 함수를 찾아 ISO 형식으로 수정",
        "setup": {"files": ["src/utils/date.js"]},
        "success_criteria": {
            "file_modified": "src/utils/date.js",
            "contains": "toISOString()",
            "tests_pass": True
        }
    }
]
```

### 자동화 평가 파이프라인

```python
async def evaluate_agent(agent, test_cases):
    results = []
    
    for tc in test_cases:
        setup_environment(tc["setup"])
        
        start_time = time.time()
        output = await agent.run(tc["task"])
        duration = time.time() - start_time
        
        success = verify_success(output, tc["success_criteria"])
        
        results.append({
            "task": tc["task"],
            "success": success,
            "duration": duration,
            "steps": output.step_count,
            "tool_calls": output.tool_calls
        })
    
    return compute_metrics(results)
```

## 프로덕션 모니터링

에이전트 배포 후 추적해야 할 지표:

| 지표 | 임계값 | 알림 조건 |
|------|--------|----------|
| TCR | > 85% | 3연속 80% 미만 |
| 평균 단계수 | < 15 | 20 초과 시 |
| 평균 응답 시간 | < 30s | 60s 초과 시 |
| 오류율 | < 5% | 10% 초과 시 |
| 컨텍스트 사용량 | < 70% | 90% 초과 시 |

## 요약

AI Agent 평가의 핵심은 "에이전트가 뭔가 했다"가 아니라 "에이전트가 올바른 것을 했다"를 측정하는 것입니다. TCR, Step Efficiency, Tool Call Accuracy 세 가지를 조합하면 대부분의 실패 모드를 조기에 감지할 수 있습니다.

가장 흔한 실수는 LLM 벤치마크 점수만 보고 에이전트를 선택하는 것입니다. 실무 성능은 실제 작업 환경에서의 End-to-End 평가로만 신뢰할 수 있는 측정이 가능합니다.
