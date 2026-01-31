import { ipcMain } from 'electron';

import type { ExampleDto } from '@/types/dto';

import { apiClient } from './clients';

/**
 * Example 목록 조회 API 함수
 * Hono /example 엔드포인트를 axios(apiClient)로 호출합니다.
 * @returns Example DTO 목록
 */
export async function apiGetExample(): Promise<ExampleDto[]> {
  const response = await apiClient.get<ExampleDto[]>('/example');
  return response.data;
}

/**
 * IPC 핸들러 등록
 * 함수명 규칙: ipc<행위><대상> (IPC 핸들러 등록용)
 */
export function ipcGetExample() {
  ipcMain.handle('api:get-example', async () => {
    return await apiGetExample();
  });
}
