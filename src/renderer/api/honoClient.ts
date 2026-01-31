import type { HealthDto } from '@app-types/dto';
import type { ResponseType } from '@app-types/response.types';

/**
 * Hono(메인 프로세스 내부 서버) API 클라이언트.
 * base URL은 window.electron.ipc.getHonoBaseUrl()(IPC)로 config에서 가져옵니다.
 * 모든 API는 HTTP 200 + ResponseType 구조. ResponseType 전체를 반환.
 */

export type { HealthDto };

async function getBaseUrl(): Promise<string> {
  if (!window.electron?.ipc?.getHonoBaseUrl) {
    throw new Error('Electron IPC를 사용할 수 없습니다.');
  }

  return window.electron.ipc.getHonoBaseUrl();
}

/**
 * GET /health — 서버 상태 조회
 */
export async function getHealth(): Promise<ResponseType<HealthDto>> {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/health`);

  if (!res.ok) {
    throw new Error(`Health check failed: ${res.status}`);
  }

  const body = (await res.json()) as ResponseType<HealthDto>;

  return body;
}
