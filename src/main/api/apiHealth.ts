import { ipcMain } from 'electron';

import type { HealthDto } from '@app-types/dto.types';
import type { ResponseType } from '@app-types/response.types';

import { apiClient } from './clients';

/**
 * @description Health 상태 조회. Hono GET /health. ResponseType<HealthDto> 전체를 그대로 반환.
 */
export async function apiGetHealth() {
  const response = await apiClient.get<ResponseType<HealthDto>>('/health');

  return response.data;
}

/**
 * @description Health API IPC 핸들러 등록. 채널: api:get-health
 */
export function ipcGetHealth() {
  ipcMain.handle('api:get-health', async () => {
    return await apiGetHealth();
  });
}
