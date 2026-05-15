---
title: "6G NTN (Non-Terrestrial Network) Overview"
date: "2026-03-09"
tags: ["5G", "6G", "Satellite Communication", "Network", "Protocol", "Research"]
summary: "6G 비지상 네트워크(NTN)의 개념, 아키텍처, 주요 기술 과제를 정리합니다. LEO/MEO/GEO 위성 통합 구조와 3GPP 표준화 동향을 중심으로 설명합니다."
---

# 6G NTN (Non-Terrestrial Network) Overview

## 개요

NTN(Non-Terrestrial Network)은 위성, HAPS(High Altitude Platform Station), UAV 등 비지상 플랫폼을 활용하여 지상 네트워크를 보완하거나 대체하는 통신 인프라입니다. 5G NR Rel-17에서 NTN 표준화가 시작되었으며, 6G에서는 지상망과 비지상망의 완전한 통합(Unified Terrestrial and Non-Terrestrial Network)이 핵심 목표입니다.

---

## NTN 플랫폼 분류

| 플랫폼 | 고도 | 커버리지 반경 | 전파 지연 (편도) |
|--------|------|--------------|-----------------|
| LEO 위성 | 200 ~ 2,000 km | ~1,000 km | 1 ~ 10 ms |
| MEO 위성 | 2,000 ~ 35,786 km | ~5,000 km | 10 ~ 100 ms |
| GEO 위성 | 35,786 km | ~6,000 km | ~270 ms |
| HAPS | 20 ~ 50 km (성층권) | ~200 km | < 1 ms |
| UAV / Drone | 수백 m 이하 | 수 km | 무시 가능 |

---

## 6G NTN 아키텍처

```
          ┌──────────────────────────────────────────────┐
          │              6G Core Network (5GC/6GC)        │
          └──────────┬──────────────────┬────────────────┘
                     │                  │
           ┌─────────▼────────┐  ┌──────▼──────────────┐
           │  Terrestrial RAN │  │   NTN RAN (gNB-sat) │
           │  (지상 기지국)    │  │  LEO / MEO / GEO    │
           └─────────┬────────┘  └──────┬──────────────┘
                     │                  │
             ┌───────▼──────────────────▼───────┐
             │         UE / IoT Terminal          │
             │   (스마트폰, 선박, 항공기, IoT 등)  │
             └───────────────────────────────────┘
```

### 핵심 인터페이스

- **Uu (공중 인터페이스)**: UE ↔ 위성 gNB
- **F1 / E1**: DU-CU 분리 구조 (처리 기능 지상 집중 가능)
- **Feeder Link**: 위성 ↔ 지상국 (게이트웨이)
- **Service Link**: 위성 ↔ UE (단말)
- **ISL (Inter-Satellite Link)**: 위성 간 직접 통신 (스타링크 방식)

---

## 주요 기술 과제

### 1. 대규모 전파 지연 (Large Propagation Delay)

LEO 기준 편도 최대 ~10 ms, GEO는 ~270 ms로 기존 지상망 대비 매우 큰 RTT를 가집니다.

**영향 및 대응 방안:**

```
문제: HARQ Stop-and-Wait → 처리량 급락
  └─ LEO(600km) 기준 RTT ≈ 4 ms × 2 = ~8 ms
  └─ GEO 기준 RTT ≈ 270 ms × 2 = ~540 ms

대응:
  ① HARQ 비활성화 (Rel-17 NTN: HARQ 재전송 횟수 확장)
  ② Extended HARQ Round-Trip Time 허용
  ③ ARQ 상위 계층(RLC AM)에서 재전송 담당
```

### 2. 도플러 편이 (Doppler Shift)

LEO 위성은 초속 약 7.5 km/s로 이동하며 최대 수십 kHz의 주파수 편이가 발생합니다.

```python
# 도플러 편이 계산 예시
def doppler_shift(freq_hz, velocity_ms, angle_deg):
    """
    freq_hz    : 반송파 주파수 (Hz)
    velocity_ms: 위성 속도 (m/s)
    angle_deg  : 위성 이동 방향과 시선 방향 각도
    """
    import math
    c = 3e8  # 광속 (m/s)
    theta = math.radians(angle_deg)
    delta_f = freq_hz * (velocity_ms / c) * math.cos(theta)
    return delta_f

# LEO 위성 (7500 m/s), Ka 대역 (20 GHz), 정면 통과 시
shift = doppler_shift(20e9, 7500, 0)
print(f"최대 도플러 편이: {shift/1e3:.1f} kHz")  # ≈ 500 kHz
```

**대응 방안:**
- UE 측 또는 네트워크 측 Pre-compensation
- 위성 궤도 정보 기반 예측 보정 (Ephemeris-based)
- Wide-guard-band 설계

### 3. 타이밍 어드밴스 (Timing Advance)

지상망 대비 수백 배 이상의 TA 값이 필요합니다.

| 시스템 | 최대 TA 범위 |
|--------|-------------|
| 지상 LTE/NR | ~0.67 ms (최대 ~100 km) |
| LEO NTN (Rel-17) | ~27 ms (고도 600 km) |
| GEO NTN | ~541 ms |

- 3GPP Rel-17: TA 범위 확장 (최대 66,460 Tc 단계 → NTN용 확장)
- UE 자체 GNSS 기반 사전 보정(Pre-compensation) 도입

---

## 3GPP NTN 표준화 로드맵

```
Rel-15 (2019) ─┐
               │  NTN 연구 시작 (TR 38.811)
Rel-16 (2020) ─┤
               │  NTN 채널 모델, 시스템 파라미터 연구
Rel-17 (2022) ─┤
               │  ★ NTN 첫 표준화 완료
               │  - 5G NR NTN (위성)
               │  - IoT NTN (NB-IoT / eMTC)
               │  - HARQ/TA/도플러 처리
Rel-18 (2024) ─┤
               │  NTN 고도화
               │  - UE Direct-to-Satellite (D2S)
               │  - 이동성/핸드오버 개선
               │  - Multi-beam 지원
Rel-19 / 6G ──┘
               ★ TN/NTN 완전 통합 (Unified Network)
               - AI 기반 채널 예측
               - Sub-THz / THz 대역 탐색
               - 지능형 위성 간 링크 (ISL)
```

---

## 6G NTN 핵심 기술 요소

### 1. Integrated Access and Backhaul (IAB) in NTN

지상 기지국과 위성을 혼합하여 무선 백홀을 구성하는 구조입니다.

```
[GEO/MEO 위성]
     │ 백홀 링크 (Feeder)
     ▼
[LEO 위성 군집 — ISL]
     │ 서비스 링크
     ▼
[HAPS / UAV]
     │ 마지막 구간
     ▼
[지상 UE / IoT 단말]
```

### 2. AI/ML 기반 위성 채널 추정

```python
# 개념적 AI 채널 예측 흐름
class NTNChannelPredictor:
    """
    위성 궤도 정보 + 측정 피드백 → 다음 슬롯 채널 예측
    """
    def predict(self, ephemeris, prev_csi, weather_info):
        # 1. 궤도 기반 도플러/지연 사전 계산
        predicted_delay = self._calc_propagation(ephemeris)
        predicted_doppler = self._calc_doppler(ephemeris)

        # 2. ML 모델로 채널 계수 예측
        channel_coeff = self.model.forward(
            prev_csi, predicted_delay, predicted_doppler
        )
        return channel_coeff
```

### 3. 다중 빔 / 스팟빔 기술

```
위성 안테나 커버리지 예시 (LEO, 고도 600 km)

     위성
      ↓↓↓ (멀티 스팟빔)
  ┌───┬───┬───┐
  │ 1 │ 2 │ 3 │  ← 각 빔: ~100 km 직경
  ├───┼───┼───┤
  │ 4 │ 5 │ 6 │
  ├───┼───┼───┤
  │ 7 │ 8 │ 9 │
  └───┴───┴───┘

- 주파수 재사용 (Frequency Reuse): 인접 빔 간 간섭 최소화
- 빔 호핑 (Beam Hopping): 수요에 따라 빔 자원 동적 할당
- 디지털 빔포밍: RFSoC 기반 유연한 빔 형성
```

---

## NTN vs 지상망 비교

| 항목 | 지상 5G | LEO NTN | GEO NTN |
|------|---------|---------|---------|
| 커버리지 | 제한적 (도시 중심) | 준글로벌 | 글로벌 |
| 전파 지연 | < 1 ms | 1~10 ms | ~270 ms |
| 처리량 | 수 Gbps | 수백 Mbps~Gbps | 수십~수백 Mbps |
| 핸드오버 | 드물고 빠름 | 매우 빈번 (초단위) | 드묾 |
| 도플러 | 무시 가능 | 매우 큼 | 작음 |
| 배포 비용 | 높음 (밀집 지역) | 낮음 (광역) | 낮음 (글로벌) |
| 재난/해상/항공 | 불가 | 가능 | 가능 |

---

## 군용 관점 (Military NTN)

6G NTN은 민간뿐만 아니라 군용 통신에서도 핵심 기술로 부상하고 있습니다.

| 요소 | 내용 |
|------|------|
| **저궤도 군집 위성** | 기존 GEO 단일 위성 대비 낮은 지연, 높은 생존성 |
| **항재밍** | 주파수 도약 + 확산 스펙트럼 + AI 기반 적응형 파형 |
| **저피탐(LPI/LPD)** | 극협대역 스팟빔, 짧은 버스트 송신 |
| **직접 단말 연결** | 전술 단말 ↔ 위성 직접 접속 (지상 인프라 불필요) |
| **ISL 활용** | 지상 게이트웨이 없이 위성 간 데이터 중계 |

---

## 참고 표준 및 문서

- 3GPP TR 38.811 — Study on NR NTN
- 3GPP TS 38.300 — NR Overall Description (NTN additions in Rel-17)
- 3GPP TR 38.821 — Solutions for NR to support NTN
- ITU-R M.2514 — IMT-2020 Satellite Component
- ETSI TR 103 611 — 5G NTN Use Cases
