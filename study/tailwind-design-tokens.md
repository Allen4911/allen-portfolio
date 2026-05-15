# Design Tokens with Tailwind CSS

디자인 토큰(Design Token)은 색상, 간격, 타이포그래피 등의 디자인 결정사항을 코드로 표현한 변수입니다. Tailwind CSS의 설정 시스템과 CSS 변수를 결합하면 디자인 시스템을 체계적으로 관리할 수 있습니다.

## 디자인 토큰이란?

디자인 토큰은 디자이너와 개발자 사이의 공통 언어입니다.

```
# 나쁜 방식 — 매직 값
color: #3B82F6;
margin: 16px;
font-size: 14px;

# 좋은 방식 — 토큰
color: brand-primary;
margin: spacing-4;
font-size: text-sm;
```

토큰을 사용하면 디자인 변경이 한 곳에서 전체에 반영됩니다.

## Tailwind 설정으로 토큰 정의

`tailwind.config.js`의 `theme.extend`에 토큰을 정의합니다:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',  // primary
          600: '#2563eb',  // primary-hover
          900: '#1e3a8a',
        },
        semantic: {
          success: '#10b981',
          warning: '#f59e0b',
          error:   '#ef4444',
          info:    '#3b82f6',
        }
      },
      spacing: {
        '4.5': '1.125rem',
        '13':  '3.25rem',
        '15':  '3.75rem',
      },
      fontSize: {
        'display-xl': ['3.75rem', { lineHeight: '1', fontWeight: '700' }],
        'display-lg': ['3rem',    { lineHeight: '1.05', fontWeight: '700' }],
      },
      borderRadius: {
        'card': '0.75rem',
        'button': '0.5rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      }
    }
  }
};
```

## CSS 변수와 Tailwind 연동

다크모드 지원을 위해 CSS 변수를 활용합니다:

```css
/* globals.css */
:root {
  --color-bg-primary:   #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-border:       #e5e7eb;
  --color-accent:       #3b82f6;
}

[data-theme="dark"] {
  --color-bg-primary:   #111827;
  --color-bg-secondary: #1f2937;
  --color-text-primary: #f9fafb;
  --color-text-secondary: #9ca3af;
  --color-border:       #374151;
  --color-accent:       #60a5fa;
}
```

```javascript
// tailwind.config.js — CSS 변수를 Tailwind 클래스로
module.exports = {
  theme: {
    extend: {
      colors: {
        'bg-primary':   'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'border-base':  'var(--color-border)',
        'accent':       'var(--color-accent)',
      }
    }
  }
};
```

이제 `bg-bg-primary`, `text-text-primary` 같은 클래스를 사용하면 테마가 자동 전환됩니다:

```jsx
<div className="bg-bg-primary text-text-primary border border-border-base">
  ...
</div>
```

## 컴포넌트 토큰 패턴

컴포넌트마다 전용 토큰을 정의하면 일관성이 높아집니다:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      // 버튼 컴포넌트 토큰
      'btn-primary-bg':    '#3b82f6',
      'btn-primary-text':  '#ffffff',
      'btn-primary-hover': '#2563eb',
      'btn-sm-px':         '0.75rem',
      'btn-sm-py':         '0.375rem',
      'btn-md-px':         '1rem',
      'btn-md-py':         '0.5rem',
    }
  }
};
```

## @layer로 컴포넌트 클래스 정의

반복되는 클래스 조합은 `@layer components`로 추출합니다:

```css
/* globals.css */
@layer components {
  .btn {
    @apply inline-flex items-center justify-center font-medium rounded-button
           transition-colors duration-200 focus:outline-none focus:ring-2;
  }
  
  .btn-primary {
    @apply btn bg-brand-500 text-white hover:bg-brand-600
           focus:ring-brand-500 focus:ring-offset-2;
  }
  
  .btn-secondary {
    @apply btn bg-white text-gray-700 border border-gray-300
           hover:bg-gray-50 focus:ring-brand-500;
  }
  
  .btn-sm { @apply px-3 py-1.5 text-sm; }
  .btn-md { @apply px-4 py-2 text-base; }
  .btn-lg { @apply px-6 py-3 text-lg; }
  
  .card {
    @apply bg-bg-primary rounded-card shadow-card p-6
           border border-border-base;
  }
  
  .card-hover {
    @apply card hover:shadow-card-hover transition-shadow duration-200;
  }
}
```

사용:

```jsx
<button className="btn-primary btn-md">제출</button>
<div className="card-hover">...</div>
```

## 시맨틱 토큰 레이어

토큰을 3단계로 구조화하면 관리가 쉬워집니다:

```
1단계: 원시 토큰 (Primitive)
   blue-500: #3b82f6

2단계: 시맨틱 토큰 (Semantic)
   color-interactive-primary: blue-500

3단계: 컴포넌트 토큰 (Component)
   button-primary-background: color-interactive-primary
```

```javascript
// tokens/primitive.js
export const primitive = {
  blue: { 500: '#3b82f6', 600: '#2563eb' },
  red:  { 500: '#ef4444', 600: '#dc2626' },
};

// tokens/semantic.js
import { primitive } from './primitive';
export const semantic = {
  'interactive-primary':       primitive.blue[500],
  'interactive-primary-hover': primitive.blue[600],
  'interactive-danger':        primitive.red[500],
};

// tailwind.config.js
import { semantic } from './tokens/semantic';
module.exports = {
  theme: { extend: { colors: semantic } }
};
```

## 토큰 문서화

`tailwind.config.js`에서 토큰 목록을 자동 추출할 수 있습니다:

```javascript
// scripts/generate-token-docs.js
const config = require('./tailwind.config');

const colors = config.theme.extend.colors;
console.log('# 색상 토큰');
Object.entries(colors).forEach(([name, value]) => {
  if (typeof value === 'string') {
    console.log(`- \`text-${name}\` / \`bg-${name}\`: ${value}`);
  }
});
```

## 실전 다크모드 구현

```jsx
// hooks/useTheme.ts
'use client';
import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark' : 'light';
    setTheme(saved ?? preferred);
  }, []);
  
  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };
  
  return { theme, toggle };
}
```

## 체크리스트

- [ ] 색상 팔레트를 primitive → semantic 2단계로 분리
- [ ] 다크모드는 CSS 변수로 구현 (클래스 토글보다 안정적)
- [ ] 반복 조합은 `@layer components`로 추출
- [ ] 컴포넌트 props로 variant 지원 (`size`, `variant`)
- [ ] 토큰 값은 하드코딩 금지 — tailwind.config에서 중앙 관리

Tailwind CSS의 진짜 힘은 유틸리티 클래스에 있지 않습니다. 설정 시스템을 통한 디자인 토큰 관리와 `@layer`를 통한 컴포넌트 추출의 조합이 대규모 프로젝트에서 디자인 일관성을 유지하는 핵심입니다.
