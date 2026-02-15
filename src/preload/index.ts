import { contextBridge, ipcRenderer } from 'electron';

import type { AbilityVo, CharacterVo, CoreRuleVo, CreatureVo, ProjectAbilityVo, ProjectTraitVo, ProjectVo, RegionVo, TraitVo } from '@app-types/vo.types';

/**
 * @description 목록 조회 공통 파라미터 (페이징·검색). renderer electron.d.ts의 ListParams와 동일.
 */
type ListParams = {
  page?: number;
  pageSize?: number;
  searchKeyword?: string;
  searchType?: string;
};

/**
 * @description contextBridge로 렌더러에 노출할 API. ipcRenderer를 직접 노출하지 않고, 허용된 채널만 invoke.
 */
contextBridge.exposeInMainWorld('electron', {
  /**
   * @description IPC 통신 (설정 조회, ping, 창 제어). 엔드포인트 통신은 api 사용.
   */
  ipc: {
    ping: () => ipcRenderer.invoke('ipc:ping'),
    getHonoBaseUrl: () => (
      ipcRenderer.invoke('hono:get-base-url') as Promise<string>
    ),
    getDbMode: () => (
      ipcRenderer.invoke('ipc:get-db-mode') as Promise<'local' | 'remote'>
    ),
    windowMinimize: () => ipcRenderer.invoke('window:minimize'),
    windowMaximizeRestore: () => ipcRenderer.invoke('window:maximize-restore'),
    windowClose: () => ipcRenderer.invoke('window:close'),
  },

  /**
   * @description API 요청. Vue에서는 window.electron.api로 접근. 모든 API는 ResponseType/ListResponseType 구조로 반환.
   */
  api: {
    getHealth: () => ipcRenderer.invoke('api:get-health'),

    getProjectList: (params?: ListParams) => (
      ipcRenderer.invoke('api:get-project-list', params)
    ),
    getProjectByNo: (prjNo: number) => (
      ipcRenderer.invoke('api:get-project-by-no', prjNo)
    ),
    postProject: (body: ProjectVo) => (
      ipcRenderer.invoke('api:post-project', body)
    ),
    patchProject: (prjNo: number, body: Partial<ProjectVo>) => (
      ipcRenderer.invoke('api:patch-project', { prjNo, body, })
    ),
    deleteProject: (prjNo: number) => (
      ipcRenderer.invoke('api:delete-project', prjNo)
    ),

    getTraitList: (params?: ListParams) => (
      ipcRenderer.invoke('api:get-trait-list', params)
    ),
    getTraitByNo: (traitNo: number) => (
      ipcRenderer.invoke('api:get-trait-by-no', traitNo)
    ),
    postTrait: (body: TraitVo) => (
      ipcRenderer.invoke('api:post-trait', body)
    ),
    patchTrait: (traitNo: number, body: Partial<TraitVo>) => (
      ipcRenderer.invoke('api:patch-trait', { traitNo, body, })
    ),
    deleteTrait: (traitNo: number) => (
      ipcRenderer.invoke('api:delete-trait', traitNo)
    ),

    getAbilityList: (params?: ListParams) => (
      ipcRenderer.invoke('api:get-ability-list', params)
    ),
    getAbilityByNo: (abilityNo: number) => (
      ipcRenderer.invoke('api:get-ability-by-no', abilityNo)
    ),
    postAbility: (body: AbilityVo) => (
      ipcRenderer.invoke('api:post-ability', body)
    ),
    patchAbility: (abilityNo: number, body: Partial<AbilityVo>) => (
      ipcRenderer.invoke('api:patch-ability', { abilityNo, body, })
    ),
    deleteAbility: (abilityNo: number) => (
      ipcRenderer.invoke('api:delete-ability', abilityNo)
    ),

    getCoreRuleList: (prjNo: number, params?: ListParams) => (
      ipcRenderer.invoke('api:get-core-rule-list', { prjNo, params, })
    ),
    getCoreRule: (prjNo: number, coreNo: number) => (
      ipcRenderer.invoke('api:get-core-rule', { prjNo, coreNo, })
    ),
    postCoreRule: (prjNo: number, body: Partial<CoreRuleVo>) => (
      ipcRenderer.invoke('api:post-core-rule', { prjNo, body, })
    ),
    patchCoreRule: (prjNo: number, coreNo: number, body: Partial<CoreRuleVo>) => (
      ipcRenderer.invoke('api:patch-core-rule', { prjNo, coreNo, body, })
    ),
    deleteCoreRule: (prjNo: number, coreNo: number) => (
      ipcRenderer.invoke('api:delete-core-rule', { prjNo, coreNo, })
    ),

    getCreatureList: (prjNo: number, params?: ListParams) => (
      ipcRenderer.invoke('api:get-creature-list', { prjNo, params, })
    ),
    getCreature: (prjNo: number, creatureNo: number) => (
      ipcRenderer.invoke('api:get-creature', { prjNo, creatureNo, })
    ),
    postCreature: (prjNo: number, body: Partial<CreatureVo>) => (
      ipcRenderer.invoke('api:post-creature', { prjNo, body, })
    ),
    patchCreature: (prjNo: number, creatureNo: number, body: Partial<CreatureVo>) => (
      ipcRenderer.invoke('api:patch-creature', { prjNo, creatureNo, body, })
    ),
    deleteCreature: (prjNo: number, creatureNo: number) => (
      ipcRenderer.invoke('api:delete-creature', { prjNo, creatureNo, })
    ),

    getCharacterList: (prjNo: number, params?: ListParams) => (
      ipcRenderer.invoke('api:get-character-list', { prjNo, params, })
    ),
    getCharacter: (prjNo: number, charNo: number) => (
      ipcRenderer.invoke('api:get-character', { prjNo, charNo, })
    ),
    postCharacter: (prjNo: number, body: Partial<CharacterVo>) => (
      ipcRenderer.invoke('api:post-character', { prjNo, body, })
    ),
    patchCharacter: (prjNo: number, charNo: number, body: Partial<CharacterVo>) => (
      ipcRenderer.invoke('api:patch-character', { prjNo, charNo, body, })
    ),
    deleteCharacter: (prjNo: number, charNo: number) => (
      ipcRenderer.invoke('api:delete-character', { prjNo, charNo, })
    ),

    getRegionList: (prjNo: number, params?: ListParams) => (
      ipcRenderer.invoke('api:get-region-list', { prjNo, params, })
    ),
    getRegion: (prjNo: number, regionNo: number) => (
      ipcRenderer.invoke('api:get-region', { prjNo, regionNo, })
    ),
    postRegion: (prjNo: number, body: Partial<RegionVo>) => (
      ipcRenderer.invoke('api:post-region', { prjNo, body, })
    ),
    patchRegion: (prjNo: number, regionNo: number, body: Partial<RegionVo>) => (
      ipcRenderer.invoke('api:patch-region', { prjNo, regionNo, body, })
    ),
    deleteRegion: (prjNo: number, regionNo: number) => (
      ipcRenderer.invoke('api:delete-region', { prjNo, regionNo, })
    ),

    getProjectTraitList: (prjNo: number, params?: ListParams) => (
      ipcRenderer.invoke('api:get-project-trait-list', { prjNo, params, })
    ),
    getProjectTraitByNo: (prjNo: number, traitNo: number) => (
      ipcRenderer.invoke('api:get-project-trait-by-no', { prjNo, traitNo, })
    ),
    postProjectTrait: (body: ProjectTraitVo) => (
      ipcRenderer.invoke('api:post-project-trait', body)
    ),
    patchProjectTrait: (prjNo: number, traitNo: number, body: Partial<ProjectTraitVo>) => (
      ipcRenderer.invoke('api:patch-project-trait', { prjNo, traitNo, body, })
    ),
    deleteProjectTrait: (prjNo: number, traitNo: number) => (
      ipcRenderer.invoke('api:delete-project-trait', { prjNo, traitNo, })
    ),

    getProjectAbilityList: (prjNo: number, params?: ListParams) => (
      ipcRenderer.invoke('api:get-project-ability-list', { prjNo, params, })
    ),
    getProjectAbilityByNo: (prjNo: number, abilityNo: number) => (
      ipcRenderer.invoke('api:get-project-ability-by-no', { prjNo, abilityNo, })
    ),
    postProjectAbility: (body: ProjectAbilityVo) => (
      ipcRenderer.invoke('api:post-project-ability', body)
    ),
    patchProjectAbility: (prjNo: number, abilityNo: number, body: Partial<ProjectAbilityVo>) => (
      ipcRenderer.invoke('api:patch-project-ability', { prjNo, abilityNo, body, })
    ),
    deleteProjectAbility: (prjNo: number, abilityNo: number) => (
      ipcRenderer.invoke('api:delete-project-ability', { prjNo, abilityNo, })
    ),

    getSettingsSearch: (prjNo: number, params?: { q?: string; categories?: string; page?: number; pageSize?: number }) => (
      ipcRenderer.invoke('api:get-settings-search', { prjNo, params, })
    ),
  },
});
