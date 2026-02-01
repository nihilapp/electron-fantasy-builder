import type { HealthDto } from '@app-types/dto.types';
import type { ListResponseType, ResponseType } from '@app-types/response.types';
import type { ProjectVo, TraitVo, AbilityVo } from '@app-types/vo.types';

/** 프로젝트 목록 조회 파라미터 (페이징·검색) */
export type ProjectListParams = {
  page?: number;
  pageSize?: number;
  searchKeyword?: string;
  searchType?: string;
};

/** 트레잇/어빌리티 목록 조회 파라미터 */
export type TraitListParams = ProjectListParams;
export type AbilityListParams = ProjectListParams;

/**
 * Electron API 타입 정의
 */
interface ElectronAPI {
  /**
   * IPC 통신 함수들
   */
  ipc: {
    /**
     * ping을 보내고 pong 응답을 받습니다.
     * @returns Promise<string> 'pong' 문자열을 반환합니다.
     */
    ping: () => Promise<string>;
    /**
     * Hono 서버 base URL (설정 조회). fetch 직접 호출 시 사용.
     */
    getHonoBaseUrl: () => Promise<string>;
    /**
     * DB 모드 조회 (참고용). 'local' | 'remote'
     */
    getDbMode: () => Promise<'local' | 'remote'>;
    /** 창 최소화 (커스텀 타이틀바) */
    windowMinimize: () => Promise<void>;
    /** 창 최대화/복구 토글 (커스텀 타이틀바) */
    windowMaximizeRestore: () => Promise<void>;
    /** 창 닫기 (커스텀 타이틀바) */
    windowClose: () => Promise<void>;
  };

  /**
   * API 요청 함수들. Vue에서는 API 호출 시 반드시 window.electron.api 로 접근.
   * 모든 API는 HTTP 200 + ResponseType 구조. ResponseType 전체를 반환.
   */
  api: {
    getHealth: () => Promise<ResponseType<HealthDto>>;

    /** 프로젝트 */
    getProjectList: (params?: ProjectListParams) => Promise<ListResponseType<ProjectVo>>;
    getProjectByNo: (prjNo: number) => Promise<ResponseType<ProjectVo | null>>;
    postProject: (body: ProjectVo) => Promise<ResponseType<ProjectVo>>;
    patchProject: (prjNo: number, body: Partial<ProjectVo>) => Promise<ResponseType<ProjectVo | null>>;
    deleteProject: (prjNo: number) => Promise<ResponseType<{ deleted: boolean }>>;

    /** 트레잇 */
    getTraitList: (params?: TraitListParams) => Promise<ListResponseType<TraitVo>>;
    getTraitByNo: (traitNo: number) => Promise<ResponseType<TraitVo | null>>;
    postTrait: (body: TraitVo) => Promise<ResponseType<TraitVo>>;
    patchTrait: (traitNo: number, body: Partial<TraitVo>) => Promise<ResponseType<TraitVo | null>>;
    deleteTrait: (traitNo: number) => Promise<ResponseType<{ deleted: boolean }>>;

    /** 어빌리티 */
    getAbilityList: (params?: AbilityListParams) => Promise<ListResponseType<AbilityVo>>;
    getAbilityByNo: (abilityNo: number) => Promise<ResponseType<AbilityVo | null>>;
    postAbility: (body: AbilityVo) => Promise<ResponseType<AbilityVo>>;
    patchAbility: (abilityNo: number, body: Partial<AbilityVo>) => Promise<ResponseType<AbilityVo | null>>;
    deleteAbility: (abilityNo: number) => Promise<ResponseType<{ deleted: boolean }>>;
  };
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {};
