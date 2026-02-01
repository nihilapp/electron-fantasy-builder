import { ipcMain } from 'electron';

import type { ListResponseType, ResponseType } from '@app-types/response.types';
import type { ProjectVo, SearchVo } from '@app-types/vo.types';

import { apiClient } from './clients';

/** 프로젝트 목록 조회. Hono GET /projects → ListResponseType<ProjectVo> */
export async function apiGetProjectList(params?: SearchVo): Promise<ListResponseType<ProjectVo>> {
  const response = await apiClient.get<ListResponseType<ProjectVo>>('/projects', { params, });

  return response.data;
}

/** 프로젝트 상세 조회. Hono GET /projects/:prjNo → ResponseType<ProjectVo | null> */
export async function apiGetProjectByNo(prjNo: number): Promise<ResponseType<ProjectVo | null>> {
  const response = await apiClient.get<ResponseType<ProjectVo | null>>(`/projects/${prjNo}`);

  return response.data;
}

/** 프로젝트 생성. Hono POST /projects → ResponseType<ProjectVo> */
export async function apiPostProject(body: ProjectVo): Promise<ResponseType<ProjectVo>> {
  const response = await apiClient.post<ResponseType<ProjectVo>>('/projects', body);

  return response.data;
}

/** 프로젝트 수정. Hono PATCH /projects/:prjNo → ResponseType<ProjectVo | null> */
export async function apiPatchProject(
  prjNo: number,
  body: Partial<ProjectVo>
): Promise<ResponseType<ProjectVo | null>> {
  const response = await apiClient.patch<ResponseType<ProjectVo | null>>(`/projects/${prjNo}`, body);

  return response.data;
}

/** 프로젝트 삭제. Hono DELETE /projects/:prjNo → ResponseType<{ deleted: boolean }> */
export async function apiDeleteProject(
  prjNo: number
): Promise<ResponseType<{ deleted: boolean }>> {
  const response = await apiClient.delete<ResponseType<{ deleted: boolean }>>(`/projects/${prjNo}`);

  return response.data;
}

/**
 * 프로젝트 API IPC 핸들러 등록.
 * 채널: api:get-project-list, api:get-project-by-no, api:post-project, api:patch-project, api:delete-project
 */
export function ipcGetProject() {
  ipcMain.handle('api:get-project-list', async (_, params?: Parameters<typeof apiGetProjectList>[0]) => {
    return await apiGetProjectList(params);
  });
  ipcMain.handle('api:get-project-by-no', async (_, prjNo: number) => {
    return await apiGetProjectByNo(prjNo);
  });
  ipcMain.handle('api:post-project', async (_, body: ProjectVo) => {
    return await apiPostProject(body);
  });
  ipcMain.handle('api:patch-project', async (_, { prjNo, body, }: { prjNo: number; body: Partial<ProjectVo> }) => {
    return await apiPatchProject(prjNo, body);
  });
  ipcMain.handle('api:delete-project', async (_, prjNo: number) => {
    return await apiDeleteProject(prjNo);
  });
}
