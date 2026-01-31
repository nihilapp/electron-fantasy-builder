import { contextBridge, ipcRenderer } from 'electron';

import type { HealthDto } from '@main/api';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  /**
   * IPC 통신 함수들 (설정 조회, ping 등).
   */
  ipc: {
    /**
     * ping을 보내고 pong 응답을 받습니다.
     * @returns Promise<string> 'pong' 문자열을 반환합니다.
     */
    ping: () => ipcRenderer.invoke('ipc:ping'),
    /**
     * Hono 서버 base URL (설정 조회). 실제 /health 등 호출은 honoClient에서 fetch로.
     * @returns 예: http://localhost:3456
     */
    getHonoBaseUrl: () => ipcRenderer.invoke('hono:get-base-url') as Promise<string>,
    /**
     * DB 모드 조회 (참고용). config/app.json의 db.mode.
     * @returns 'local' | 'remote'
     */
    getDbMode: () => ipcRenderer.invoke('ipc:get-db-mode') as Promise<'local' | 'remote'>,
  },

  /**
   * API 요청 함수들. Vue에서는 API 호출 시 반드시 window.electron.api 로 접근합니다.
   */
  api: {
    /**
     * Health 상태 조회
     * @returns { status, timestamp }
     */
    getHealth: (): Promise<HealthDto> => ipcRenderer.invoke('api:get-health'),
    /**
     * Example 목록 조회
     * @returns Example DTO 목록
     */
    getExample: () => ipcRenderer.invoke('api:get-example'),
  },
});

// Preload 스크립트가 로드되었는지 확인하기 위한 로그
console.log('Preload script loaded successfully');
