import { ipcMain } from 'electron';

import type { ListResponseType, ResponseType } from '@app-types/response.types';
import type { ProjectTraitVo, SearchVo } from '@app-types/vo.types';

import { apiClient } from './clients';

/**
 * @description 프로젝트 종속 특성 목록 조회. Hono GET /project-traits?prjNo=.
 * @param prjNo 프로젝트 번호
 * @param params 검색·페이징 조건 (선택)
 */
export async function apiGetProjectTraitList(
  prjNo: number,
  params?: SearchVo
) {
  const response = await apiClient.get<ListResponseType<ProjectTraitVo>>(
    '/project-traits',
    {
      params: {
        prjNo,
        ...params,
      },
    }
  );

  return response.data;
}

/**
 * @description 프로젝트 종속 특성 상세 조회. Hono GET /project-traits/:traitNo?prjNo=.
 * @param prjNo 프로젝트 번호
 * @param traitNo 특성 번호
 */
export async function apiGetProjectTraitByNo(
  prjNo: number,
  traitNo: number
) {
  const response = await apiClient.get<ResponseType<ProjectTraitVo | null>>(
    `/project-traits/${traitNo}`,
    {
      params: {
        prjNo,
      },
    }
  );

  return response.data;
}

/**
 * @description 프로젝트 종속 특성 생성. Hono POST /project-traits.
 * @param body 생성할 프로젝트 특성 VO
 */
export async function apiPostProjectTrait(body: ProjectTraitVo) {
  const response = await apiClient.post<ResponseType<ProjectTraitVo>>(
    '/project-traits',
    body
  );

  return response.data;
}

/**
 * @description 프로젝트 종속 특성 수정. Hono PATCH /project-traits/:traitNo.
 * @param prjNo 프로젝트 번호
 * @param traitNo 특성 번호
 * @param body 수정할 필드
 */
export async function apiPatchProjectTrait(
  prjNo: number,
  traitNo: number,
  body: Partial<ProjectTraitVo>
) {
  const response = await apiClient.patch<ResponseType<ProjectTraitVo | null>>(
    `/project-traits/${traitNo}`,
    body,
    {
      params: {
        prjNo,
      },
    }
  );

  return response.data;
}

/**
 * @description 프로젝트 종속 특성 삭제. Hono DELETE /project-traits/:traitNo.
 * @param prjNo 프로젝트 번호
 * @param traitNo 특성 번호
 */
export async function apiDeleteProjectTrait(
  prjNo: number,
  traitNo: number
) {
  const response = await apiClient.delete<ResponseType<{ deleted: boolean }>>(
    `/project-traits/${traitNo}`,
    {
      params: {
        prjNo,
      },
    }
  );

  return response.data;
}

/**
 * @description 프로젝트 종속 특성 API IPC 핸들러 등록.
 */
export function ipcGetProjectTrait() {
  ipcMain.handle(
    'api:get-project-trait-list',
    async (
      _,
      payload: { prjNo: number; params?: SearchVo }
    ) => {
      const {
        prjNo,
        params,
      } = payload;

      return await apiGetProjectTraitList(prjNo, params);
    }
  );

  ipcMain.handle(
    'api:get-project-trait-by-no',
    async (
      _,
      payload: { prjNo: number; traitNo: number }
    ) => {
      const {
        prjNo,
        traitNo,
      } = payload;

      return await apiGetProjectTraitByNo(prjNo, traitNo);
    }
  );

  ipcMain.handle(
    'api:post-project-trait',
    async (
      _,
      body: ProjectTraitVo
    ) => {
      return await apiPostProjectTrait(body);
    }
  );

  ipcMain.handle(
    'api:patch-project-trait',
    async (
      _,
      payload: { prjNo: number; traitNo: number; body: Partial<ProjectTraitVo> }
    ) => {
      const {
        prjNo,
        traitNo,
        body,
      } = payload;

      return await apiPatchProjectTrait(
        prjNo,
        traitNo,
        body
      );
    }
  );

  ipcMain.handle(
    'api:delete-project-trait',
    async (
      _,
      payload: { prjNo: number; traitNo: number }
    ) => {
      const {
        prjNo,
        traitNo,
      } = payload;

      return await apiDeleteProjectTrait(prjNo, traitNo);
    }
  );
}
