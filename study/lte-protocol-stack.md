---
title: "LTE Protocol Stack 구조 분석"
date: "2026-02-15"
tags: ["LTE", "Protocol", "Embedded", "Modem"]
summary: "LTE 무선 접속망의 프로토콜 계층 구조(PHY/MAC/RLC/PDCP)를 분석하고, 각 계층의 역할과 데이터 흐름을 정리합니다."
---

# LTE Protocol Stack 구조 분석

## 개요

LTE(Long Term Evolution)의 무선 접속 계층(Radio Access Layer)은 여러 서브계층으로 구성됩니다. 이 문서는 각 계층의 역할과 상호작용을 정리합니다.

## 계층 구조

```
┌───────────────────────┐
│      Application      │
├───────────────────────┤
│   IP / Non-IP (NAS)   │
├───────────────────────┤
│         PDCP          │  ← 헤더 압축, 암호화
├───────────────────────┤
│          RLC          │  ← ARQ, 분할/재조합
├───────────────────────┤
│          MAC          │  ← 스케줄링, HARQ
├───────────────────────┤
│          PHY          │  ← OFDMA/SC-FDMA, 변조
└───────────────────────┘
```

## PHY 계층 (Physical Layer)

PHY 계층은 실제 무선 신호 송수신을 담당합니다.

- **다운링크**: OFDMA (Orthogonal Frequency Division Multiple Access)
- **업링크**: SC-FDMA (Single Carrier FDMA)
- **변조 방식**: QPSK, 16QAM, 64QAM
- **채널 코딩**: Turbo Code

### Resource Block 구조

| 항목 | 값 |
|------|-----|
| 서브캐리어 간격 | 15 kHz |
| RB당 서브캐리어 수 | 12 |
| 슬롯 당 심볼 수 | 7 (Normal CP) |
| TTI | 1ms (1 서브프레임) |

## MAC 계층 (Medium Access Control)

### HARQ (Hybrid ARQ)

HARQ는 오류 정정에 있어 ARQ와 FEC를 결합한 방식입니다.

```c
/* HARQ Process 상태 예시 (의사코드) */
typedef struct {
    uint8_t process_id;
    bool    ack_received;
    uint8_t retx_count;
    uint8_t rv;           /* Redundancy Version */
} harq_process_t;

void harq_feedback_handler(harq_process_t *proc, bool ack) {
    if (ack) {
        proc->ack_received = true;
        proc->retx_count = 0;
    } else {
        proc->retx_count++;
        proc->rv = (proc->rv + 1) % 4;  /* RV: 0, 2, 3, 1 순환 */
    }
}
```

## RLC 계층 (Radio Link Control)

RLC는 세 가지 동작 모드를 지원합니다.

- **TM (Transparent Mode)**: 처리 없이 투명 전달
- **UM (Unacknowledged Mode)**: 단방향, 재전송 없음
- **AM (Acknowledged Mode)**: 양방향, ARQ 재전송

## PDCP 계층 (Packet Data Convergence Protocol)

- 헤더 압축: ROHC (Robust Header Compression)
- 암호화: AES-128 (EEA2), Snow 3G (EEA1)
- 무결성 보호: HMAC-SHA-256 (EIA2)

## 정리

LTE 프로토콜 스택의 각 계층은 독립적인 역할을 수행하면서, 인터페이스를 통해 데이터를 교환합니다. 모뎀 SW 개발 시에는 이 계층 분리 원칙을 유지하는 것이 유지보수성에 중요합니다.

## 참고

- 3GPP TS 36.300 - Overall description of E-UTRAN
- 3GPP TS 36.321 - MAC protocol specification
- 3GPP TS 36.322 - RLC protocol specification
