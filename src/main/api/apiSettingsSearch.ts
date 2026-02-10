import { ipcMain } from 'electron';

import type { ListResponseType } from '@app-types/response.types';
import type { UnifiedSettingItemVo } from '@app-types/vo.types';

import { apiClient } from './clients';

/**
 * @description 전체 설정 통합 검색. Hono GET /settings/search?prjNo=&q=&categories=&page=&pageSize=
 */
export async function apiGetSettingsSearch(
  prjNo: number,
  params?: { q?: string; categories?: string; page?: number; pageSize?: number }
) {
  const response = await apiClient.get<ListResponseType<UnifiedSettingItemVo>>(
    '/settings/search',
    { params: { prjNo, ...params, }, }
  );
  return response.data;
}

/**
 * @description 전체 설정 통합 검색 API IPC 핸들러 등록.
 */
export function ipcGetSettingsSearch() {
  ipcMain.handle(
    'api:get-settings-search',
    async (
      _,
      payload: { prjNo: number; params?: Parameters<typeof apiGetSettingsSearch>[1] }
    ) => {
      const { prjNo, params, } = payload;
      return await apiGetSettingsSearch(prjNo, params);
    }
  );
}
