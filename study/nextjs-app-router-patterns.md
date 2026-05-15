# Next.js 14 App Router 패턴

Next.js 14의 App Router는 React Server Components(RSC)를 중심으로 설계된 새로운 라우팅 시스템입니다. pages/ 디렉토리 방식과 개념적으로 크게 다르며, 올바른 패턴을 이해하지 못하면 성능 저하나 예상치 못한 동작이 발생합니다.

## Server Components vs Client Components

App Router의 핵심 개념입니다. 모든 컴포넌트는 기본적으로 **Server Component**입니다.

### Server Component (기본)

```tsx
// app/users/page.tsx — 서버에서만 실행
async function UsersPage() {
  // 직접 DB 쿼리 가능, API 호출 가능
  const users = await db.users.findMany();
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

서버 컴포넌트는 `useState`, `useEffect` 사용 불가. 이벤트 핸들러도 불가. 대신 DB 직접 접근, 파일 시스템 읽기, 서버 환경변수 사용이 가능합니다.

### Client Component

```tsx
'use client'; // 이 지시어가 있어야 클라이언트 컴포넌트

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      클릭: {count}
    </button>
  );
}
```

### 컴포넌트 합성 패턴

```tsx
// app/dashboard/page.tsx — Server Component
import { ClientChart } from './ClientChart';

async function DashboardPage() {
  const data = await fetchDashboardData(); // 서버에서 데이터 패칭
  
  return (
    <div>
      <h1>대시보드</h1>
      <ClientChart data={data} /> {/* 클라이언트 컴포넌트에 데이터 전달 */}
    </div>
  );
}
```

핵심 원칙: **데이터 패칭은 서버에서, 인터랙션은 클라이언트에서**.

## 파일 시스템 기반 라우팅

```
app/
├── layout.tsx          # 루트 레이아웃 (필수)
├── page.tsx            # / 경로
├── loading.tsx         # 로딩 UI
├── error.tsx           # 에러 UI
├── not-found.tsx       # 404 UI
├── (marketing)/        # 라우트 그룹 — URL에 포함 안 됨
│   ├── about/page.tsx  # /about
│   └── blog/page.tsx   # /blog
├── dashboard/
│   ├── layout.tsx      # 대시보드 레이아웃
│   └── page.tsx        # /dashboard
└── api/
    └── users/
        └── route.ts    # /api/users API 라우트
```

### 동적 라우트

```tsx
// app/users/[id]/page.tsx
interface Props {
  params: { id: string };
  searchParams: { tab?: string };
}

export default async function UserPage({ params, searchParams }: Props) {
  const user = await getUser(params.id);
  const activeTab = searchParams.tab ?? 'profile';
  
  return <UserDetail user={user} activeTab={activeTab} />;
}

// 정적 생성할 경로 미리 지정
export async function generateStaticParams() {
  const users = await getAllUsers();
  return users.map(u => ({ id: u.id }));
}
```

## 데이터 패칭 패턴

### 병렬 패칭

```tsx
async function UserDashboard({ userId }: { userId: string }) {
  // 순차 실행 (나쁜 패턴)
  // const user = await getUser(userId);     // 기다림
  // const posts = await getUserPosts(userId); // 또 기다림
  
  // 병렬 실행 (좋은 패턴)
  const [user, posts, stats] = await Promise.all([
    getUser(userId),
    getUserPosts(userId),
    getUserStats(userId)
  ]);
  
  return <Dashboard user={user} posts={posts} stats={stats} />;
}
```

### Streaming과 Suspense

```tsx
import { Suspense } from 'react';

async function SlowDataComponent() {
  const data = await fetchSlowData(); // 5초 걸리는 요청
  return <div>{data.value}</div>;
}

export default function Page() {
  return (
    <div>
      <h1>빠른 콘텐츠</h1>
      <Suspense fallback={<div>느린 데이터 로딩 중...</div>}>
        <SlowDataComponent />
      </Suspense>
    </div>
  );
}
```

## API Route Handlers

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get('page') ?? '1');
  
  const users = await db.users.findMany({
    skip: (page - 1) * 10,
    take: 10
  });
  
  return NextResponse.json({ users, page });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // 검증
  const parsed = UserCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }
  
  const user = await db.users.create({ data: parsed.data });
  return NextResponse.json(user, { status: 201 });
}
```

## Server Actions

폼 제출과 데이터 변경에 사용합니다. API 라우트 없이 서버 로직을 직접 호출합니다:

```tsx
// app/profile/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
  const name = formData.get('name') as string;
  const bio = formData.get('bio') as string;
  
  await db.users.update({
    where: { id: getCurrentUserId() },
    data: { name, bio }
  });
  
  revalidatePath('/profile'); // 캐시 무효화
}
```

```tsx
// app/profile/page.tsx
import { updateProfile } from './actions';

export default function ProfilePage() {
  return (
    <form action={updateProfile}>
      <input name="name" />
      <textarea name="bio" />
      <button type="submit">저장</button>
    </form>
  );
}
```

## 캐싱 제어

```typescript
// 기본: 자동 캐시
const data = await fetch('/api/data');

// 캐시 없음 (항상 최신)
const data = await fetch('/api/data', { cache: 'no-store' });

// 60초마다 재검증
const data = await fetch('/api/data', { next: { revalidate: 60 } });

// 태그 기반 무효화
const data = await fetch('/api/posts', { next: { tags: ['posts'] } });

// 수동 무효화 (Server Action에서)
import { revalidateTag } from 'next/cache';
revalidateTag('posts');
```

## 미들웨어

```typescript
// middleware.ts (루트에 위치)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*']
};
```

## pages/에서 app/으로 마이그레이션 체크리스트

- [ ] `getServerSideProps` → `async` 서버 컴포넌트로 교체
- [ ] `getStaticProps` → `fetch` with `cache: 'force-cache'`
- [ ] `getStaticPaths` → `generateStaticParams`
- [ ] `useRouter` (pages) → `useRouter` (next/navigation)
- [ ] `next/link`의 `<a>` 제거 (App Router에선 불필요)
- [ ] `_app.tsx` 로직 → `app/layout.tsx`로 이동
- [ ] API Routes → Route Handlers로 변환

App Router의 학습 곡선은 높지만, 서버 컴포넌트를 기본으로 사용하면 클라이언트 번들 크기가 극적으로 줄어들고, 데이터 패칭이 단순해집니다. pages/ 방식의 `getServerSideProps` 패턴보다 훨씬 직관적인 비동기 서버 컴포넌트 패턴이 실무에서 빠르게 정착하고 있습니다.
