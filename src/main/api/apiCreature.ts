import { ipcMain } from 'electron';

import type { ListResponseType, ResponseType } from '@app-types/response.types';
import type { CreatureVo } from '@app-types/vo.types';

import { apiClient } from './clients';

/**
 * @description 생물/종족 목록 조회. Hono GET /creatures?prjNo= 필수.
 */
export async function apiGetCreatureList(prjNo: number, params?: { page?: number; pageSize?: number; searchKeyword?: string; searchType?: string }) {
  const response = await apiClient.get<ListResponseType<CreatureVo>>(
    '/creatures',
    { params: { prjNo, ...params, }, }
  );
  return response.data;
}

/**
 * @description 생물/종족 상세 조회. Hono GET /creatures/:creatureNo?prjNo=
 */
export async function apiGetCreatureByNo(prjNo: number, creatureNo: number) {
  const response = await apiClient.get<ResponseType<CreatureVo | null>>(
    `/creatures/${creatureNo}`,
    { params: { prjNo, }, }
  );
  return response.data;
}

/**
 * @description 생물/종족 생성. Hono POST /creatures. body에 prjNo 포함.
 */
export async function apiPostCreature(prjNo: number, body: Partial<CreatureVo>) {
  const response = await apiClient.post<ResponseType<CreatureVo>>(
    '/creatures',
    { ...body, prjNo, }
  );
  return response.data;
}

/**
 * @description 생물/종족 수정. Hono PATCH /creatures/:creatureNo.
 */
export async function apiPatchCreature(prjNo: number, creatureNo: number, body: Partial<CreatureVo>) {
  const response = await apiClient.patch<ResponseType<CreatureVo | null>>(
    `/creatures/${creatureNo}`,
    body,
    { params: { prjNo, }, }
  );
  return response.data;
}

/**
 * @description 생물/종족 삭제. Hono DELETE /creatures/:creatureNo.
 */
export async function apiDeleteCreature(prjNo: number, creatureNo: number) {
  const response = await apiClient.delete<ResponseType<{ deleted: boolean }>>(
    `/creatures/${creatureNo}`,
    { params: { prjNo, }, }
  );
  return response.data;
}

/**
 * @description 생물/종족 API IPC 핸들러 등록.
 */
export function ipcGetCreature() {
  ipcMain.handle(
    'api:get-creature-list',
    async (_, payload: { prjNo: number; params?: Parameters<typeof apiGetCreatureList>[1] }) => {
      const { prjNo, params, } = payload;
      return await apiGetCreatureList(prjNo, params);
    }
  );
  ipcMain.handle(
    'api:get-creature',
    async (_, payload: { prjNo: number; creatureNo: number }) => {
      const { prjNo, creatureNo, } = payload;
      return await apiGetCreatureByNo(prjNo, creatureNo);
    }
  );
  ipcMain.handle(
    'api:post-creature',
    async (_, payload: { prjNo: number; body: Partial<CreatureVo> }) => {
      const { prjNo, body, } = payload;
      return await apiPostCreature(prjNo, body);
    }
  );
  ipcMain.handle(
    'api:patch-creature',
    async (_, payload: { prjNo: number; creatureNo: number; body: Partial<CreatureVo> }) => {
      const { prjNo, creatureNo, body, } = payload;
      return await apiPatchCreature(prjNo, creatureNo, body);
    }
  );
  ipcMain.handle(
    'api:delete-creature',
    async (_, payload: { prjNo: number; creatureNo: number }) => {
      const { prjNo, creatureNo, } = payload;
      return await apiDeleteCreature(prjNo, creatureNo);
    }
  );
}
