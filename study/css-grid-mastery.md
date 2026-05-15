# CSS Grid 완벽 가이드

CSS Grid는 2차원 레이아웃 시스템입니다. Flexbox가 1차원(행 또는 열)을 다룬다면, Grid는 행과 열을 동시에 제어합니다. 복잡한 레이아웃을 HTML 구조 변경 없이 CSS만으로 구현할 수 있는 것이 핵심 강점입니다.

## Grid vs Flexbox 선택 기준

```
Flexbox를 써야 할 때:
- 네비게이션 바 (좌우 정렬)
- 카드 내부 콘텐츠 정렬
- 1차원 방향의 아이템 배치

Grid를 써야 할 때:
- 페이지 전체 레이아웃
- 대시보드, 갤러리
- 행과 열이 모두 중요한 2차원 레이아웃
```

## 기본 개념

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 1fr; /* 3열: 고정, 가변, 가변 */
  grid-template-rows: auto 1fr auto;    /* 3행: 자동, 가변, 자동 */
  gap: 16px;                            /* 행+열 간격 */
}
```

### fr 단위

`fr`은 가용 공간의 비율입니다:

```css
/* 3등분 */
grid-template-columns: 1fr 1fr 1fr;

/* 2:1:1 비율 */
grid-template-columns: 2fr 1fr 1fr;

/* 고정 + 가변 */
grid-template-columns: 300px 1fr; /* 사이드바 + 메인 */
```

### repeat()

```css
/* 12열 그리드 */
grid-template-columns: repeat(12, 1fr);

/* 자동 맞춤 (반응형) */
grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
```

`auto-fill`은 빈 열을 유지, `auto-fit`은 남은 공간을 채웁니다.

## 아이템 배치

### 라인 번호로 배치

```css
.header {
  grid-column: 1 / -1; /* 첫 열부터 마지막 열까지 */
  grid-row: 1;
}

.sidebar {
  grid-column: 1;
  grid-row: 2 / 4; /* 2행부터 4행 전까지 = 2~3행 */
}

.main {
  grid-column: 2 / -1;
  grid-row: 2;
}
```

### span으로 크기 지정

```css
.wide-item {
  grid-column: span 2;  /* 2열 차지 */
  grid-row: span 3;     /* 3행 차지 */
}
```

### grid-template-areas

가장 읽기 쉬운 레이아웃 정의 방법:

```css
.layout {
  display: grid;
  grid-template-areas:
    "header  header  header"
    "sidebar main    main  "
    "sidebar footer  footer";
  grid-template-columns: 250px 1fr 1fr;
  grid-template-rows: 60px 1fr 50px;
  min-height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

## 반응형 레이아웃

### 미디어 쿼리 없는 반응형

```css
/* 카드 그리드: 화면 크기에 따라 자동으로 열 수 조정 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}
/* 
  좁은 화면: 1열 (각 카드 최소 300px)
  중간 화면: 2열 (600px 이상)
  넓은 화면: 3열 (900px 이상)
*/
```

### 미디어 쿼리와 grid-template-areas 조합

```css
.page {
  display: grid;
  gap: 16px;
  
  /* 모바일: 단일 열 */
  grid-template-areas:
    "header"
    "main"
    "sidebar"
    "footer";
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .page {
    grid-template-areas:
      "header  header"
      "sidebar main  "
      "footer  footer";
    grid-template-columns: 250px 1fr;
  }
}

@media (min-width: 1200px) {
  .page {
    grid-template-areas:
      "header  header  header"
      "sidebar main    ads   "
      "footer  footer  footer";
    grid-template-columns: 250px 1fr 200px;
  }
}
```

## 정렬

### 컨테이너 전체 정렬

```css
.container {
  /* 열 방향 (수직) */
  align-items: start | end | center | stretch;
  
  /* 행 방향 (수평) */
  justify-items: start | end | center | stretch;
  
  /* 두 방향 동시 */
  place-items: center; /* align-items + justify-items */
  
  /* 전체 그리드 위치 (컨테이너 안에서) */
  align-content: start | end | center | space-between | space-around;
  justify-content: start | end | center | space-between | space-around;
}
```

### 개별 아이템 정렬

```css
.item {
  align-self: start | end | center | stretch;
  justify-self: start | end | center | stretch;
  place-self: center;
}
```

## 실전 패턴

### 완전 중앙 정렬

```css
.centered {
  display: grid;
  place-items: center;
  min-height: 100vh;
}
```

### 카드 레이아웃 (이미지 + 텍스트)

```css
.card {
  display: grid;
  grid-template-rows: 200px 1fr auto; /* 이미지 | 본문 | 버튼 */
}

/* 이미지가 항상 고정 높이, 본문이 자라도 버튼이 하단 고정 */
.card-image  { grid-row: 1; }
.card-body   { grid-row: 2; }
.card-footer { grid-row: 3; }
```

### 신문 스타일 그리드

```css
.news-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 200px;
  gap: 16px;
}

.featured {
  grid-column: span 2;
  grid-row: span 2; /* 4배 크기 */
}

.secondary {
  grid-column: span 2;
}
```

### Holy Grail 레이아웃

```css
body {
  display: grid;
  grid-template:
    "header" 60px
    "main"   1fr
    "footer" 50px
    / 1fr;
  min-height: 100vh;
}

main {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-areas: "nav content aside";
}
```

## 서브그리드 (CSS Grid Level 2)

```css
.parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.child {
  display: grid;
  grid-template-columns: subgrid; /* 부모 그리드 열 상속 */
  grid-column: span 3;
}
```

서브그리드를 사용하면 중첩된 요소들이 부모의 그리드 라인에 정렬됩니다. 카드 내부 콘텐츠를 여러 카드에 걸쳐 정렬할 때 유용합니다.

## Grid Inspector 활용

Chrome DevTools → Elements → 요소 선택 → Styles 패널에서 `grid` 배지 클릭하면 그리드 오버레이가 표시됩니다. 번호가 매겨진 라인, 영역 이름을 시각적으로 확인할 수 있어 디버깅에 필수입니다.

## 브라우저 지원

CSS Grid는 모든 현대 브라우저에서 지원됩니다 (IE 11 제외). IE 11이 필요한 경우 `-ms-grid` 접두사 버전이 있지만 기능이 제한적입니다. 현재 대부분의 프로젝트에서 IE 지원을 종료했으므로 표준 Grid를 자유롭게 사용할 수 있습니다.

CSS Grid와 Flexbox는 경쟁 관계가 아닙니다. 페이지 레이아웃은 Grid로, 컴포넌트 내부는 Flexbox로 사용하는 것이 현재 가장 널리 쓰이는 패턴입니다.
