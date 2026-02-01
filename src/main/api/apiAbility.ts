import { ipcMain } from 'electron';

import type { ListResponseType, ResponseType } from '@app-types/response.types';
import type { AbilityVo, SearchVo } from '@app-types/vo.types';

import { apiClient } from './clients';

/** 어빌리티 목록 조회. Hono GET /abilities → ListResponseType<AbilityVo> */
export async function apiGetAbilityList(params?: SearchVo): Promise<ListResponseType<AbilityVo>> {
  const response = await apiClient.get<ListResponseType<AbilityVo>>('/abilities', { params, });

  return response.data;
}

/** 어빌리티 상세 조회. Hono GET /abilities/:abilityNo → ResponseType<AbilityVo | null> */
export async function apiGetAbilityByNo(
  abilityNo: number
): Promise<ResponseType<AbilityVo | null>> {
  const response = await apiClient.get<ResponseType<AbilityVo | null>>(`/abilities/${abilityNo}`);

  return response.data;
}

/** 어빌리티 생성. Hono POST /abilities → ResponseType<AbilityVo> */
export async function apiPostAbility(body: AbilityVo): Promise<ResponseType<AbilityVo>> {
  const response = await apiClient.post<ResponseType<AbilityVo>>('/abilities', body);

  return response.data;
}

/** 어빌리티 수정. Hono PATCH /abilities/:abilityNo → ResponseType<AbilityVo | null> */
export async function apiPatchAbility(
  abilityNo: number,
  body: Partial<AbilityVo>
): Promise<ResponseType<AbilityVo | null>> {
  const response = await apiClient.patch<ResponseType<AbilityVo | null>>(
    `/abilities/${abilityNo}`,
    body
  );

  return response.data;
}

/** 어빌리티 삭제. Hono DELETE /abilities/:abilityNo → ResponseType<{ deleted: boolean }> */
export async function apiDeleteAbility(
  abilityNo: number
): Promise<ResponseType<{ deleted: boolean }>> {
  const response = await apiClient.delete<ResponseType<{ deleted: boolean }>>(
    `/abilities/${abilityNo}`
  );

  return response.data;
}

/**
 * 어빌리티 API IPC 핸들러 등록.
 * 채널: api:get-ability-list, api:get-ability-by-no, api:post-ability, api:patch-ability, api:delete-ability
 */
export function ipcGetAbility() {
  ipcMain.handle(
    'api:get-ability-list',
    async (_, params?: Parameters<typeof apiGetAbilityList>[0]) => {
      return await apiGetAbilityList(params);
    }
  );
  ipcMain.handle('api:get-ability-by-no', async (_, abilityNo: number) => {
    return await apiGetAbilityByNo(abilityNo);
  });
  ipcMain.handle('api:post-ability', async (_, body: AbilityVo) => {
    return await apiPostAbility(body);
  });
  ipcMain.handle(
    'api:patch-ability',
    async (_, { abilityNo, body, }: { abilityNo: number; body: Partial<AbilityVo> }) => {
      return await apiPatchAbility(abilityNo, body);
    }
  );
  ipcMain.handle('api:delete-ability', async (_, abilityNo: number) => {
    return await apiDeleteAbility(abilityNo);
  });
}
