import type { ResponseType } from '@app-types/response.types';
import type { UserVo } from '@app-types/vo.types';

/**
 * Auth API Client.
 * Uses fetch with credentials to handle HttpOnly Cookies.
 */

async function getBaseUrl(): Promise<string> {
  if (!window.electron?.ipc?.getHonoBaseUrl) {
    throw new Error('Electron IPC를 사용할 수 없습니다.');
  }
  return window.electron.ipc.getHonoBaseUrl();
}

export async function signin(userEml: string, enpswd: string): Promise<ResponseType<UserVo>> {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Cookie 포함
    body: JSON.stringify({ userEml, enpswd, }),
  });

  return await res.json();
}

export async function signout(): Promise<ResponseType<null>> {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/auth/signout`, {
    method: 'POST',
    credentials: 'include',
  });

  return await res.json();
}

export async function getMe(): Promise<ResponseType<UserVo>> {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/auth/me`, {
    method: 'GET',
    credentials: 'include',
  });

  return await res.json();
}
