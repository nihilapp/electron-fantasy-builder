import { ipcMain } from 'electron';

import type { ListResponseType, ResponseType } from '@app-types/response.types';
import type { CharacterVo } from '@app-types/vo.types';

import { apiClient } from './clients';

/**
 * @description 인물 목록 조회. Hono GET /characters?prjNo= 필수.
 * @param prjNo - 프로젝트 번호
 * @param params - 페이징 및 검색 파라미터
 */
export async function apiGetCharacterList(prjNo: number, params?: { page?: number; pageSize?: number; searchKeyword?: string; searchType?: string }) {
  const response = await apiClient.get<ListResponseType<CharacterVo>>(
    '/characters',
    { params: { prjNo, ...params, }, }
  );
  return response.data;
}

/**
 * @description 인물 상세 조회. Hono GET /characters/:charNo?prjNo=
 * @param prjNo - 프로젝트 번호
 * @param charNo - 인물 번호
 */
export async function apiGetCharacterByNo(prjNo: number, charNo: number) {
  const response = await apiClient.get<ResponseType<CharacterVo | null>>(
    `/characters/${charNo}`,
    { params: { prjNo, }, }
  );
  return response.data;
}

/**
 * @description 인물 생성. Hono POST /characters. body에 prjNo 포함.
 * @param prjNo - 프로젝트 번호
 * @param body - 생성할 인물 정보
 */
export async function apiPostCharacter(prjNo: number, body: Partial<CharacterVo>) {
  const response = await apiClient.post<ResponseType<CharacterVo>>(
    '/characters',
    { ...body, prjNo, }
  );
  return response.data;
}

/**
 * @description 인물 수정. Hono PATCH /characters/:charNo.
 * @param prjNo - 프로젝트 번호
 * @param charNo - 인물 번호
 * @param body - 수정할 인물 정보
 */
export async function apiPatchCharacter(prjNo: number, charNo: number, body: Partial<CharacterVo>) {
  const response = await apiClient.patch<ResponseType<CharacterVo | null>>(
    `/characters/${charNo}`,
    body,
    { params: { prjNo, }, }
  );
  return response.data;
}

/**
 * @description 인물 삭제. Hono DELETE /characters/:charNo.
 * @param prjNo - 프로젝트 번호
 * @param charNo - 인물 번호
 */
export async function apiDeleteCharacter(prjNo: number, charNo: number) {
  const response = await apiClient.delete<ResponseType<{ deleted: boolean }>>(
    `/characters/${charNo}`,
    { params: { prjNo, }, }
  );
  return response.data;
}

/**
 * @description 인물 API IPC 핸들러 등록.
 */
export function ipcGetCharacter() {
  ipcMain.handle(
    'api:get-character-list',
    async (_, payload: { prjNo: number; params?: Parameters<typeof apiGetCharacterList>[1] }) => {
      const { prjNo, params, } = payload;
      return await apiGetCharacterList(prjNo, params);
    }
  );
  ipcMain.handle(
    'api:get-character',
    async (_, payload: { prjNo: number; charNo: number }) => {
      const { prjNo, charNo, } = payload;
      return await apiGetCharacterByNo(prjNo, charNo);
    }
  );
  ipcMain.handle(
    'api:post-character',
    async (_, payload: { prjNo: number; body: Partial<CharacterVo> }) => {
      const { prjNo, body, } = payload;
      return await apiPostCharacter(prjNo, body);
    }
  );
  ipcMain.handle(
    'api:patch-character',
    async (_, payload: { prjNo: number; charNo: number; body: Partial<CharacterVo> }) => {
      const { prjNo, charNo, body, } = payload;
      return await apiPatchCharacter(prjNo, charNo, body);
    }
  );
  ipcMain.handle(
    'api:delete-character',
    async (_, payload: { prjNo: number; charNo: number }) => {
      const { prjNo, charNo, } = payload;
      return await apiDeleteCharacter(prjNo, charNo);
    }
  );
}
