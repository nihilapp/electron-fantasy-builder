import { ipcMain } from 'electron';

import type { ListResponseType, ResponseType } from '@app-types/response.types';
import type { CoreRuleVo, SearchVo } from '@app-types/vo.types';

import { apiClient } from './clients';

/**
 * @description 코어 설정 목록 조회. Hono GET /core-rules?prjNo= 필수.
 * @param prjNo 프로젝트 번호
 * @param params 페이징·검색 조건 (선택)
 */
export async function apiGetCoreRuleList(
  prjNo: number,
  params?: SearchVo
) {
  const response = await apiClient.get<ListResponseType<CoreRuleVo>>(
    '/core-rules',
    {
      params: { prjNo, ...params, },
    }
  );

  return response.data;
}

/**
 * @description 코어 설정 생성. Hono POST /core-rules. body에 prjNo 포함.
 * @param prjNo 프로젝트 번호
 * @param body 생성할 코어 설정 VO (prjNo 포함 권장)
 */
export async function apiPostCoreRule(
  prjNo: number,
  body: Partial<CoreRuleVo>
) {
  const response = await apiClient.post<ResponseType<CoreRuleVo>>(
    '/core-rules',
    { ...body, prjNo, }
  );

  return response.data;
}

/**
 * @description 코어 설정 API IPC 핸들러 등록. 채널: api:get-core-rule-list, api:post-core-rule
 */
export function ipcGetCoreRule() {
  ipcMain.handle(
    'api:get-core-rule-list',
    async (
      _,
      payload: { prjNo: number; params?: Parameters<typeof apiGetCoreRuleList>[1] }
    ) => {
      const { prjNo, params, } = payload;
      return await apiGetCoreRuleList(prjNo, params);
    }
  );

  ipcMain.handle(
    'api:post-core-rule',
    async (
      _,
      payload: { prjNo: number; body: Partial<CoreRuleVo> }
    ) => {
      const { prjNo, body, } = payload;
      return await apiPostCoreRule(prjNo, body);
    }
  );
}
