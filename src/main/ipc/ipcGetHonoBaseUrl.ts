import { ipcMain } from 'electron';

import type { AppConfig } from '@app-types/config.types';
import appConfig from '@config/app.json';

/**
 * @description Hono(메인 프로세스 내부 서버) base URL 반환. config.api.baseURL과 동일. 렌더러에서 Hono API 호출 시 사용.
 */
export function ipcGetHonoBaseUrl() {
  ipcMain.handle(
    'hono:get-base-url',
    () => {
      const config = appConfig as AppConfig;

      return config.api?.baseURL
        ?? `http://localhost:${config.server?.port ?? 3456}`;
    }
  );
}
