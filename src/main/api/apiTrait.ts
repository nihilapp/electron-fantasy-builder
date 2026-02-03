import { ipcMain } from 'electron';

import type { ListResponseType, ResponseType } from '@app-types/response.types';
import type { TraitVo, SearchVo } from '@app-types/vo.types';

import { apiClient } from './clients';

/**
 * @description 트레잇 목록 조회. Hono GET /traits.
 * @param params 검색·페이징 조건 (선택)
 */
export async function apiGetTraitList(params?: SearchVo) {
  const response = await apiClient.get<ListResponseType<TraitVo>>('/traits', {
    params,
  });

  return response.data;
}

/**
 * @description 트레잇 상세 조회. Hono GET /traits/:traitNo.
 * @param traitNo 트레잇 번호
 */
export async function apiGetTraitByNo(traitNo: number) {
  const response = await apiClient.get<ResponseType<TraitVo | null>>(
    `/traits/${traitNo}`
  );

  return response.data;
}

/**
 * @description 트레잇 생성. Hono POST /traits.
 * @param body 생성할 트레잇 VO
 */
export async function apiPostTrait(body: TraitVo) {
  const response = await apiClient.post<ResponseType<TraitVo>>(
    '/traits',
    body
  );

  return response.data;
}

/**
 * @description 트레잇 수정. Hono PATCH /traits/:traitNo.
 * @param traitNo 트레잇 번호
 * @param body 수정할 필드 (부분)
 */
export async function apiPatchTrait(
  traitNo: number,
  body: Partial<TraitVo>
) {
  const response = await apiClient.patch<ResponseType<TraitVo | null>>(
    `/traits/${traitNo}`,
    body
  );

  return response.data;
}

/**
 * @description 트레잇 삭제. Hono DELETE /traits/:traitNo.
 * @param traitNo 트레잇 번호
 */
export async function apiDeleteTrait(traitNo: number) {
  const response = await apiClient.delete<ResponseType<{ deleted: boolean }>>(
    `/traits/${traitNo}`
  );

  return response.data;
}

/**
 * @description 트레잇 API IPC 핸들러 등록. 채널: api:get-trait-list, api:get-trait-by-no, api:post-trait, api:patch-trait, api:delete-trait
 */
export function ipcGetTrait() {
  ipcMain.handle(
    'api:get-trait-list',
    async (_, params?: Parameters<typeof apiGetTraitList>[0]) => {
      return await apiGetTraitList(params);
    }
  );

  ipcMain.handle('api:get-trait-by-no', async (_, traitNo: number) => {
    return await apiGetTraitByNo(traitNo);
  });

  ipcMain.handle('api:post-trait', async (_, body: TraitVo) => {
    return await apiPostTrait(body);
  });

  ipcMain.handle(
    'api:patch-trait',
    async (
      _,
      { traitNo, body, }: { traitNo: number; body: Partial<TraitVo> }
    ) => {
      return await apiPatchTrait(
        traitNo,
        body
      );
    }
  );

  ipcMain.handle('api:delete-trait', async (_, traitNo: number) => {
    return await apiDeleteTrait(traitNo);
  });
}
