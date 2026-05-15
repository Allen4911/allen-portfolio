# JavaScript 클로저 완전 이해

클로저(Closure)는 JavaScript에서 가장 자주 오해되는 개념 중 하나입니다. 면접 질문의 단골이기도 하지만, 실제로 매일 사용하는 패턴입니다. 이 글은 이론을 넘어 실무에서 클로저가 어떻게 활용되는지 초점을 맞춥니다.

## 클로저란?

클로저는 **함수가 자신이 선언된 렉시컬 스코프를 기억하는 것**입니다. 함수가 해당 스코프 밖에서 실행되더라도 그 스코프에 접근할 수 있습니다.

```javascript
function makeCounter() {
  let count = 0; // makeCounter의 로컬 변수
  
  return function increment() {
    count++; // 외부 변수에 접근 — 클로저!
    return count;
  };
}

const counter = makeCounter(); // makeCounter 실행 완료
// 이 시점에 count 변수는 소멸해야 할 것 같지만...

console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
// increment 함수가 count를 계속 참조 → count가 살아있음
```

`makeCounter`가 반환된 후에도 `count` 변수가 메모리에 유지됩니다. 반환된 `increment` 함수가 `count`를 참조하고 있기 때문입니다.

## 렉시컬 스코프

JavaScript는 **렉시컬 스코프(Lexical Scope)**를 사용합니다. 함수가 어디서 호출되었느냐가 아니라, 어디서 **선언**되었느냐에 따라 스코프가 결정됩니다.

```javascript
let x = 'global';

function outer() {
  let x = 'outer';
  
  function inner() {
    console.log(x); // 'outer' — 선언 위치의 스코프
  }
  
  return inner;
}

const fn = outer();
fn(); // 'outer' (호출 위치의 global x가 아님)
```

## 클로저의 실용적 패턴

### 1. 데이터 은닉 (Private State)

JavaScript 클래스에는 진정한 private 필드가 없었습니다(ES2022 `#field` 이전). 클로저로 구현했습니다:

```javascript
function createAccount(initialBalance) {
  let balance = initialBalance; // private — 외부에서 직접 접근 불가
  const transactions = [];
  
  return {
    deposit(amount) {
      if (amount <= 0) throw new Error('금액은 양수여야 합니다');
      balance += amount;
      transactions.push({ type: 'deposit', amount, balance });
      return balance;
    },
    
    withdraw(amount) {
      if (amount > balance) throw new Error('잔액 부족');
      balance -= amount;
      transactions.push({ type: 'withdraw', amount, balance });
      return balance;
    },
    
    getBalance() { return balance; },
    getHistory() { return [...transactions]; } // 복사본 반환
  };
}

const account = createAccount(1000);
account.deposit(500);  // 1500
account.withdraw(200); // 1300
console.log(account.balance); // undefined — 직접 접근 불가!
```

### 2. 함수 팩토리

```javascript
// 곱셈 함수 팩토리
function multiplier(factor) {
  return (number) => number * factor;
}

const double = multiplier(2);
const triple = multiplier(3);
const tenX   = multiplier(10);

console.log(double(5));  // 10
console.log(triple(5));  // 15
console.log(tenX(5));    // 50

// 실용 예: 권한 체크 팩토리
function requireRole(role) {
  return function(handler) {
    return function(req, res) {
      if (req.user?.role !== role) {
        return res.status(403).json({ error: '권한 없음' });
      }
      return handler(req, res);
    };
  };
}

const requireAdmin = requireRole('admin');
app.delete('/users/:id', requireAdmin(deleteUserHandler));
```

### 3. 메모이제이션 (Memoization)

```javascript
function memoize(fn) {
  const cache = new Map(); // 클로저로 캐시 보존
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      console.log('캐시 히트:', key);
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensiveCalculation = memoize(function(n) {
  console.log(`계산 중: ${n}`);
  return n * n * n;
});

expensiveCalculation(5); // "계산 중: 5" → 125
expensiveCalculation(5); // "캐시 히트" → 125 (재계산 없음)
expensiveCalculation(3); // "계산 중: 3" → 27
```

### 4. 부분 적용 (Partial Application)

```javascript
function partial(fn, ...presetArgs) {
  return function(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

function add(a, b, c) {
  return a + b + c;
}

const add5 = partial(add, 5);       // a = 5 고정
const add5and3 = partial(add, 5, 3); // a = 5, b = 3 고정

console.log(add5(3, 2));    // 10
console.log(add5and3(7));   // 15

// 실용 예: API 호출 기본값 설정
const apiCall = partial(fetch, 'https://api.example.com');
const getUser = partial(apiCall, '/users');
```

### 5. 이벤트 핸들러와 클로저

```javascript
// 주의: var로 인한 클로저 함정
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3 — 예상: 0, 1, 2
}

// 해결 1: let 사용 (블록 스코프)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2 ✓
}

// 해결 2: 클로저로 캡처
for (var i = 0; i < 3; i++) {
  ((j) => {
    setTimeout(() => console.log(j), 100); // 0, 1, 2 ✓
  })(i);
}
```

## 클로저와 메모리

클로저는 외부 스코프의 변수를 참조하므로 해당 변수가 가비지 컬렉션되지 않습니다.

```javascript
function createHeavyObject() {
  const largeArray = new Array(1000000).fill('data'); // 큰 배열
  
  return function() {
    return largeArray.length; // largeArray를 계속 참조
  };
}

const fn = createHeavyObject();
// largeArray는 fn이 존재하는 한 메모리에서 해제되지 않음

// 해제하려면
fn = null; // 참조 제거 → largeArray 가비지 컬렉션 가능
```

Node.js 서버에서 클로저 누수는 심각한 메모리 문제를 일으킬 수 있습니다. 필요 없어진 클로저는 명시적으로 참조를 제거해야 합니다.

## 클로저 vs 클래스

같은 기능을 클로저와 클래스로 비교합니다:

```javascript
// 클로저 방식
function createUser(name, role) {
  return {
    getName: () => name,
    isAdmin: () => role === 'admin',
    greet: () => `안녕하세요, ${name}님`
  };
}

// 클래스 방식
class User {
  #name;
  #role;
  
  constructor(name, role) {
    this.#name = name;
    this.#role = role;
  }
  
  getName() { return this.#name; }
  isAdmin() { return this.#role === 'admin'; }
  greet() { return `안녕하세요, ${this.#name}님`; }
}
```

클로저 방식은 프로토타입 체인이 없어 메모리를 더 사용하지만 `this` 바인딩 문제가 없습니다. 함수형 프로그래밍 스타일과 잘 어울립니다.

## 실전 체크리스트

- `var` + 루프에서 클로저 사용 시 → `let` 또는 즉시실행함수(IIFE)로 교체
- 대용량 데이터를 클로저가 참조할 때 → 필요한 값만 추출해 저장
- 메모이제이션 캐시 크기 → 무한 성장 방지 (LRU 캐시 패턴 고려)
- 클로저로 private 상태 구현 시 → ES2022 `#field` 대안도 고려

클로저는 JavaScript의 함수형 특성의 핵심입니다. React의 `useState`, Redux의 미들웨어, Express의 미들웨어 체인 모두 클로저 위에서 동작합니다. 단순한 개념이지만 깊이 이해하면 더 안전하고 표현력 있는 코드를 작성할 수 있습니다.
