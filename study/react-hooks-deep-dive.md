# React Hooks 심화: 실전 패턴과 함정

React Hooks는 함수형 컴포넌트에서 상태와 사이드 이펙트를 관리합니다. 기본 사용법을 넘어, 성능 최적화와 복잡한 상태 관리에서 발생하는 실제 문제들을 다룹니다.

## useState의 함정

### 함정 1: 객체 상태의 부분 업데이트

```jsx
// 잘못된 패턴 — 다른 필드가 사라짐
const [user, setUser] = useState({ name: '앨런', age: 30 });
setUser({ name: '김앨런' }); // age 사라짐!

// 올바른 패턴
setUser(prev => ({ ...prev, name: '김앨런' }));
```

### 함정 2: 클로저 stale 값

```jsx
// 문제: count가 항상 0
const [count, setCount] = useState(0);
useEffect(() => {
  const timer = setInterval(() => {
    setCount(count + 1); // count는 항상 초기값 0
  }, 1000);
  return () => clearInterval(timer);
}, []); // 빈 의존성 배열 — count 갱신 안 됨

// 해결: 함수형 업데이트
setCount(prev => prev + 1);
```

### 함정 3: 초기화 비용이 큰 상태

```jsx
// 매 렌더링마다 heavyComputation 실행됨
const [data, setData] = useState(heavyComputation());

// 초기화 함수 전달 — 최초 1회만 실행
const [data, setData] = useState(() => heavyComputation());
```

## useEffect 완전 정리

### 의존성 배열 규칙

```jsx
useEffect(() => { /* 매 렌더링마다 */ });
useEffect(() => { /* 마운트 1회 */ }, []);
useEffect(() => { /* a 또는 b 변경 시 */ }, [a, b]);
```

### 클린업이 필요한 경우

```jsx
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/data', { signal: controller.signal })
    .then(r => r.json())
    .then(setData)
    .catch(err => {
      if (err.name !== 'AbortError') console.error(err);
    });

  return () => controller.abort(); // 언마운트 시 요청 취소
}, []);
```

### 이벤트 리스너 클린업

```jsx
useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

## useCallback과 useMemo 제대로 쓰기

### useCallback — 함수 참조 안정화

```jsx
// 불필요한 useCallback — 간단한 함수에는 오버헤드만
const handleClick = useCallback(() => setCount(c => c + 1), []);

// 필요한 경우: 자식 컴포넌트에 props로 전달하는 함수
const ExpensiveChild = memo(({ onSubmit }) => { /* ... */ });

function Parent() {
  const handleSubmit = useCallback((data) => {
    submitToApi(data);
  }, []); // submitToApi가 안정적이면 의존성 없음
  
  return <ExpensiveChild onSubmit={handleSubmit} />;
}
```

### useMemo — 계산 결과 캐싱

```jsx
// 비싼 계산만 메모이제이션
const sortedList = useMemo(
  () => list.slice().sort((a, b) => a.date - b.date),
  [list]
);

// 불필요한 useMemo — 단순 연산에는 오버헤드만
const doubled = useMemo(() => count * 2, [count]); // 이건 그냥 count * 2로
```

## useReducer로 복잡한 상태 관리

useState가 3개 이상 연관되면 useReducer를 고려합니다:

```typescript
type State = {
  data: User[] | null;
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: User[] }
  | { type: 'FETCH_ERROR'; error: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { data: action.payload, loading: false, error: null };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.error };
  }
}

function UserList() {
  const [state, dispatch] = useReducer(reducer, {
    data: null, loading: false, error: null
  });

  useEffect(() => {
    dispatch({ type: 'FETCH_START' });
    fetchUsers()
      .then(data => dispatch({ type: 'FETCH_SUCCESS', payload: data }))
      .catch(err => dispatch({ type: 'FETCH_ERROR', error: err.message }));
  }, []);
}
```

## 커스텀 훅 설계 원칙

### 원칙 1: 단일 책임

```typescript
// 나쁜 패턴 — 너무 많은 책임
function useEverything() {
  const user = useUser();
  const theme = useTheme();
  const locale = useLocale();
  // ...
}

// 좋은 패턴 — 각자의 역할
function useUser(userId: string) { /* 사용자 데이터만 */ }
function useTheme() { /* 테마만 */ }
```

### 원칙 2: 재사용 가능한 데이터 패칭 훅

```typescript
function useFetch<T>(url: string) {
  const [state, dispatch] = useReducer(fetchReducer<T>, {
    data: null, loading: true, error: null
  });

  useEffect(() => {
    let cancelled = false;
    
    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (!cancelled) dispatch({ type: 'SUCCESS', data });
      })
      .catch(err => {
        if (!cancelled) dispatch({ type: 'ERROR', error: err.message });
      });

    return () => { cancelled = true; };
  }, [url]);

  return state;
}

// 사용
function UserProfile({ userId }: { userId: string }) {
  const { data: user, loading, error } = useFetch<User>(`/api/users/${userId}`);
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  return <div>{user?.name}</div>;
}
```

### 원칙 3: 훅 합성

```typescript
function useUserWithPosts(userId: string) {
  const { data: user } = useFetch<User>(`/api/users/${userId}`);
  const { data: posts } = useFetch<Post[]>(
    user ? `/api/users/${user.id}/posts` : null
  );
  
  return { user, posts };
}
```

## useRef의 두 가지 용도

### 1. DOM 참조

```tsx
function FocusInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  
  return (
    <>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>
        포커스
      </button>
    </>
  );
}
```

### 2. 렌더링 유발 없는 값 저장

```tsx
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<number | null>(null); // 렌더링 유발 안 함
  
  const start = () => {
    timerRef.current = window.setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  };
  
  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
  
  return <div>{seconds}초 <button onClick={start}>시작</button> <button onClick={stop}>정지</button></div>;
}
```

## 성능 최적화 체크리스트

- [ ] `memo()`로 감싼 컴포넌트에 전달하는 함수는 `useCallback` 사용
- [ ] 비싼 계산 결과는 `useMemo`로 캐싱
- [ ] 배열/객체를 의존성 배열에 넣을 때 참조 동일성 확인
- [ ] `useEffect` 내부에서 정의한 함수는 의존성에 포함
- [ ] 불필요한 렌더링은 React DevTools Profiler로 확인

React Hooks의 핵심은 각 훅이 하는 일을 명확히 이해하고, 의존성 배열을 정직하게 관리하는 것입니다. eslint-plugin-react-hooks의 `exhaustive-deps` 규칙을 활성화하면 의존성 누락을 컴파일 타임에 잡을 수 있습니다.
