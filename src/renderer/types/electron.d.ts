import type { ExampleDto, HealthDto } from '@app-types/dto';
import type { ListResponseType, ResponseType } from '@app-types/response.types';

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
  };

  /**
   * API 요청 함수들. Vue에서는 API 호출 시 반드시 window.electron.api 로 접근.
   * 모든 API는 HTTP 200 + ResponseType 구조. ResponseType 전체를 반환.
   */
  api: {
    /**
     * Health 상태 조회
     * @returns ResponseType<HealthDto> (data, error, code, message)
     */
    getHealth: () => Promise<ResponseType<HealthDto>>;
    /**
     * Example 목록 조회
     * @returns ListResponseType<ExampleDto> (data(list·totalCnt·페이징), error, code, message)
     */
    getExample: () => Promise<ListResponseType<ExampleDto>>;
  };
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {};
