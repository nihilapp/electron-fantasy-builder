import { ipcMain } from 'electron';

import type { ListResponseType, ResponseType } from '@app-types/response.types';
import type { ProjectAbilityVo, SearchVo } from '@app-types/vo.types';

import { apiClient } from './clients';

/**
 * @description 프로젝트 종속 어빌리티 목록 조회. Hono GET /project-abilities?prjNo=.
 */
export async function apiGetProjectAbilityList(
  prjNo: number,
  params?: SearchVo
) {
  const response = await apiClient.get<ListResponseType<ProjectAbilityVo>>(
    '/project-abilities',
    {
      params: {
        prjNo,
        ...params,
      },
    }
  );

  return response.data;
}

export async function apiGetProjectAbilityByNo(
  prjNo: number,
  abilityNo: number
) {
  const response = await apiClient.get<ResponseType<ProjectAbilityVo | null>>(
    `/project-abilities/${abilityNo}`,
    {
      params: {
        prjNo,
      },
    }
  );

  return response.data;
}

export async function apiPostProjectAbility(body: ProjectAbilityVo) {
  const response = await apiClient.post<ResponseType<ProjectAbilityVo>>(
    '/project-abilities',
    body
  );

  return response.data;
}

export async function apiPatchProjectAbility(
  prjNo: number,
  abilityNo: number,
  body: Partial<ProjectAbilityVo>
) {
  const response = await apiClient.patch<ResponseType<ProjectAbilityVo | null>>(
    `/project-abilities/${abilityNo}`,
    body,
    {
      params: {
        prjNo,
      },
    }
  );

  return response.data;
}

export async function apiDeleteProjectAbility(
  prjNo: number,
  abilityNo: number
) {
  const response = await apiClient.delete<ResponseType<{ deleted: boolean }>>(
    `/project-abilities/${abilityNo}`,
    {
      params: {
        prjNo,
      },
    }
  );

  return response.data;
}

/**
 * @description 프로젝트 종속 어빌리티 API IPC 핸들러 등록.
 */
export function ipcGetProjectAbility() {
  ipcMain.handle(
    'api:get-project-ability-list',
    async (
      _,
      payload: { prjNo: number; params?: SearchVo }
    ) => {
      const {
        prjNo,
        params,
      } = payload;

      return await apiGetProjectAbilityList(prjNo, params);
    }
  );

  ipcMain.handle(
    'api:get-project-ability-by-no',
    async (
      _,
      payload: { prjNo: number; abilityNo: number }
    ) => {
      const {
        prjNo,
        abilityNo,
      } = payload;

      return await apiGetProjectAbilityByNo(prjNo, abilityNo);
    }
  );

  ipcMain.handle(
    'api:post-project-ability',
    async (
      _,
      body: ProjectAbilityVo
    ) => {
      return await apiPostProjectAbility(body);
    }
  );

  ipcMain.handle(
    'api:patch-project-ability',
    async (
      _,
      payload: { prjNo: number; abilityNo: number; body: Partial<ProjectAbilityVo> }
    ) => {
      const {
        prjNo,
        abilityNo,
        body,
      } = payload;

      return await apiPatchProjectAbility(
        prjNo,
        abilityNo,
        body
      );
    }
  );

  ipcMain.handle(
    'api:delete-project-ability',
    async (
      _,
      payload: { prjNo: number; abilityNo: number }
    ) => {
      const {
        prjNo,
        abilityNo,
      } = payload;

      return await apiDeleteProjectAbility(prjNo, abilityNo);
    }
  );
}
