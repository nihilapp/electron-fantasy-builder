# 개발 워크플로우 (Development Workflow) - Fantasy Builder

**최종 업데이트**: 2026-02-07  
**버전**: 1.0.0  
**분석 일자**: 2026-02-07

---

## 개요 (Overview)

이 문서는 Fantasy Builder 프로젝트의 개발 워크플로우, 빌드 프로세스, 모범 사례에 대한 포괄적인 가이드를 제공합니다.

---

## 개발 환경 설정 (Development Environment Setup)

### 사전 요구사항

#### 필수 소프트웨어
- **Node.js**: 버전 18 이상
- **패키지 매니저**: pnpm (워크스페이스 지원 권장)
- **Git**: 버전 관리용
- **IDE**: VS Code (확장 프로그램 포함 권장)

#### 권장 VS Code 확장 프로그램
```json
{
  "recommendations": [
    "Vue.volar",
    "Vue.vscode-typescript-vue-plugin",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-json"
  ]
}
```

### 초기 설정

#### 1. 저장소 클론
```bash
git clone <repository-url>
cd electron-fantasy-builder
```

#### 2. 의존성 설치
```bash
# 모든 의존성 설치
pnpm install

# 네이티브 모듈(SQLite) 리빌드
pnpm run rebuild
```

#### 3. 데이터베이스 초기화
```bash
# 로컬 데이터베이스 마이그레이션 생성
pnpm db:generate

# 데이터베이스 마이그레이션 실행
pnpm db:migrate
```

#### 4. 환경 설정
```bash
# 환경 설정 복사 (필요한 경우)
cp .env.example .env
```

---

## 개발 워크플로우 (Development Workflow)

### 일일 개발 사이클

#### 1. 개발 서버 시작
```bash
# 핫 리로드와 함께 모든 프로세스 시작
pnpm run dev
```

이 명령어는:
- 네이티브 SQLite 모듈 리빌드
- 3개의 Electron 프로세스 모두 빌드
- Hono API 서버 시작
- 핫 리로드가 적용된 Electron 앱 실행
- 렌더러 개발자 도구 열기

#### 2. 개발 모드 기능

**핫 리로드 설정**
- **메인 프로세스**: 파일 변경 시 자동 재시작
- **Preload 스크립트**: 변경 시 리빌드 및 리로드
- **렌더러 프로세스**: 즉각적인 UI 업데이트를 위한 Vite HMR

**개발 도구 접근**
- **렌더러 DevTools**: 개발 모드에서 자동 열림
- **메인 프로세스 디버깅**: VS Code 런치 설정 사용
- **데이터베이스 브라우저**: 로컬 DB 검사를 위해 SQLite 브라우저 사용

#### 3. 코드 개발 프로세스

**기능 개발 패턴**
```bash
# 1. 기능 브랜치 생성
git checkout -b feature/your-feature-name

# 2. 아키텍처에 따라 구현:
#    - Zod 스키마 정의 우선
#    - 데이터베이스 마이그레이션 생성
#    - 백엔드 API 구현 (Controller → Service → Repository)
#    - 프론트엔드 UI 생성 (Store → Component)
#    - 테스트 및 문서 추가

# 3. conventional commits로 커밋
git commit -m "feat: add new feature description"

# 4. 푸시 및 풀 리퀘스트 생성
git push origin feature/your-feature-name
```

---

## 빌드 시스템 분석 (Build System Analysis)

### electron-vite 설정

#### 멀티 프로세스 빌드 설정
```typescript
// electron.vite.config.ts
export default defineConfig({
  main: {
    // 메인 프로세스 (Node.js 백엔드)
    build: {
      externalizeDeps: true,  // Node.js 모듈 번들링 하지 않음
      rollupOptions: {
        input: resolve(__dirname, 'src/main/index.ts'),
      },
    },
  },
  preload: {
    // Preload 스크립트 (보안 브리지)
    build: {
      externalizeDeps: true,
      rollupOptions: {
        input: resolve(__dirname, 'src/preload/index.ts'),
      },
    },
  },
  renderer: {
    // 렌더러 프로세스 (Vue.js 프론트엔드)
    root: 'src/renderer',
    plugins: [
      vue(),
      tailwindcss(),
      AutoImport(/* ... */),
      Components(/* ... */),
      Icons(/* ... */),
    ],
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'src/renderer/index.html'),
      },
    },
  },
});
```

#### 경로 별칭(Alias) 전략
```typescript
// 깔끔한 임포트를 위한 포괄적인 경로 매핑
resolve: {
  alias: {
    '~': resolve(__dirname, 'src/renderer'),           // 프론트엔드 단축경로
    '@main': resolve(__dirname, 'src/main'),           // 백엔드 단축경로
    '@preload': resolve(__dirname, 'src/preload'),       // Preload 단축경로
    '@config': resolve(__dirname, 'src/config'),        // 설정
    '@app-types': resolve(__dirname, 'src/types'),     // 공유 타입
    '@zod-schema': resolve(__dirname, 'src/zod-schema'), // 검증 스키마
    // ... 기타 별칭
  },
}
```

### 빌드 명령어 분석

#### 개발 명령어
```bash
# 전체 개발 셋업
pnpm run dev
# → pnpm run rebuild && electron-vite build && electron-vite dev

# 네이티브 모듈 리빌딩
pnpm run rebuild
# → electron-rebuild -f -w better-sqlite3

# 아이콘 이름 타입 생성
pnpm run generate:icon-name-type
# → node scripts/generate-icon-name-type.mjs
```

#### 프로덕션 명령어
```bash
# 프로덕션용 빌드
pnpm run build
# → electron-vite build (모든 프로세스)

# 프로덕션 빌드 미리보기
pnpm run preview
# → electron-vite preview
```

#### 데이터베이스 명령어
```bash
# 로컬 마이그레이션 생성
pnpm db:generate
# → drizzle-kit generate --config=drizzle.config.local.ts

# 로컬 마이그레이션 실행
pnpm db:migrate
# → drizzle-kit migrate --config=drizzle.config.local.ts

# 원격 마이그레이션 생성
pnpm db:generate:remote
# → drizzle-kit generate --config=drizzle.config.remote.ts
```

---

## 코드 품질 및 표준 (Code Quality and Standards)

### ESLint 설정

#### 멀티 파일 설정
```javascript
// eslint.config.mjs
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import vue from 'eslint-plugin-vue';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config([
  js.configs.recommended,
  ...vue.configs['flat/essential'],
  ...vue.configs['flat/recommended'],
  ...tseslint.configs.recommended,
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    files: ['src/main/**/*.ts', 'src/preload/**/*.ts'],
    languageOptions: {
      globals: {
        NodeJS: true,
      },
    },
  },
  {
    files: ['src/renderer/**/*.ts', 'src/renderer/**/*.vue'],
    languageOptions: {
      globals: {
        window: true,
        document: true,
      },
    },
  },
  // ... 기타 설정
]);
```

### 코드 스타일 표준

#### TypeScript 설정
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "baseUrl": ".",
    "paths": {
      "~": ["./src/renderer"],
      "@main": ["./src/main"],
      "@preload": ["./src/preload"],
      // ... 기타 경로 매핑
    }
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue"
  ],
  "exclude": [
    "node_modules",
    "out",
    "dist"
  ]
}
```

---

## 테스트 전략 (Testing Strategy)

### 테스트 구조

#### 단위 테스트 (Unit Tests)
```bash
# 단위 테스트 실행
pnpm test

# 커버리지와 함께 테스트 실행
pnpm test:coverage

# 감시 모드
pnpm test:watch
```

#### 통합 테스트 (Integration Tests)
```bash
# API 통합 테스트 실행
pnpm test:integration

# E2E 테스트 실행
pnpm test:e2e
```

### 테스트 파일 구성
```
src/
├── main/
│   ├── server/
│   │   ├── service/
│   │   │   ├── projectService.test.ts
│   │   │   └── traitService.test.ts
│   │   └── controller/
│   │       ├── projectController.test.ts
│   │       └── traitController.test.ts
└── renderer/
    ├── stores/
    │   ├── projectStore.test.ts
    │   └── traitStore.test.ts
    └── components/
        ├── ProjectCard.test.ts
        └── TraitForm.test.ts
```

---

## 데이터베이스 개발 워크플로우 (Database Development Workflow)

### 마이그레이션 관리

#### 스키마 개발 프로세스
```bash
# 1. 스키마 파일 수정
# src/main/server/schema/local/

# 2. 마이그레이션 생성
pnpm db:generate

# 3. 생성된 마이그레이션 검토
# src/drizzle/local/

# 4. 마이그레이션 적용
pnpm db:migrate

# 5. 데이터베이스 작업 테스트
```
