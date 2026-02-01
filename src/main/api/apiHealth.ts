import { ipcMain } from 'electron';

import type { HealthDto } from '@app-types/dto.types';
import type { ResponseType } from '@app-types/response.types';

import { apiClient } from './clients';

/**
 * Health 상태 조회 API 함수.
 * Hono /health 는 ResponseType<HealthDto> 로 200 반환. ResponseType 전체를 그대로 반환.
 */
export async function apiGetHealth(): Promise<ResponseType<HealthDto>> {
  const response = await apiClient.get<ResponseType<HealthDto>>('/health');

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
