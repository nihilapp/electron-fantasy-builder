# Electron IPC 통신 가이드

이 문서는 Electron 앱에서 IPC(Inter-Process Communication) 통신을 추가하고 사용하는 방법을 설명합니다.

## 목차

- [Electron IPC 통신 가이드](#electron-ipc-통신-가이드)
  - [목차](#목차)
  - [IPC 통신 개요](#ipc-통신-개요)
  - [프로젝트 구조](#프로젝트-구조)
  - [파일명 및 함수명 규칙](#파일명-및-함수명-규칙)
    - [파일명 규칙](#파일명-규칙)
    - [함수명 규칙](#함수명-규칙)
    - [명명 규칙의 장점](#명명-규칙의-장점)
  - [IPC 통신 추가 방법](#ipc-통신-추가-방법)
    - [1단계: Main Process에 핸들러 추가](#1단계-main-process에-핸들러-추가)
    - [2단계: Preload Script에 API 노출](#2단계-preload-script에-api-노출)
    - [3단계: TypeScript 타입 정의](#3단계-typescript-타입-정의)
    - [4단계: Renderer에서 사용](#4단계-renderer에서-사용)
  - [사용 예시](#사용-예시)
    - [예시 1: 간단한 데이터 요청](#예시-1-간단한-데이터-요청)
    - [예시 2: 파일 시스템 작업](#예시-2-파일-시스템-작업)
    - [예시 3: Main Process에서 Renderer로 이벤트 전송](#예시-3-main-process에서-renderer로-이벤트-전송)
  - [고급 사용법](#고급-사용법)
    - [IPC 핸들러를 파일별로 분리](#ipc-핸들러를-파일별로-분리)
    - [에러 처리](#에러-처리)
    - [타임아웃 설정](#타임아웃-설정)
  - [주의사항](#주의사항)
    - [1. 보안](#1-보안)
    - [2. 성능](#2-성능)
    - [3. 타입 안전성](#3-타입-안전성)
    - [4. 개발 환경](#4-개발-환경)
    - [5. 디버깅](#5-디버깅)
  - [체크리스트](#체크리스트)
  - [참고 자료](#참고-자료)

---

## IPC 통신 개요

Electron은 **Main Process**(Node.js 환경)와 **Renderer Process**(브라우저 환경)로 구성됩니다. 이 두 프로세스 간 통신을 위해 IPC를 사용합니다.

- **Main Process**: 앱의 메인 로직, 파일 시스템 접근, 네이티브 API 사용
- **Renderer Process**: UI 렌더링 (Vue, React 등)
- **Preload Script**: 보안을 위해 두 프로세스 간의 안전한 브릿지 역할

### IPC vs API 구분 원칙

| 구분 | 사용처 | 예시 |
|------|--------|------|
| **API (HTTP)** | 서버·엔드포인트와의 통신 | Hono `GET /health`, `GET /users` → `fetch(baseUrl + '/경로')`, `honoClient` |
| **IPC** | 설정·구성 조회, 엔드포인트 호출이 아닌 앱 단 통신 | base URL 조회, ping, 파일/설정 접근 |

- **API 엔드포인트 소통 = API(HTTP)**. 렌더러에서 Hono·외부 서버 엔드포인트를 호출할 때는 반드시 `fetch` 등 HTTP로 요청한다.
- **그 외(설정, 앱 내 통신) = IPC**. base URL 같은 설정 조회는 IPC로 해도 된다.

---

## 프로젝트 구조

```
electron-template/
├── src/main/                    # Main Process
│   ├── index.ts            # 앱 진입점 (IPC·Hono 서버·DB context·윈도우)
│   ├── ipc/                 # IPC 핸들러
│   │   ├── index.ts        # 핸들러 등록
│   │   ├── ipcGetPing.ts   # ping 예시
│   │   └── ipcGetHonoBaseUrl.ts  # Hono base URL (렌더러에서 Hono API 호출 시 사용)
│   ├── server/              # Hono HTTP 서버 (Controller → Service → DB)
│   └── window/              # BrowserWindow
├── src/preload/
│   └── index.ts            # ipc(getHonoBaseUrl 등), api 노출
├── src/renderer/
│   ├── api/honoClient.ts   # Hono API 클라이언트 (getBaseUrl → fetch)
│   ├── types/electron.d.ts
│   └── ...
└── docs/
    └── IPC_GUIDE.md
```

**참고**: 렌더러에서 메인 프로세스의 Hono API(`http://localhost:3456` 등)를 호출할 때는 `window.electron.ipc.getHonoBaseUrl()`으로 base URL을 받은 뒤 `fetch(baseUrl + '/경로')`를 사용합니다. CORS는 Hono 앱에서 허용되어 있습니다.

---

## 파일명 및 함수명 규칙

이 프로젝트는 IPC 통신 파일과 함수에 일관된 명명 규칙을 사용합니다.

### 파일명 규칙

**형식**: `ipc<행위><대상>.ts`

- **행위**: HTTP 메서드와 유사한 동사 (Get, Post, Put, Delete, Update 등)
- **대상**: 작업 대상 (User, File, Config, Data 등)
- 첫 글자는 대문자로 시작 (PascalCase)

**예시**:
- `ipcGetUser.ts` - 사용자 조회
- `ipcPostUser.ts` - 사용자 생성
- `ipcUpdateUser.ts` - 사용자 업데이트
- `ipcDeleteUser.ts` - 사용자 삭제
- `ipcGetFile.ts` - 파일 조회
- `ipcPostFile.ts` - 파일 저장
- `ipcDeleteFile.ts` - 파일 삭제
- `ipcGetConfig.ts` - 설정 조회
- `ipcPostConfig.ts` - 설정 저장

### 함수명 규칙

**형식**: `ipc<행위><대상>()`

함수명은 파일명과 동일합니다. `setup` 접두사 없이 파일명 그대로 사용합니다.

**예시**:
- `ipcGetUser()` - `ipcGetUser.ts` 파일 내부
- `ipcPostData()` - `ipcPostData.ts` 파일 내부
- `ipcDeleteFile()` - `ipcDeleteFile.ts` 파일 내부
- `ipcGetPing()` - `ipcGetPing.ts` 파일 내부

### 명명 규칙의 장점

- **일관성**: 모든 IPC 파일이 동일한 패턴을 따름
- **가독성**: 파일명만 봐도 기능을 쉽게 파악 가능
- **확장성**: 새로운 IPC 추가 시 명확한 규칙이 있음
- **유지보수**: API 함수명과 유사한 패턴으로 이해하기 쉬움

---

## IPC 통신 추가 방법

새로운 IPC 통신을 추가하려면 다음 4단계를 따라야 합니다.

### 1단계: Main Process에 핸들러 추가

**파일 위치**: `src/main/ipc/ipc<행위><대상>.ts`

각 IPC 통신은 별도 파일로 분리하여 책임 소재를 명확하게 합니다.

**파일명 및 함수명 규칙**:
- 파일명: `ipc<행위><대상>.ts` (예: `ipcGetUser.ts`, `ipcPostData.ts`, `ipcDeleteFile.ts`, `ipcUpdateConfig.ts`)
- 함수명: `ipc<행위><대상>()` (예: `ipcGetUser()`, `ipcPostData()`) - 파일명과 동일

**예시** (`src/main/ipc/ipcGetUser.ts`):
```typescript
import { ipcMain } from 'electron';

/**
 * 사용자 데이터 조회 IPC 핸들러를 등록합니다.
 */
export function ipcGetUser() {
  ipcMain.handle('get-user-data', async (event, userId: string) => {
    // 비동기 작업 수행
    const userData = await fetchUserData(userId);
    return userData;
  });
}
```

**예시** (`src/main/ipc/ipcPostFile.ts`):
```typescript
import { ipcMain } from 'electron';
import { writeFile } from 'fs/promises';

/**
 * 파일 저장 IPC 핸들러를 등록합니다.
 */
export function ipcPostFile() {
  ipcMain.handle('save-file', async (event, filePath: string, content: string) => {
    await writeFile(filePath, content, 'utf-8');
    return { success: true };
  });
}
```

**예시** (`src/main/ipc/ipcDeleteFile.ts`):
```typescript
import { ipcMain } from 'electron';
import { unlink } from 'fs/promises';

/**
 * 파일 삭제 IPC 핸들러를 등록합니다.
 */
export function ipcDeleteFile() {
  ipcMain.handle('delete-file', async (event, filePath: string) => {
    try {
      await unlink(filePath);
      return { success: true };
    } catch (error) {
      // 에러는 자동으로 Renderer로 전달됩니다
      throw new Error(`파일 삭제 실패: ${error.message}`);
    }
  });
}
```

**`src/main/ipc/index.ts`에서 통합 등록**:
```typescript
import { ipcGetUser } from './ipcGetUser';
import { ipcPostFile } from './ipcPostFile';
import { ipcDeleteFile } from './ipcDeleteFile';

/**
 * 모든 IPC 핸들러를 등록합니다.
 */
export function setupIpcHandlers() {
  ipcGetUser();
  ipcPostFile();
  ipcDeleteFile();
}
```

**핸들러 등록 위치**: `src/main/index.ts`에서 `app.whenReady()` 내부에서 호출됩니다.

```typescript
app.whenReady().then(() => {
  setupIpcHandlers(); // IPC 핸들러 등록
  createWindow();
});
```

### 2단계: Preload Script에 API 노출

**파일 위치**: `src/preload/index.ts`

`contextBridge.exposeInMainWorld()`를 사용하여 Renderer에서 사용할 수 있는 API를 노출합니다.

```typescript
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  // 기존 API들...
  
  // 새로운 API 추가
  getUserData: (userId: string) => ipcRenderer.invoke('get-user-data', userId),
  
  saveFile: (filePath: string, content: string) => 
    ipcRenderer.invoke('save-file', filePath, content),
  
  dangerousOperation: () => ipcRenderer.invoke('dangerous-operation'),
});
```

**중요**: 
- `ipcRenderer.invoke()`는 Promise를 반환하므로 async/await로 사용할 수 있습니다.
- 파라미터는 순서대로 전달됩니다.

### 3단계: TypeScript 타입 정의

**파일 위치**: `src/renderer/types/electron.d.ts`

TypeScript에서 타입 안전성을 위해 API 타입을 정의합니다.

```typescript
interface ElectronAPI {
  // 기존 API 타입들...
  
  // 새로운 API 타입 추가
  getUserData: (userId: string) => Promise<UserData>;
  saveFile: (filePath: string, content: string) => Promise<{ success: boolean }>;
  dangerousOperation: () => Promise<OperationResult>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {};
```

**타입 정의 예시**:

```typescript
// 사용자 정의 타입도 함께 정의할 수 있습니다
interface UserData {
  id: string;
  name: string;
  email: string;
}

interface OperationResult {
  status: 'success' | 'error';
  message: string;
}
```

### 4단계: Renderer에서 사용

**Vue 컴포넌트 예시**: `src/renderer/App.vue` 또는 다른 Vue 컴포넌트

```vue
<script setup lang="ts">
import { ref } from 'vue';

const userData = ref<UserData | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

// IPC 통신 사용
const loadUserData = async (userId: string) => {
  if (!window.electron) {
    error.value = 'Electron API를 사용할 수 없습니다.';
    return;
  }

  isLoading.value = true;
  error.value = null;
  
  try {
    const data = await window.electron.getUserData(userId);
    userData.value = data;
  } catch (err) {
    error.value = err instanceof Error ? err.message : '알 수 없는 오류';
  } finally {
    isLoading.value = false;
  }
};

// 파일 저장 예시
const saveFile = async () => {
  try {
    const result = await window.electron.saveFile('/path/to/file.txt', 'content');
    if (result.success) {
      console.log('파일 저장 성공');
    }
  } catch (err) {
    console.error('파일 저장 실패:', err);
  }
};
</script>

<template>
  <div>
    <button @click="loadUserData('user-123')" :disabled="isLoading">
      사용자 데이터 로드
    </button>
    
    <div v-if="userData">
      <p>이름: {{ userData.name }}</p>
      <p>이메일: {{ userData.email }}</p>
    </div>
    
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>
```

---

## 사용 예시

### 예시 1: 간단한 데이터 요청

**Main Process** (`src/main/ipc/ipcGetAppVersion.ts`):
```typescript
import { ipcMain, app } from 'electron';

export function ipcGetAppVersion() {
  ipcMain.handle('get-app-version', async () => {
    return app.getVersion();
  });
}
```

**`src/main/ipc/index.ts`에 등록**:
```typescript
import { ipcGetAppVersion } from './ipcGetAppVersion';

export function setupIpcHandlers() {
  ipcGetAppVersion();
}
```

**Preload** (`src/preload/index.ts`):
```typescript
contextBridge.exposeInMainWorld('electron', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
});
```

**타입 정의** (`src/renderer/types/electron.d.ts`):
```typescript
interface ElectronAPI {
  getAppVersion: () => Promise<string>;
}
```

**Renderer 사용**:
```typescript
const version = await window.electron.getAppVersion();
console.log(`앱 버전: ${version}`);
```

### 예시 2: 파일 시스템 작업

**Main Process** (`src/main/ipc/ipcGetConfig.ts`):
```typescript
import { ipcMain, app } from 'electron';
import { readFile } from 'fs/promises';
import { join } from 'path';

export function ipcGetConfig() {
  ipcMain.handle('read-config', async () => {
    const configPath = join(app.getPath('userData'), 'config.json');
    const content = await readFile(configPath, 'utf-8');
    return JSON.parse(content);
  });
}
```

**Main Process** (`src/main/ipc/ipcPostConfig.ts`):
```typescript
import { ipcMain, app } from 'electron';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export function ipcPostConfig() {
  ipcMain.handle('write-config', async (event, config: object) => {
    const configPath = join(app.getPath('userData'), 'config.json');
    await writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
    return { success: true };
  });
}
```

**`src/main/ipc/index.ts`에 등록**:
```typescript
import { ipcGetConfig } from './ipcGetConfig';
import { ipcPostConfig } from './ipcPostConfig';

export function setupIpcHandlers() {
  ipcGetConfig();
  ipcPostConfig();
}
```

**Preload**:
```typescript
contextBridge.exposeInMainWorld('electron', {
  readConfig: () => ipcRenderer.invoke('read-config'),
  writeConfig: (config: object) => ipcRenderer.invoke('write-config', config),
});
```

**타입 정의**:
```typescript
interface Config {
  theme: 'light' | 'dark';
  language: string;
}

interface ElectronAPI {
  readConfig: () => Promise<Config>;
  writeConfig: (config: Config) => Promise<{ success: boolean }>;
}
```

**Renderer 사용**:
```typescript
// 설정 읽기
const config = await window.electron.readConfig();
console.log('현재 테마:', config.theme);

// 설정 저장
await window.electron.writeConfig({ theme: 'dark', language: 'ko' });
```

### 예시 3: Main Process에서 Renderer로 이벤트 전송

**Main Process** (`src/main/ipc/ipcPostTask.ts`):
```typescript
import { ipcMain, BrowserWindow } from 'electron';

export function ipcPostTask() {
  ipcMain.handle('start-task', async (event) => {
    // 작업 시작
    const mainWindow = BrowserWindow.fromWebContents(event.sender);
    
    // 주기적으로 진행 상황 전송
    for (let i = 0; i <= 100; i += 10) {
      mainWindow?.webContents.send('task-progress', i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return { completed: true };
  });
}
```

**`src/main/ipc/index.ts`에 등록**:
```typescript
import { ipcPostTask } from './ipcPostTask';

export function setupIpcHandlers() {
  ipcPostTask();
}
```

**Preload**:
```typescript
contextBridge.exposeInMainWorld('electron', {
  startTask: () => ipcRenderer.invoke('start-task'),
  onTaskProgress: (callback: (progress: number) => void) => {
    ipcRenderer.on('task-progress', (_event, progress) => callback(progress));
  },
});
```

**타입 정의**:
```typescript
interface ElectronAPI {
  startTask: () => Promise<{ completed: boolean }>;
  onTaskProgress: (callback: (progress: number) => void) => void;
}
```

**Renderer 사용**:
```typescript
const progress = ref(0);

// 진행 상황 리스너 등록
window.electron.onTaskProgress((value) => {
  progress.value = value;
});

// 작업 시작
await window.electron.startTask();
```

---

## 고급 사용법

### IPC 핸들러를 파일별로 분리

이 프로젝트는 각 IPC 통신을 별도 파일로 분리하여 책임 소재를 명확하게 합니다.

**파일명 및 함수명 규칙**:
- 파일명: `ipc<행위><대상>.ts` (예: `ipcGetUser.ts`, `ipcPostData.ts`, `ipcDeleteFile.ts`, `ipcUpdateConfig.ts`)
- 함수명: `setupIpc<행위><대상>()` (예: `setupIpcGetUser()`, `setupIpcPostData()`)

**구조**:
```
src/main/ipc/
├── index.ts              # 모든 핸들러 등록 (통합 파일)
├── ipcGetUser.ts         # 사용자 조회 핸들러
├── ipcPostUser.ts        # 사용자 생성 핸들러
├── ipcUpdateUser.ts      # 사용자 업데이트 핸들러
├── ipcDeleteUser.ts      # 사용자 삭제 핸들러
├── ipcGetFile.ts         # 파일 조회 핸들러
├── ipcPostFile.ts        # 파일 저장 핸들러
└── ipcDeleteFile.ts      # 파일 삭제 핸들러
```

**예시** (`src/main/ipc/ipcGetUser.ts`):
```typescript
import { ipcMain } from 'electron';

export function ipcGetUser() {
  ipcMain.handle('get-user', async (event, userId: string) => {
    // 사용자 데이터 조회
    const userData = await fetchUserData(userId);
    return userData;
  });
}
```

**예시** (`src/main/ipc/ipcUpdateUser.ts`):
```typescript
import { ipcMain } from 'electron';

export function ipcUpdateUser() {
  ipcMain.handle('update-user', async (event, userId: string, data: UserData) => {
    // 사용자 데이터 업데이트
    const updatedUser = await updateUserData(userId, data);
    return updatedUser;
  });
}
```

**`src/main/ipc/index.ts`에서 통합**:
```typescript
import { ipcGetUser } from './ipcGetUser';
import { ipcPostUser } from './ipcPostUser';
import { ipcUpdateUser } from './ipcUpdateUser';
import { ipcDeleteUser } from './ipcDeleteUser';
import { ipcGetFile } from './ipcGetFile';
import { ipcPostFile } from './ipcPostFile';
import { ipcDeleteFile } from './ipcDeleteFile';

export function setupIpcHandlers() {
  ipcGetUser();
  ipcPostUser();
  ipcUpdateUser();
  ipcDeleteUser();
  ipcGetFile();
  ipcPostFile();
  ipcDeleteFile();
}
```

### 에러 처리

**Main Process에서 에러 던지기**:
```typescript
ipcMain.handle('risky-operation', async () => {
  try {
    return await performOperation();
  } catch (error) {
    // 에러는 자동으로 Renderer로 전달됩니다
    throw new Error(`작업 실패: ${error.message}`);
  }
});
```

**Renderer에서 에러 처리**:
```typescript
try {
  await window.electron.riskyOperation();
} catch (error) {
  if (error instanceof Error) {
    console.error('에러:', error.message);
  }
}
```

### 타임아웃 설정

복잡한 작업의 경우 타임아웃을 설정할 수 있습니다.

**Preload에서 타임아웃 래퍼**:
```typescript
const withTimeout = <T>(promise: Promise<T>, timeout: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error('타임아웃')), timeout)
    ),
  ]);
};

contextBridge.exposeInMainWorld('electron', {
  longRunningTask: () => 
    withTimeout(ipcRenderer.invoke('long-task'), 5000),
});
```

---

## 주의사항

### 1. 보안

- ✅ **항상 사용**: `contextIsolation: true`, `nodeIntegration: false`
- ✅ **항상 사용**: `contextBridge`를 통한 API 노출
- ❌ **절대 하지 말 것**: `window.require` 직접 노출
- ❌ **절대 하지 말 것**: `ipcRenderer` 전체 노출

### 2. 성능

- 무거운 작업은 Main Process에서 수행
- Renderer는 UI 업데이트에 집중
- 대용량 데이터 전송 시 스트리밍 고려

### 3. 타입 안전성

- 모든 API에 TypeScript 타입 정의 필수
- 타입 정의는 `src/renderer/types/electron.d.ts`에 중앙 관리

### 4. 개발 환경

- Preload 스크립트 변경 시 개발 서버 재시작 필요
- `out/src/preload/index.js`가 최신인지 확인

### 5. 디버깅

- Main Process: `console.log()` 사용
- Renderer: 브라우저 DevTools 사용
- Preload: `console.log()` 사용 (Renderer DevTools에서 확인 가능)

---

## 체크리스트

새로운 IPC 통신을 추가할 때 다음을 확인하세요:

- [ ] `src/main/ipc/ipc<행위><대상>.ts` 파일 생성 (파일명 규칙 준수)
- [ ] `ipc<행위><대상>()` 함수 작성 (함수명은 파일명과 동일)
- [ ] `src/main/ipc/index.ts`에 함수 호출 추가
- [ ] `src/preload/index.ts`에 API 노출
- [ ] `src/renderer/types/electron.d.ts`에 타입 정의
- [ ] Renderer에서 사용 코드 작성
- [ ] 에러 처리 구현
- [ ] 개발 서버 재시작하여 테스트

---

## 참고 자료

- [Electron IPC 공식 문서](https://www.electronjs.org/docs/latest/tutorial/ipc)
- [Context Isolation 가이드](https://www.electronjs.org/docs/latest/tutorial/context-isolation)
- [보안 가이드](https://www.electronjs.org/docs/latest/tutorial/security)

---

**작성일**: 2024년
**프로젝트**: electron-template
