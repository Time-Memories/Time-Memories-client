# Architecture: Feature-Sliced Design (FSD)

이 프로젝트는 [Feature-Sliced Design](https://feature-sliced.design/) 아키텍처를 따릅니다.

---

## 레이어 구조

```
src/
├── app/          # 앱 초기화 (프로바이더, 라우팅, 전역 스타일)
├── pages/        # 페이지 단위 컴포지션
├── widgets/      # 독립적인 복합 UI 블록
├── features/     # 사용자 인터랙션 단위 기능
├── entities/     # 비즈니스 엔티티 (User, Post 등)
└── shared/       # 재사용 가능한 공통 코드 (API 클라이언트, UI 킷, 유틸)
```

### 의존성 방향

레이어는 **자신보다 아래 레이어만** import할 수 있습니다.

```
app → pages → widgets → features → entities → shared
```

- `shared`는 다른 레이어를 import하지 않습니다.
- `pages`는 `widgets`, `features`, `entities`, `shared`를 import할 수 있습니다.
- 같은 레이어 간 import는 금지입니다.

---

## 슬라이스 & 세그먼트

레이어(`app` 제외) 안에서 **슬라이스**(도메인/기능 단위)로 분리하고,
슬라이스 안에서는 **세그먼트**로 역할을 구분합니다.

| 세그먼트  | 역할               |
| --------- | ------------------ |
| `ui/`     | React 컴포넌트     |
| `model/`  | 상태, 스토어, 타입 |
| `api/`    | API 요청 함수      |
| `lib/`    | 슬라이스 내부 유틸 |
| `config/` | 상수, 설정         |

### 공개 API (index.ts)

각 슬라이스는 `index.ts`를 통해서만 외부에 노출합니다.
내부 세그먼트 파일을 직접 import하지 않습니다.

```ts
// ✅ 올바른 방법
import { MainLayout } from '@widgets/main-layout';

// ❌ 금지
import { MainLayout } from '@widgets/main-layout/ui/MainLayout';
```

---

## Import 경로 규칙

### 레이어 간 (Cross-layer) — 절대경로 alias 사용

다른 레이어를 참조할 때는 **레이어별 alias**를 사용합니다.

| Alias         | 경로             |
| ------------- | ---------------- |
| `@app/*`      | `src/app/*`      |
| `@pages/*`    | `src/pages/*`    |
| `@widgets/*`  | `src/widgets/*`  |
| `@features/*` | `src/features/*` |
| `@entities/*` | `src/entities/*` |
| `@shared/*`   | `src/shared/*`   |

```ts
// ✅ 레이어 간 — alias 사용
import { MainLayout } from '@widgets/main-layout';
import { http, ENDPOINTS } from '@shared/api';
import { HomePage } from '@pages/home';
```

### 슬라이스 내부 (Intra-slice) — 상대경로 사용

같은 슬라이스 안에서는 **상대경로**를 사용합니다.
슬라이스를 독립적으로 이동·재사용할 수 있도록 하기 위함입니다.

```ts
// ✅ 슬라이스 내부 — 상대경로
// shared/api/http.ts 내부
import { getAccessToken } from './auth';
import { toApiClientError } from './error';
```

### `@/*` alias

`@/*` → `src/*` 는 위 규칙에 맞지 않는 예외적인 경우(예: `src/` 루트 파일)에만 사용합니다.

---

## 현재 구조

```
src/
├── app/
│   ├── providers/
│   │   └── AppProviders.tsx      # QueryClient, BrowserRouter
│   ├── router/
│   │   └── index.tsx             # 라우팅 정의
│   ├── styles/
│   │   └── index.css             # Tailwind import, CSS 변수
│   └── index.tsx                 # 루트 App 컴포넌트
├── pages/
│   ├── home/
│   │   ├── model/types.ts        # HomeTab 등 페이지 UI 상태
│   │   ├── ui/
│   │   │   ├── HomePage.tsx
│   │   │   ├── CalendarView.tsx
│   │   │   ├── MiniCalendar.tsx
│   │   │   ├── MemberAvatars.tsx
│   │   │   ├── RoomListView.tsx
│   │   │   └── TabSwitcher.tsx
│   │   └── index.ts
│   ├── room/
│   │   ├── model/types.ts        # RoomView ('diary' | 'chat') UI 상태
│   │   ├── ui/
│   │   │   ├── RoomPage.tsx
│   │   │   └── InviteSheet.tsx   # widgets/invite-sheet re-export
│   │   └── index.ts
│   └── not-found/
│       ├── ui/NotFoundPage.tsx
│       └── index.ts
├── widgets/
│   ├── main-layout/
│   │   ├── ui/MainLayout.tsx
│   │   └── index.ts
│   ├── invite-sheet/
│   │   ├── ui/InviteSheet.tsx    # 방 초대 바텀시트
│   │   └── index.ts
│   ├── room-header/
│   │   ├── ui/RoomHeader.tsx     # 방 화면 상단 헤더
│   │   └── index.ts
│   └── diary-list/
│       ├── ui/DiaryListView.tsx  # 일기 목록 + FAB
│       └── index.ts
├── features/
│   └── chat/
│       ├── ui/ChatView.tsx       # 채팅 메시지 목록 + 전송
│       └── index.ts
├── entities/
│   ├── diary/
│   │   ├── model/types.ts        # DiaryEntry
│   │   ├── ui/DiaryEntryCard.tsx
│   │   └── index.ts
│   ├── room/
│   │   ├── model/types.ts        # RoomInfo
│   │   └── index.ts
│   └── message/
│       ├── model/types.ts        # ChatMessage
│       └── index.ts
└── shared/
    ├── api/                      # axios 클라이언트, 토큰, 에러 처리
    ├── ui/                       # (비어있음)
    ├── lib/                      # (비어있음)
    └── config/                   # (비어있음)
```

---

## shared/api

axios 인스턴스, 토큰, 에러 처리, 공통 타입을 제공합니다.

```ts
import { http, ENDPOINTS, unwrapApiResponse } from '@shared/api';

const response = await http.get(ENDPOINTS.health);
const data = unwrapApiResponse(response.data);
```

환경 변수:

- `VITE_API_BASE_URL` — API 서버 주소 (기본값: `http://localhost:8080`)
- `VITE_API_TIMEOUT_MS` — 요청 타임아웃 ms (기본값: `10000`)
