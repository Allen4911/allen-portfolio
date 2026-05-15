---
title: "Xilinx RFSoC 플랫폼 개요 및 활용"
date: "2026-03-01"
tags: ["RFSoC", "Embedded", "5G", "Xilinx", "FPGA"]
summary: "Xilinx RFSoC의 하드웨어 아키텍처와 5G NR/군용 통신 시스템 적용 가능성을 정리합니다. ADC/DAC 통합 구조와 PS-PL 인터페이스를 중심으로 설명합니다."
---

# Xilinx RFSoC 플랫폼 개요

## RFSoC란?

Xilinx RFSoC(Radio Frequency System-on-Chip)는 고속 ADC/DAC와 FPGA 패브릭, ARM 프로세서를 하나의 칩에 통합한 플랫폼입니다. 기존의 분리형 RF 프론트엔드 + FPGA 구조 대비 다음의 장점을 제공합니다.

| 항목 | 기존 구조 | RFSoC |
|------|-----------|--------|
| ADC/DAC | 외부 칩 | 내장 (최대 16채널) |
| 샘플링 레이트 | ~500 MSPS | ~5 GSPS |
| 레이턴시 | 높음 | 매우 낮음 |
| 보드 면적 | 크다 | 컴팩트 |
| 소비 전력 | 높음 | 낮음 |

## 아키텍처

```
┌──────────────────────────────────────────────────────┐
│                    Zynq UltraScale+ RFSoC              │
│                                                        │
│  ┌─────────────┐     AXI     ┌──────────────────────┐ │
│  │  PS (ARM)   │◄───────────►│   PL (FPGA Fabric)   │ │
│  │  Cortex-A53 │             │                      │ │
│  │  + R5 RPU   │             │  DSP / DPD / CFR     │ │
│  └─────────────┘             │  Beamforming         │ │
│                              └──────────┬───────────┘ │
│                                         │              │
│  ┌──────────────────────────────────────▼───────────┐ │
│  │              RF Data Converter                    │ │
│  │   ADC (up to 4 GSPS, 12-bit)                     │ │
│  │   DAC (up to 6.5 GSPS, 14-bit)                   │ │
│  └───────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

## 5G NR 적용

5G NR mmWave(FR2) 대역에서 RFSoC는 핵심 역할을 합니다.

### Massive MIMO Beamforming

```python
# 단순화된 디지털 빔포밍 예시
import numpy as np

def digital_beamforming(signals, steering_angle_deg, array_spacing=0.5):
    """
    ULA(Uniform Linear Array) 기반 디지털 빔포밍
    """
    N = len(signals)
    theta = np.deg2rad(steering_angle_deg)

    # 스티어링 벡터 계산
    d = array_spacing  # 파장 대비 간격
    steering_vec = np.exp(1j * 2 * np.pi * d * np.arange(N) * np.sin(theta))

    # 빔포밍 가중치 적용
    weighted = signals * steering_vec.conj()
    return np.sum(weighted)

# 8 안테나 기준, 30도 방향 빔 형성
signals = np.random.randn(8) + 1j * np.random.randn(8)
output = digital_beamforming(signals, steering_angle_deg=30)
```

## 군용 통신 시스템 적용 관점

RFSoC는 군용 위성통신 및 전술 통신에서도 주목받는 플랫폼입니다.

### 주요 장점
- **광대역 처리**: 단일 칩으로 수 GHz 대역폭 처리 가능
- **재구성 가능성**: FPGA 기반으로 파형 변경 용이 (SDR 구현)
- **저지연**: 직접 샘플링으로 IF 단계 제거
- **소형화**: SWaP(Size, Weight, and Power) 최적화

### 위성통신 모뎀 구현 시 고려사항

```
도플러 보상 ─┐
채널 추정    ─┤──► 복조/디코딩 ──► 데이터 출력
심볼 동기화 ─┘
     ▲
     │ RFSoC ADC 직접 샘플링
     │
  위성 RF 신호 (L/S/X/Ka 대역)
```

## 개발 환경

| 도구 | 용도 |
|------|------|
| Vivado / Vitis | FPGA 설계 및 PS 소프트웨어 |
| MATLAB/Simulink | DSP 알고리즘 설계 및 시뮬레이션 |
| RFSoC Explorer | ADC/DAC 직접 제어 (PYNQ 기반) |
| Petalinux | 리눅스 BSP 빌드 |

## 참고

- Xilinx PG269 - RF Data Converter IP
- Xilinx UG1483 - RFSoC DFE User Guide
- 3GPP TS 38.104 - NR Base Station radio transmission
