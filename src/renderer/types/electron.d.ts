import type { HealthDto } from '@app-types/dto.types';
import type { ListResponseType, ResponseType } from '@app-types/response.types';
import type {
  AbilityVo,
  CoreRuleListItemVo,
  CoreRuleVo,
  ProjectVo,
  TraitVo,
} from '@app-types/vo.types';

/**
 * @description 목록 조회 공통 파라미터 (페이징·검색). preload ListParams와 동일.
 */
export type ListParams = {
  page?: number;
  pageSize?: number;
  searchKeyword?: string;
  searchType?: string;
};

/** @deprecated ListParams 사용 권장 */
export type ProjectListParams = ListParams;
export type TraitListParams = ListParams;
export type AbilityListParams = ListParams;

/**
 * @description Electron API 타입 정의. contextBridge로 렌더러에 노출된 window.electron 구조와 동일.
 */
interface ElectronAPI {
  /**
   * @description IPC 통신 (설정 조회, ping, 창 제어). 엔드포인트 통신은 api 사용.
   */
  ipc: {
    ping: () => Promise<string>;
    getHonoBaseUrl: () => Promise<string>;
    getDbMode: () => Promise<'local' | 'remote'>;
    windowMinimize: () => Promise<void>;
    windowMaximizeRestore: () => Promise<void>;
    windowClose: () => Promise<void>;
  };

  /**
   * @description API 요청. Vue에서는 window.electron.api로 접근. 모든 API는 ResponseType/ListResponseType 구조로 반환.
   */
  api: {
    getHealth: () => Promise<ResponseType<HealthDto>>;

    getProjectList: (params?: ListParams) => (
      Promise<ListResponseType<ProjectVo>>
    );
    getProjectByNo: (prjNo: number) => (
      Promise<ResponseType<ProjectVo | null>>
    );
    postProject: (body: ProjectVo) => Promise<ResponseType<ProjectVo>>;
    patchProject: (prjNo: number, body: Partial<ProjectVo>) => (
      Promise<ResponseType<ProjectVo | null>>
    );
    deleteProject: (prjNo: number) => (
      Promise<ResponseType<{ deleted: boolean }>>
    );

    getTraitList: (params?: ListParams) => (
      Promise<ListResponseType<TraitVo>>
    );
    getTraitByNo: (traitNo: number) => (
      Promise<ResponseType<TraitVo | null>>
    );
    postTrait: (body: TraitVo) => Promise<ResponseType<TraitVo>>;
    patchTrait: (traitNo: number, body: Partial<TraitVo>) => (
      Promise<ResponseType<TraitVo | null>>
    );
    deleteTrait: (traitNo: number) => (
      Promise<ResponseType<{ deleted: boolean }>>
    );

    getAbilityList: (params?: ListParams) => (
      Promise<ListResponseType<AbilityVo>>
    );
    getAbilityByNo: (abilityNo: number) => (
      Promise<ResponseType<AbilityVo | null>>
    );
    postAbility: (body: AbilityVo) => Promise<ResponseType<AbilityVo>>;
    patchAbility: (abilityNo: number, body: Partial<AbilityVo>) => (
      Promise<ResponseType<AbilityVo | null>>
    );
    deleteAbility: (abilityNo: number) => (
      Promise<ResponseType<{ deleted: boolean }>>
    );

    getCoreRuleList: (prjNo: number, params?: ListParams) => (
      Promise<ListResponseType<CoreRuleListItemVo>>
    );
    getCoreRule: (prjNo: number, coreNo: number) => (
      Promise<ResponseType<CoreRuleVo | null>>
    );
    postCoreRule: (prjNo: number, body: Partial<CoreRuleVo>) => (
      Promise<ResponseType<CoreRuleVo>>
    );
    patchCoreRule: (prjNo: number, coreNo: number, body: Partial<CoreRuleVo>) => (
      Promise<ResponseType<CoreRuleVo | null>>
    );
    deleteCoreRule: (prjNo: number, coreNo: number) => (
      Promise<ResponseType<{ deleted: boolean }>>
    );

    getProjectTraitList: (prjNo: number, params?: ListParams) => (
      Promise<ListResponseType<ProjectTraitVo>>
    );
    getProjectTraitByNo: (prjNo: number, traitNo: number) => (
      Promise<ResponseType<ProjectTraitVo | null>>
    );
    postProjectTrait: (body: ProjectTraitVo) => Promise<ResponseType<ProjectTraitVo>>;
    patchProjectTrait: (prjNo: number, traitNo: number, body: Partial<ProjectTraitVo>) => (
      Promise<ResponseType<ProjectTraitVo | null>>
    );
    deleteProjectTrait: (prjNo: number, traitNo: number) => (
      Promise<ResponseType<{ deleted: boolean }>>
    );

    getProjectAbilityList: (prjNo: number, params?: ListParams) => (
      Promise<ListResponseType<ProjectAbilityVo>>
    );
    getProjectAbilityByNo: (prjNo: number, abilityNo: number) => (
      Promise<ResponseType<ProjectAbilityVo | null>>
    );
    postProjectAbility: (body: ProjectAbilityVo) => Promise<ResponseType<ProjectAbilityVo>>;
    patchProjectAbility: (prjNo: number, abilityNo: number, body: Partial<ProjectAbilityVo>) => (
      Promise<ResponseType<ProjectAbilityVo | null>>
    );
    deleteProjectAbility: (prjNo: number, abilityNo: number) => (
      Promise<ResponseType<{ deleted: boolean }>>
    );
  };
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {};
