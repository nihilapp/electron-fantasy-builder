import { contextBridge, ipcRenderer } from 'electron';

import type { AbilityVo, ProjectVo, TraitVo } from '@app-types/vo.types';

/** 목록 조회 공통 파라미터 (페이징·검색) */
type ListParams = {
  page?: number;
  pageSize?: number;
  searchKeyword?: string;
  searchType?: string;
};

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  /**
   * IPC 통신 함수들 (설정 조회, ping 등).
   */
  ipc: {
    ping: () => ipcRenderer.invoke('ipc:ping'),
    getHonoBaseUrl: () => ipcRenderer.invoke('hono:get-base-url') as Promise<string>,
    getDbMode: () => ipcRenderer.invoke('ipc:get-db-mode') as Promise<'local' | 'remote'>,
    windowMinimize: () => ipcRenderer.invoke('window:minimize'),
    windowMaximizeRestore: () => ipcRenderer.invoke('window:maximize-restore'),
    windowClose: () => ipcRenderer.invoke('window:close'),
  },

  /**
   * API 요청 함수들. Vue에서는 window.electron.api 로 접근.
   * 모든 API는 ResponseType/ListResponseType 구조로 반환.
   */
  api: {
    getHealth: () => ipcRenderer.invoke('api:get-health'),

    // --- 프로젝트 ---
    getProjectList: (params?: ListParams) => ipcRenderer.invoke('api:get-project-list', params),
    getProjectByNo: (prjNo: number) => ipcRenderer.invoke('api:get-project-by-no', prjNo),
    postProject: (body: ProjectVo) => ipcRenderer.invoke('api:post-project', body),
    patchProject: (prjNo: number, body: Partial<ProjectVo>) =>
      ipcRenderer.invoke('api:patch-project', { prjNo, body, }),
    deleteProject: (prjNo: number) => ipcRenderer.invoke('api:delete-project', prjNo),

    // --- 트레잇 ---
    getTraitList: (params?: ListParams) => ipcRenderer.invoke('api:get-trait-list', params),
    getTraitByNo: (traitNo: number) => ipcRenderer.invoke('api:get-trait-by-no', traitNo),
    postTrait: (body: TraitVo) => ipcRenderer.invoke('api:post-trait', body),
    patchTrait: (traitNo: number, body: Partial<TraitVo>) =>
      ipcRenderer.invoke('api:patch-trait', { traitNo, body, }),
    deleteTrait: (traitNo: number) => ipcRenderer.invoke('api:delete-trait', traitNo),

    // --- 어빌리티 ---
    getAbilityList: (params?: ListParams) => ipcRenderer.invoke('api:get-ability-list', params),
    getAbilityByNo: (abilityNo: number) => ipcRenderer.invoke('api:get-ability-by-no', abilityNo),
    postAbility: (body: AbilityVo) => ipcRenderer.invoke('api:post-ability', body),
    patchAbility: (abilityNo: number, body: Partial<AbilityVo>) =>
      ipcRenderer.invoke('api:patch-ability', { abilityNo, body, }),
    deleteAbility: (abilityNo: number) => ipcRenderer.invoke('api:delete-ability', abilityNo),
  },
});

// Preload 스크립트가 로드되었는지 확인하기 위한 로그
console.log('Preload script loaded successfully');
