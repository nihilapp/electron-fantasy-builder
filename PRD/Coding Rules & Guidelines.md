# Coding Rules & Guidelines — Fantasy Builder (Electron + Vue + Hono)

**작성일**: 2026-01-31  
**버전**: 1.0

---

## 1. Architectural Principles

### Design Pattern
**Controller → Service → DB(Mapper)** 3계층 + **도메인 주도 설계(DDD) Lite**를 적용합니다.

- **디자인 시스템 (Design System)**:
  - **Custom Only Rule**: Tailwind 기본 유틸리티 대신, `src/renderer/assets/styles`에 정의된 커스텀 토큰만 사용해야 합니다.
  - **Radius 규칙**: 둥글기 크기는 **반드시 숫자**(`rounded-2`, `rounded-3` 등)만 사용합니다.
    - `sm`, `md`, `lg`, `xl` 등 Semantic 이름 사용 금지.
    - **예외**: `rounded-full`은 허용 (원형).
  - **확장**: 새로운 스타일 토큰이 필요하면 `assets/styles` 내의 해당 CSS 파일(`radius.css`, `colors.css` 등)에 변수를 정의한 후 사용합니다.
  - **프로젝트 포인트 컬러**: Primary / Accent / Ring은 **blue500** 계열로 통일. `theme.css`에서 `--color-primary`, `--color-accent`, `--color-ring` 등은 `blue-500`(및 라이트/다크용 blue-100, blue-900) 사용.
  - **시맨틱 토큰 (다크/라이트 공통)**: 텍스트·배경·테두리는 `text-foreground`, `text-muted-foreground`, `bg-background`, `bg-card`, `border-border` 등 **시맨틱 토큰**만 사용. `text-slate-200`, `bg-violet-500/20` 등 팔레트 하드코딩은 지양. 에러/삭제는 `text-destructive`, `hover:text-destructive` 사용.
  - **설정 목록 아이템 (SettingItemCard)**: 주요 설정·특성/능력 등 설정 목록의 한 행은 공통 컴포넌트 `SettingItemCard`(`src/renderer/components/common/SettingItemCard.vue`) 사용. 레이아웃: 카테고리(라벨) + 제목 같은 행·카테고리 선행·우측 상단 컨트롤(보기/수정/즐겨찾기/보호/삭제). 동작은 emit(`view`, `edit`, `toggle-favorite`, `toggle-protected`, `delete`)으로 부모에서 처리. **예외**: 즐겨찾기 강조(별 아이콘)는 시맨틱 토큰 미정의 시 `text-amber-500`/`fill-amber-500` 등 amber 팔레트 사용을 허용한다.
  - **컴포넌트 (Components)**: Drizzle 쿼리 수행. `getDb()`로 연결 취득 후 `schema/local` 또는 `schema/remote` 스키마 사용.

### Directory Strategy
- **Main / Preload / Renderer** 분리.
- **공용 타입**: `src/types/` 에만 정의. main·renderer 모두 `@app-types/*` 로 참조. DTO·테이블·config 타입 중복 정의 금지.
- **직접 임포트**: 타입·심볼은 **필요한 곳에서 정의처를 직접 import**한다. 임포트한 뒤 다시 export하는 **재익스포트 패턴**(예: `export type { X } from '...'`, 파일 상단에서 import 후 `export { X }`)은 사용하지 않는다.
- **타입 파일 명명**: `src/types/` 아래 파일은 반드시 `*.types.ts` 로 명명 (예: `response.types.ts`, `config.types.ts`).
- **상수**: `src/constants/` 아래 파일은 `*.const.ts` 로만 명명 (예: `response-code.const.ts`).
- **도메인별**: Controller, Service, Mapper는 기능 단위로 구성. 공통(common)은 shared 또는 공통 모듈로.

### IPC vs API
- **엔드포인트 통신 = API(HTTP)**. Hono·외부 서버 호출은 axios(메인) 또는 fetch(렌더러 honoClient)로만 수행.
- **설정·앱 단 통신 = IPC**. base URL, DB 모드 등은 IPC로 제공.

### 목록 API vs 상세 API (모든 엔티티 공통)
- **목록 API (List)**: 응답 항목에는 **식별자(PK) + 이름(표시명) + 메타정보(공통 컬럼: useYn, delYn, shrnYn, crtNo, crtDt, updtNo, updtDt, delNo, delDt)** 만 포함한다. 상세 본문(긴 텍스트, 설명, 연관 데이터 등)은 목록에 넣지 않는다.
- **상세 API (GetByNo 등)**: 개별 항목의 전체 데이터는 **해당 상세 페이지 진입 시에만** 조회·반환한다. 목록 화면에서는 상세 본문을 가져오지 않는다.
- 이 원칙은 **주요 설정(core-rules), 특성(traits), 능력(abilities)** 등 모든 설정 엔티티에 공통 적용한다.

---

## 2. Folder Structure (Tree View)

```
fantasy-builder-exe/
├── src/
│   ├── config/                # 설정 (앱 전역)
│   │   └── app.json           # api.baseURL, server(port/hostname), db(mode/local/remote)
│   ├── types/                 # 공용 타입 (main·renderer 공유, @app-types/*). 파일명은 *.types.ts
│   │   ├── config.types.ts    # AppConfig, ServerConfig, ApiConfig
│   │   ├── db.types.ts        # DbConfig, DbMode
│   │   ├── dto.types.ts       # API DTO
│   │   ├── response.types.ts # API 응답 래퍼 타입
│   │   └── table.types.ts     # Drizzle InferSelectModel/InferInsertModel
│   ├── constants/             # 앱 전역 상수 (@constants/*)
│   │   ├── index.ts
│   │   └── *.const.ts         # 상수 파일은 반드시 *.const.ts 명명 (예: response-code.const.ts)
│   ├── data/                  # 로컬 DB 파일 등 (app.db)
│   ├── drizzle/               # Drizzle 마이그레이션 (local | remote)
│   │   ├── local/
│   │   └── remote/
│   ├── main/                  # Main Process
│   │   ├── index.ts
│   │   ├── api/               # Hono API (axios 단일 인스턴스)
│   │   │   ├── index.ts
│   │   │   ├── clients.ts
│   │   │   └── apiGet*.ts
│   │   ├── ipc/               # IPC 핸들러
│   │   ├── server/            # Hono 서버 (Controller → Service → DB)
│   │   │   ├── index.ts
│   │   │   ├── honoApp.ts
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── db/            # context, client(local/remote), mapper
│   │   │   └── schema/        # Drizzle 스키마 (local | remote)
│   │   │       ├── local/     # SQLite (common.columns, *.table.ts)
│   │   │       └── remote/    # Postgres (common.columns, *.table.ts)
│   │   └── window/
│   ├── preload/
│   └── renderer/              # Vue (Composition API)
│       ├── api/
│       ├── assets/
│       ├── views/
│       ├── router/
│       └── App.vue
├── PRD/
│   ├── PRD.md
│   ├── Coding Rules & Guidelines.md
│   ├── Development Task List.md
│   ├── TODO.md
│   └── plans/
└── package.json
```

---

## 3. Naming Conventions (Strict)

### Files
- **IPC**: `ipc<행위><대상>.ts` (예: ipcGetDbMode.ts)
- **API**: `apiGet<대상>.ts`, `apiPost<대상>.ts` 등
- **Controller/Service**: `*Controller.ts`, `*Service.ts`
- **Mapper**: `*Mapper.ts` 또는 도메인별 mapper
- **Schema**: `*.table.ts`, `common.columns.ts`
- **Types**: `src/types/` 아래 파일은 반드시 `*.types.ts` 로 명명 (예: `response.types.ts`, `config.types.ts`).
- **Constants**: `src/constants/` 아래 파일은 반드시 `*.const.ts` 로 명명 (예: `response-code.const.ts`).
- **Vue**: `PascalCase.vue`

### Variables / Types
- **Variables**: `camelCase`. boolean은 `is*`, `has*` 권장.
- **Constants**: `UPPER_SNAKE_CASE`. 설정은 `config/app.json`.
- **Types/Interfaces**: `PascalCase`. DTO는 `*Dto`, 테이블 get/insert는 `InferSelectModel`/`InferInsertModel` 또는 `*TableGet`/`*TablePost`.

### Database
- **테이블명**: `snake_case` 복수형 (users, projects, traits, char_trait_maps)
- **컬럼명**: `snake_case` (user_no, prj_no, trait_nm)

### Commits
- **Conventional Commits**: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:` 등

---

## 4. Coding Standards

### Type Safety
- **`any` 사용 금지**. 불가피한 경우 `unknown` 사용 후 Type Narrowing.
- **공용 타입**: `src/types/` 에 한 곳만 정의. main·renderer에서 `@app-types/*` 로 import.
- **반환 타입**: 함수·메서드의 **리턴 타입은 굳이 명시하지 않는다**. TypeScript 추론으로 충분하며, 명시 시 코드만 어수선해져 가독성이 떨어진다.

### Style & Documentation
- **한 줄 공백 (기본 규칙)**: **변수**, **함수**, **클래스**, **조건문**(if/else/switch), **반복문**(for/while 등)끼리는 **한 줄의 공백**을 둔다. 이유 불문, 기본 규칙이다. **함수 내부**에서도 동일: 변수 선언·조건문·반복문·함수 호출 등 서로 다른 성질의 블록 사이에는 반드시 한 줄 띄어 쓴다.
- **변수·매개변수 축약 금지**: `c`처럼 의미를 파악할 수 없는 축약을 사용하지 않는다. (예: Hono 컨텍스트는 `c` 대신 `context`, `context.json()`으로 작성.) 코드는 결국 사람이 보는 것이므로 사람이 이해할 수 있어야 한다.
- **JSDoc**: 모든 함수·메서드에는 JSDoc을 붙인다. `@description`(또는 설명 문단)과 `@param`으로 인자를 설명한다.
- **응답 JSON 포맷**: `context.json()` 등으로 넘기는 응답 객체는 **필드당 한 줄**로 작성한다. 모든 필드를 줄바꿈하여 나열한다.
- **객체 줄바꿈**: 응답 객체가 아니더라도 **필드가 여러 개인 객체**는 한 줄에 쓰지 않고 **줄바꿈하여 필드당 한 줄**로 작성한다. (타입 정의·리터럴·인라인 객체 모두 해당.)
- **블록 구분**: 위 "한 줄 공백" 기본 규칙에 따른다. 성질이 다른 코드 블록 사이에는 반드시 한 줄 띄어 쓴다.
- **함수 인자·매개변수 줄바꿈**: 함수의 **매개변수가 두 개 이상**이면 한 줄에 나열하지 않고 **줄바꿈**하여 매개변수당 한 줄로 작성한다. 호출 시 **인자가 두 개 이상**인 경우에도 같은 방식으로 줄바꿈하여 가독성을 확보한다.
- **긴 줄 줄바꿈**: 한 줄의 **글자 수가 길어지면** (예: 100자~120자 초과) 한 줄에 두지 않고 **줄바꿈**하여 여러 줄로 나눈다. 함수 호출·메서드 체인·콜백 등 모두 해당한다. 예: `return context.json(toErrorResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, message), 200);` 처럼 인자만으로도 길어지면 호출을 여러 줄로 나누어 작성한다. 가독성을 위한 규칙이다.
- **화살표 함수 반환부 줄바꿈**: 화살표 함수의 **반환 식**을 다음 줄로 나눌 때는 반드시 **소괄호 `( )`로 감싼다**. `=>` 다음에 `(`를 두고, 반환 식을 다음 줄에 쓴 뒤 `);`로 닫는다. (예: `(a, b) => (\n  a.localeCompare(b)\n);`) 이렇게 해야 반환되는 값이 하나의 식임이 명확해진다.
- **상수 필드 문서화**: 상수 객체의 각 필드에는 **필드 상단에 한 줄짜리 JSDoc**으로 설명을 둔다. (예: `/** @description 리소스 생성 성공 */`) 우측에 일반 주석(`//`)을 달지 않는다. 상수가 어떤 의미인지 파악하기 위한 규칙이다.
- **이벤트 핸들러 함수명**: 함수명은 `on<Action><Target>` 형식을 따른다. (예: `onClickSidebarEmpty`, `onSubmitForm`). `handle*` 접두어는 사용하지 않는다.

### Schema (Drizzle)
- **공통 필드**: `common.columns.ts` (useYn, shrnYn, delYn, crtNo, crtDt, updtNo, updtDt, delNo, delDt)를 모든 엔티티 테이블에 spread.
- **TS 필드명**: camelCase. DB 컬럼명: snake_case.
- **로컬(SQLite)**: integer PK autoIncrement, text(날짜는 ISO 8601 문자열).
- **원격(Postgres)**: serial/bigint, text, timestamp, varchar.

### Service / Controller
- **Service**: 비즈니스 로직. Mapper 결과 → DTO 변환. Entity 직접 반환 금지.
- **Controller**: RESTful. 모든 API 응답은 **HTTP 200**. `@app-types/response.types` 의 **ResponseType&lt;TData&gt;** 구조(`data`, `error`, `code`, `message`)로 통일. 목록 API는 **ResponseType&lt;ListType&lt;TData&gt;&gt;** (ListResponseType&lt;TData&gt;) 사용.
- **Hono 핸들러**: 위 "변수·매개변수 축약 금지" 규칙 적용. 컨텍스트 매개변수는 `context` 등 의미가 드러나는 이름을 사용한다.
- **API 응답**: ResponseType 전체를 반환. 호출부에서 `data`만 잘라서 전달하지 말 것.
- **코드 스타일**: 웬만하면 구문은 한 줄씩 띄어서 작성 (한 줄에 한 문장·표현, 논리 블록 사이 빈 줄).

### Error Handling
- **Renderer**: API 호출 실패 시 try/catch로 메시지 표시.
- **Main**: 예외는 IPC 응답으로 전달하지 않고, API 레이어에서 catch 후 적절한 응답/로그 처리.

### Logging
- **Main**: console.log/error (개발 시). API 요청/응답은 `main/api/clients.ts` 인터셉터에서 로그.
- **Renderer**: DevTools Console.

### State Management (Pinia)
- **State 접근**: 반드시 `storeToRefs`를 사용하여 반응성을 유지하며 구조 분해 할당해야 한다. `store.state` 형식의 직접 접근은 금지한다.
- **Action 사용**: Store 인스턴스에서 직접 구조 분해 할당하여 사용한다. `store.action()` 형식의 직접 호출은 금지한다.
  ```typescript
  // Bad
  const store = useStore();
  const value = store.count;
  store.increment();

  // Good
  const store = useStore();
  const { count } = storeToRefs(store);
  const { increment } = store;
  increment();
  ```

### Auto-Import (Renderer)
- **적용 범위**: `src/renderer` 아래 모든 파일 (`.vue`, `.ts`). Main/Preload 프로세스에는 적용되지 않는다.
- **설정**: `electron.vite.config.ts`의 `unplugin-auto-import` 플러그인. 생성되는 타입 선언은 `src/renderer/auto-imports.d.ts`에서 확인한다.
- **자동 임포트 목록** (이 목록에 있는 심볼은 **import하지 않는다**):
  - **Vue**: `ref`, `computed`, `watch`, `watchEffect`, `onMounted`, `onUnmounted`, `onActivated`, `inject`, `provide`, `createApp` 등 Vue API 전역.
  - **vue-router**: `useRoute`, `useRouter`, `onBeforeRouteLeave`, `onBeforeRouteUpdate`, `useLink`.
  - **Pinia**: `defineStore`, `storeToRefs`.
- **규칙**: 위 목록에 포함된 심볼은 코드에서 **명시적 import를 작성하지 않는다**. 자동 임포트만 사용하여 중복을 제거한다.
- **예외**: `createPinia`, `createRouter`, `createWebHashHistory`, `RouterView` 등 자동 임포트 목록에 없는 것은 기존처럼 import한다.

---

## 5. Fantasy Builder 특화 규칙

### VO (Value Object) 패턴
- **Single Source of Truth**: `src/zod-schema/` 의 Zod 스키마를 기반으로 `z.infer`를 사용하여 타입을 생성함.
- **스키마 확장**: 모든 도메인 VO 스키마는 반드시 `commonSchema`와 `searchSchema`를 확장(`extend`)하여 생성해야 합니다.
- **모든 필드는 선택값**: VO의 모든 필드는 **반드시 선택적(optional)**이어야 합니다. (`z.string().nullable().optional()` 등). 이는 VO가 검색 조건, 부분 업데이트, 생성 등 다양한 상황에서 유연하게 재사용되기 위함입니다.
- **검색 필드 포함**: 위 확장을 통해 자동으로 `page`, `pageSize`, `searchKeyword`, `searchType` 등 검색 및 페이징 필드를 포함하게 됩니다.

### 응답 규격
- **목록 응답**: `ResponseType<ListType<TData>>` (ListResponseType) 사용. data 안에 `list`, `totalCnt`, `pageSize`, `page`, `totalPage`, `isFirst`, `isLast` 유지.
- **페이징**: 기본 `pageSize`는 10이며, 사용자 요청이 있을 경우 해당 값을 우선합니다.

### 목록 조회 및 검색 처리
- **Controller**: 쿼리 스트링을 VO 스키마로 파싱하여 서비스로 전달합니다. (예: `projectSchema.parse({ ...query, page, pageSize })`)
- **Service**: VO를 매퍼의 `selectList` 메서드에 통째로 전달합니다.
- **Mapper**:
    - `selectList(params: VO)` 형태로 정의합니다.
    - `params`에서 `searchKeyword`와 `searchType`을 추출하여 Drizzle의 `and`, `or`, `like` 연산자로 동적 `WHERE` 절을 생성합니다.
    - `params`의 `page`와 `pageSize`를 이용해 `limit`와 `offset`을 계산합니다.
    - **소프트 삭제**: 모든 조회 시 `del_yn = 'N'` 조건을 기본으로 포함합니다.

### UI (보기/수정 폼)
- **보기 상태**: plain text가 아닌 **수정 불가(disabled) input**으로 표시한다. 레이블·필드 구조는 수정 모드와 동일하게 두고, 보기일 때만 input/textarea에 `disabled`를 적용한다.
- **수정 가능한 폼 요소**: 편집 가능한 input/textarea 등은 배경을 **흰색(bg-white)**으로 통일한다. 보기 상태(disabled)일 때는 회색 배경(bg-gray-50 등)으로 구분해도 된다.

### Vue 컴포넌트 구조 (script setup)
- **CVA 구조 필수**: `App.vue`를 제외한 모든 컴포넌트는 `class-variance-authority (cva)`를 사용하여 스타일 변주를 관리해야 한다. `defineProps` 인터페이스는 `VariantProps<typeof cssVariants>`를 확장해야 한다.
- **기준 템플릿**: `src/renderer/components/template.vue`. 모든 Vue 컴포넌트(`.vue`)는 이 템플릿과 **동일한 script setup 내부 구조**를 따라야 한다.
- **섹션 순서 (필수)**:
  1. **BASE** — `defineProps`, `cva`/`cssVariants` 등 기본 정보. Props 인터페이스·타입은 섹션 위에.
  2. **STOREDATA** — Pinia 스토어 사용 시. 미사용 시 빈 섹션 또는 주석만 유지.
  3. **STATES** — `ref`, `computed` 등 반응형 변수.
  4. **ACTIONS** — 위 변수들을 제어하는 함수들.
  5. **WATCH** — `watch()` 정의.
  6. **LIFECYCLE** — `onMounted`, `onUnmounted` 등.
- **경계 주석**: BASE는 `// ═══...` 로 상·하 경계, 나머지 섹션은 `// ───...` 로 상·하 경계. 정확한 문구·길이는 `template.vue` 참고.
- 새 컴포넌트는 `template.vue` 를 복사한 뒤 내용만 채우고, 기존 컴포넌트 수정 시에도 위 순서·경계를 유지한다.

### 기타 규칙
- **소프트 삭제**: `del_yn = 'Y'`로 표시.
- **공유 여부**: `shrn_yn = 'Y'`인 경우 접근 제어 정책에 따라 조회 허용.
- **Vue에서 API**: 반드시 `window.electron.api.*` 로만 접근. IPC는 설정·ping 등 비엔드포인트 통신용.

---

*문서 끝*
