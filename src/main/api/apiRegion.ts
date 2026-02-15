import { ipcMain } from 'electron';

import type { ListResponseType, ResponseType } from '@app-types/response.types';
import type { RegionVo } from '@app-types/vo.types';

import { apiClient } from './clients';

/**
 * @description 지역 목록 조회. Hono GET /regions?prjNo= 필수.
 * @param prjNo - 프로젝트 번호
 * @param params - 페이징 및 검색 파라미터
 */
export async function apiGetRegionList(prjNo: number, params?: { page?: number; pageSize?: number; searchKeyword?: string; searchType?: string }) {
  const response = await apiClient.get<ListResponseType<RegionVo>>(
    '/regions',
    { params: { prjNo, ...params, }, }
  );
  return response.data;
}

/**
 * @description 지역 상세 조회. Hono GET /regions/:regionNo?prjNo=
 * @param prjNo - 프로젝트 번호
 * @param regionNo - 지역 번호
 */
export async function apiGetRegionByNo(prjNo: number, regionNo: number) {
  const response = await apiClient.get<ResponseType<RegionVo | null>>(
    `/regions/${regionNo}`,
    { params: { prjNo, }, }
  );
  return response.data;
}

/**
 * @description 지역 생성. Hono POST /regions. body에 prjNo 포함.
 * @param prjNo - 프로젝트 번호
 * @param body - 생성할 지역 정보
 */
export async function apiPostRegion(prjNo: number, body: Partial<RegionVo>) {
  const response = await apiClient.post<ResponseType<RegionVo>>(
    '/regions',
    { ...body, prjNo, }
  );
  return response.data;
}

/**
 * @description 지역 수정. Hono PATCH /regions/:regionNo.
 * @param prjNo - 프로젝트 번호
 * @param regionNo - 지역 번호
 * @param body - 수정할 지역 정보
 */
export async function apiPatchRegion(prjNo: number, regionNo: number, body: Partial<RegionVo>) {
  const response = await apiClient.patch<ResponseType<RegionVo | null>>(
    `/regions/${regionNo}`,
    body,
    { params: { prjNo, }, }
  );
  return response.data;
}

/**
 * @description 지역 삭제. Hono DELETE /regions/:regionNo.
 * @param prjNo - 프로젝트 번호
 * @param regionNo - 지역 번호
 */
export async function apiDeleteRegion(prjNo: number, regionNo: number) {
  const response = await apiClient.delete<ResponseType<{ deleted: boolean }>>(
    `/regions/${regionNo}`,
    { params: { prjNo, }, }
  );
  return response.data;
}

/**
 * @description 지역 API IPC 핸들러 등록.
 */
export function ipcGetRegion() {
  ipcMain.handle(
    'api:get-region-list',
    async (_, payload: { prjNo: number; params?: Parameters<typeof apiGetRegionList>[1] }) => {
      const { prjNo, params, } = payload;
      return await apiGetRegionList(prjNo, params);
    }
  );
  ipcMain.handle(
    'api:get-region',
    async (_, payload: { prjNo: number; regionNo: number }) => {
      const { prjNo, regionNo, } = payload;
      return await apiGetRegionByNo(prjNo, regionNo);
    }
  );
  ipcMain.handle(
    'api:post-region',
    async (_, payload: { prjNo: number; body: Partial<RegionVo> }) => {
      const { prjNo, body, } = payload;
      return await apiPostRegion(prjNo, body);
    }
  );
  ipcMain.handle(
    'api:patch-region',
    async (_, payload: { prjNo: number; regionNo: number; body: Partial<RegionVo> }) => {
      const { prjNo, regionNo, body, } = payload;
      return await apiPatchRegion(prjNo, regionNo, body);
    }
  );
  ipcMain.handle(
    'api:delete-region',
    async (_, payload: { prjNo: number; regionNo: number }) => {
      const { prjNo, regionNo, } = payload;
      return await apiDeleteRegion(prjNo, regionNo);
    }
  );
}
