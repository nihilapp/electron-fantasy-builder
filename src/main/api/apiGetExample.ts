import type { ExampleDto } from '@app-types/dto';
import type { ListResponseType } from '@app-types/response.types';
import { ipcMain } from 'electron';

import { apiClient } from './clients';

/**
 * Example 목록 조회 API 함수.
 * Hono /example 은 ListResponseType<ExampleDto> 로 200 반환. ResponseType 전체를 그대로 반환.
 */
export async function apiGetExample(): Promise<ListResponseType<ExampleDto>> {
  const response = await apiClient.get<ListResponseType<ExampleDto>>('/example');

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
