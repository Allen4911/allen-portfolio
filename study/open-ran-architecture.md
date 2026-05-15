# Open RAN Architecture Overview

Open RAN(Open Radio Access Network)은 이동통신 기지국의 하드웨어와 소프트웨어를 분리하고 개방형 인터페이스로 상호운용성을 확보하는 기술 패러다임입니다. 기존의 독점적 기지국 장비 시장을 개방하여 다양한 벤더의 부품을 조합할 수 있게 합니다.

## 전통적 RAN vs Open RAN

### 전통적 RAN (Closed RAN)

```
[안테나] ─ [RRU] ─ [BBU] ─ [코어망]
  ↑           ↑       ↑
전용 하드웨어로 단일 벤더가 통합 공급
에릭슨, 노키아, 화웨이, 삼성 등
```

단일 벤더 솔루션은 높은 성능과 안정성을 제공하지만 **벤더 종속(Vendor Lock-in)** 문제가 있습니다. 장비 교체 시 전체 시스템을 바꿔야 합니다.

### Open RAN

```
[안테나] ─ [O-RU] ─ [O-DU] ─ [O-CU] ─ [코어망]
           벤더A     벤더B     벤더C
             ↕         ↕         ↕
      개방형 인터페이스 (O-RAN Alliance 표준)
```

각 구성요소를 다른 벤더의 제품으로 조합 가능. 소프트웨어는 범용 서버(COTS)에서 실행.

## O-RAN Alliance 아키텍처

### 주요 구성요소

**O-RU (O-RAN Radio Unit)**
- 안테나와 RF 처리 담당
- 무선 신호 송수신, A/D·D/A 변환
- 프론트홀(Fronthaul) 인터페이스: eCPRI (enhanced Common Public Radio Interface)
- 처리 기능: Physical Layer 일부 (저주파수 레이어)

**O-DU (O-RAN Distributed Unit)**
- 실시간 기저대역 처리
- Physical Layer 상위, Layer 2 (MAC, RLC)
- 레이턴시 민감 처리: 수ms 이내 응답 필요
- 미드홀(Midhaul): F1 인터페이스로 O-CU 연결

**O-CU (O-RAN Central Unit)**
- 비실시간 프로토콜 처리
- Layer 3 (PDCP), RRC (Radio Resource Control)
- O-CU-CP: 제어 평면 (Control Plane)
- O-CU-UP: 사용자 평면 (User Plane)

**RIC (RAN Intelligent Controller)**
O-RAN의 핵심 혁신. AI/ML 기반 무선망 최적화를 담당합니다:

```
Near-RT RIC (10ms ~ 1s 주기)
├── xApp (써드파티 앱)
│   ├── 핸드오버 최적화 앱
│   ├── 간섭 관리 앱
│   └── 트래픽 조향 앱
└── E2 인터페이스 → O-DU, O-CU

Non-RT RIC (>1s 주기)
├── rApp (비실시간 앱)
│   ├── 장기 트렌드 분석
│   └── ML 모델 학습/배포
└── A1 인터페이스 → Near-RT RIC
```

## 개방형 인터페이스

| 인터페이스 | 연결 | 주요 특성 |
|-----------|------|----------|
| Fronthaul (eCPRI) | O-RU ↔ O-DU | 저레이턴시, 고대역폭, IEEE 802.1CM |
| Midhaul (F1) | O-DU ↔ O-CU | 3GPP F1 인터페이스 |
| Backhaul (N2/N3) | O-CU ↔ 5G Core | 3GPP NG 인터페이스 |
| E2 | O-DU/O-CU ↔ Near-RT RIC | O-RAN Alliance 정의 |
| A1 | Non-RT RIC ↔ Near-RT RIC | 정책/ML 모델 전달 |
| O1 | 전체 구성요소 ↔ SMO | 관리·운용·자동화 |

## 클라우드 네이티브 배포

Open RAN의 구성요소는 컨테이너로 패키징되어 Kubernetes 위에서 실행됩니다:

```yaml
# O-DU 배포 예시 (Kubernetes)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: o-du
  namespace: oran
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: o-du
        image: oran/o-du:v2.1
        resources:
          limits:
            cpu: "16"
            memory: "32Gi"
            hugepages-1Gi: "8Gi"  # 실시간 처리 성능용
          requests:
            cpu: "12"
        securityContext:
          privileged: true  # 커널 수준 접근 필요
```

## xApp 개발 패턴

Near-RT RIC에서 실행되는 xApp은 E2 인터페이스를 통해 무선망 데이터를 수집하고 제어합니다:

```python
# xApp 기본 구조 (Python SDK)
from ricxappframe.xapp_frame import RMRXapp

class HandoverOptimizationXApp:
    def __init__(self):
        self.xapp = RMRXapp(
            default_handler=self.handle_message,
            config_handler=self.handle_config
        )
    
    def handle_message(self, summary, sbuf):
        # E2 메시지 파싱
        mtype = summary[rmr.RMR_MS_MSG_TP_SZ]
        
        if mtype == E2_INDICATION:
            # KPI 데이터 수집: RSRP, SINR, PRB 사용률
            kpi = self.parse_e2_indication(sbuf)
            
            # AI/ML 모델로 핸드오버 결정
            decision = self.ml_model.predict(kpi)
            
            if decision.should_handover:
                self.send_handover_control(decision.target_cell)
    
    def run(self):
        self.xapp.run()
```

## Open RAN의 과제

### 1. 레이턴시와 동기화

O-RU와 O-DU 간 프론트홀은 수십~수백 마이크로초 레이턴시를 요구합니다. IEEE 1588v2 (PTP) 정밀 시간 동기화가 필수입니다.

```
요구 사항 (Category A Split, 3GPP TR 38.801)
- 레이턴시: < 100μs (편도)
- 지터: < ±65ns (IEEE 1588v2 클래스 C)
- 대역폭: 100MHz 채널 × 4 MIMO = ~25Gbps
```

### 2. 멀티벤더 통합 테스트

이론적으로 상호운용 가능하지만, 실제 멀티벤더 환경에서는 미묘한 구현 차이로 인한 호환성 문제가 발생합니다. O-RAN Alliance의 OTIC(Open Testing and Integration Centre)에서 인증 프로그램을 운영합니다.

### 3. 보안

개방형 인터페이스는 공격 표면을 넓힙니다:
- xApp 공급망 보안 (악성 xApp 차단)
- E2 인터페이스 암호화 (TLS 1.3 필수)
- O-Cloud 컨테이너 런타임 보안

## 글로벌 배포 현황 (2024)

| 통신사 | 국가 | 규모 | 특이사항 |
|--------|------|------|----------|
| Rakuten | 일본 | 전국망 | 세계 최초 Open RAN 전국망 |
| AT&T | 미국 | 부분 | 다수 벤더 혼합 |
| Vodafone | 영국/독일 | 파일럿 | 농촌 지역 |
| KT | 한국 | 파일럿 | 공동연구 중 |

## O-RAN과 5G SA의 관계

O-RAN은 RAN(무선 접속망) 계층의 개방화이며, 5G Stand-Alone(SA) Core와 독립적으로 결합됩니다:

```
5G SA 코어 (OpenAirInterface, free5GC 등 오픈소스 가능)
    ↓ N2/N3
O-CU (Open RAN)
    ↓ F1
O-DU (Open RAN)
    ↓ eCPRI
O-RU (Open RAN)
    ↓
안테나
```

완전 오픈소스 5G 기지국도 가능합니다 (OpenAirInterface + srsRAN). 연구 목적의 소규모 배포에 활용됩니다.

## 요약

Open RAN은 이동통신 기지국을 소프트웨어 정의 방식으로 전환하고, 멀티벤더 생태계를 가능하게 하는 혁신입니다. AI/ML 기반 RIC를 통한 동적 최적화가 핵심 가치이며, 클라우드 네이티브 배포를 통해 TCO(총소유비용) 절감과 운영 자동화를 실현합니다. 다만 레이턴시 요구사항, 멀티벤더 통합 복잡성, 보안 이슈는 여전히 해결해야 할 과제입니다.
