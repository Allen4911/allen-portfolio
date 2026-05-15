# Migrating React Projects to TypeScript

JavaScript로 작성된 React 프로젝트를 TypeScript로 마이그레이션하는 작업은 한 번에 전체를 바꾸는 것이 아니라, 점진적으로 파일을 변환하며 안정성을 유지하는 전략이 현실적입니다. 이 가이드는 실제 마이그레이션 과정에서 겪은 패턴과 함정을 정리합니다.

## 왜 TypeScript인가?

TypeScript의 실제 가치는 "타입 안전성"이 아니라 **빠른 피드백**입니다. 런타임 오류가 편집기에서 즉시 보이고, 리팩토링 시 영향 범위를 컴파일러가 알려줍니다.

```javascript
// JS: 런타임에야 오류 발견
function getUser(id) {
  return fetch(`/api/users/${id}`).then(r => r.json());
}
getUser(null); // API 호출 후 서버에서 오류 → 발견 지연

// TS: 편집기에서 즉시 오류 표시
function getUser(id: string): Promise<User> {
  return fetch(`/api/users/${id}`).then(r => r.json());
}
getUser(null); // ❌ 편집 시점에 오류 감지
```

## 마이그레이션 준비

### 1. TypeScript 설치

```bash
npm install --save-dev typescript @types/react @types/react-dom @types/node
```

### 2. tsconfig.json 설정

마이그레이션 초기에는 느슨하게 시작해 점진적으로 엄격하게 강화합니다:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,           // JS 파일도 허용 (점진적 마이그레이션)
    "skipLibCheck": true,
    "strict": false,           // 처음엔 false, 나중에 true
    "noImplicitAny": false,    // 처음엔 false
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}
```

### 3. 파일 확장자 변경 전략

```
# 우선순위: 의존성이 적은 파일부터
유틸리티 함수 (.js → .ts)
  → 타입 정의 파일 (새로 생성)
    → 훅 (.js → .ts)
      → 컴포넌트 (.jsx → .tsx)
        → 페이지 (.jsx → .tsx)
```

## 단계별 변환

### Step 1: 타입 정의 파일 먼저

```typescript
// src/types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  createdAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}
```

### Step 2: 유틸리티 함수 변환

```typescript
// src/utils/date.ts (date.js에서 변환)

// Before (JS)
export function formatDate(date, format) {
  // ...
}

// After (TS)
type DateFormat = 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD.MM.YYYY';

export function formatDate(date: Date | string, format: DateFormat = 'YYYY-MM-DD'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day);
}
```

### Step 3: React 컴포넌트 변환

```tsx
// UserCard.tsx (UserCard.jsx에서 변환)

// Before (JSX)
export function UserCard({ user, onEdit, className }) {
  return (
    <div className={className}>
      <h2>{user.name}</h2>
      <button onClick={() => onEdit(user.id)}>편집</button>
    </div>
  );
}

// After (TSX)
interface UserCardProps {
  user: User;
  onEdit: (userId: string) => void;
  className?: string;
}

export function UserCard({ user, onEdit, className }: UserCardProps) {
  return (
    <div className={className}>
      <h2>{user.name}</h2>
      <button onClick={() => onEdit(user.id)}>편집</button>
    </div>
  );
}
```

### Step 4: 커스텀 훅 변환

```typescript
// hooks/useUser.ts

interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useUser(userId: string): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}`);
      const data: ApiResponse<User> = await response.json();
      setUser(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  return { user, loading, error, refetch: fetchUser };
}
```

## 자주 마주치는 문제와 해결법

### 문제 1: any 타입 남발

```typescript
// 나쁜 패턴 — any는 타입 안전성을 포기하는 것
function processData(data: any) {
  return data.value.toUpperCase(); // 런타임 오류 가능성 있음
}

// 좋은 패턴 — unknown 사용 후 타입 가드
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    const value = (data as { value: unknown }).value;
    if (typeof value === 'string') {
      return value.toUpperCase();
    }
  }
  throw new Error('예상치 못한 데이터 형식');
}
```

### 문제 2: 외부 라이브러리 타입 없음

```bash
# @types 패키지 설치
npm install --save-dev @types/lodash @types/moment

# 타입이 없는 라이브러리는 직접 선언
# src/types/declarations.d.ts
declare module 'untyped-library' {
  export function doSomething(value: string): number;
}
```

### 문제 3: API 응답 타입

```typescript
// 런타임 검증과 타입을 함께 — zod 활용
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'user', 'viewer'])
});

type User = z.infer<typeof UserSchema>; // 타입 자동 추론

async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`);
  const raw = await res.json();
  return UserSchema.parse(raw); // 런타임에도 검증
}
```

### 문제 4: 이벤트 핸들러 타입

```tsx
// React 이벤트 타입
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // ...
};

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') handleSubmit();
};
```

## strict 모드로 강화하기

기본 변환 완료 후 tsconfig를 점진적으로 강화합니다:

```json
{
  "compilerOptions": {
    "strict": true,              // 모든 strict 옵션 활성화
    "noUncheckedIndexedAccess": true,  // 배열 접근 시 undefined 포함
    "exactOptionalPropertyTypes": true, // 옵션 프로퍼티 엄격 처리
    "noImplicitReturns": true,   // 모든 경로에서 반환 강제
    "noFallthroughCasesInSwitch": true
  }
}
```

## 마이그레이션 완료 체크리스트

- [ ] `allowJs: false`로 변경 (모든 파일이 .ts/.tsx)
- [ ] `strict: true` 활성화 및 오류 0건
- [ ] `any` 타입 사용 0건 (`grep -r ": any"`)
- [ ] 모든 API 응답에 타입 정의
- [ ] 모든 컴포넌트 props에 interface 정의
- [ ] 타입 테스트 추가 (tsd 또는 expect-type)

TypeScript 마이그레이션의 진짜 목표는 완벽한 타입 커버리지가 아닙니다. 오류를 런타임에서 컴파일 타임으로 앞당기고, IDE의 자동완성과 리팩토링 도구를 최대한 활용하는 것입니다.
