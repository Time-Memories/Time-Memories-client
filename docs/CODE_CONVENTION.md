# 코드 컨벤션

## 1. 컴포넌트

### 네이밍

- 모든 리액트 컴포넌트는 **PascalCase** 를 사용해요.
- 일반 컴포넌트는 **Arrow Function** 형태로 작성해요.

```tsx
export const MyComponent = () => {};
```

### Props

- Props 타입은 `interface` 를 사용해 정의해요.
- 타입 이름은 `컴포넌트명Props` 형태로 작성해요.
- `React.FC` 는 사용하지 않아요.

```tsx
export interface MyComponentProps {}

export const MyComponent = ({}: MyComponentProps) => {};
```

### 페이지 컴포넌트

- 페이지 컴포넌트는 `export default function` 형태로 작성해요.
- 페이지 단위 Lazy Loading 시 더 간결하게 사용할 수 있어요.

```tsx
export default function HomePage() {}
```

### 디렉토리 구조

각 컴포넌트는 별도의 디렉토리로 관리해요.

```text
MyComponent/
├── index.ts
├── MyComponent.tsx
```

- `index.ts` 는 외부로 컴포넌트를 노출하는 배럴 파일이에요.
- 관련된 컴포넌트들은 같은 디렉토리에 배치해 응집도를 높여요.

---

## 2. API

### 타입 정의

요청과 응답 타입은 `interface` 로 정의해요.

```ts
export interface GetUserRequestBody {}

export interface GetUserResponseBody {
  name: string;
}
```

- 요청 타입은 `RequestBody`
- 응답 타입은 `ResponseBody`

접미사를 사용해 구분해요.

### API 함수

API 함수는 `export async function` 형태로 작성해요.

```ts
export async function getUserById(id: number) {
  return await api.get(`/users/${id}`);
}
```

함수 이름은 동사로 시작해요.

- get
- create
- edit
- delete
- signup

필요한 경우 `ById`, `ByEmail` 과 같이 조회 기준을 함께 명시해요.

### 파일 구성

관련된 타입, API 함수, Query Hook, Mutation Hook 은 하나의 파일에 함께 작성해요.

```ts
export interface CreateUserRequestBody {}
export interface CreateUserResponseBody {}

export async function createUser() {}

export const useCreateUser = () => {};
```

API 명세가 변경될 때 수정 범위를 최소화할 수 있어요.

---

## 3. React Query

### Query Key

Query Key 는 `service/_keys.ts` 파일에서 관리해요.

```ts
export const UserQueryKeys = {
  GET_PROFILE_BY_ID: (id: number) => ['USER', 'GET_PROFILE_BY_ID', id],
} as const;
```

- 객체 형태로 관리해요.
- 의존성이 없어도 함수 형태로 통일해요.
- Query Invalidation 시 동일한 Key 를 사용해요.

---

## 4. Zod

유효성 검증은 `zod` 와 `react-hook-form` 을 사용해요.

```ts
export const SignUpSchema = z.object({});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
```

- 스키마는 `Schema` 접미사를 사용해요.
- 스키마 기반 타입은 `SchemaType` 접미사를 사용해요.

---

## 5. Widget

재사용성이 낮고 특정 화면에 종속적인 컴포넌트는 `Widget` 접미사를 사용해요.

```tsx
export const ChatbotWidget = () => {};
```

Widget 은 FSD의 Widget Layer 에 위치시켜 관리해요.

---

## 6. 공통 원칙

- TypeScript를 사용해요.
- `interface` 사용을 우선해요.
- `React.FC` 는 사용하지 않아요.
- Barrel Export를 사용해요.
- FSD(Feature-Sliced Design) 구조를 따라요.
- 관련된 로직과 타입은 최대한 가까운 위치에 배치해 응집도를 높여요.
- 네이밍은 일관성을 가장 중요하게 생각해요.
