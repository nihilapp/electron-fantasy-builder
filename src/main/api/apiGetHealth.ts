import { ipcMain } from 'electron';

import type { HealthDto } from '@/types/dto';

import { apiClient } from './clients';

/**
 * Health 상태 조회 API 함수
 * Hono /health 엔드포인트를 axios(apiClient)로 호출합니다.
 * @returns Health DTO
 */
export async function apiGetHealth(): Promise<HealthDto> {
  const response = await apiClient.get<HealthDto>('/health');
  return response.data;
}

/**
 * IPC 핸들러 등록
 * 함수명 규칙: ipc<행위><대상> (IPC 핸들러 등록용)
 */
export function ipcGetHealth() {
  ipcMain.handle('api:get-health', async () => {
    return await apiGetHealth();
  });
}
