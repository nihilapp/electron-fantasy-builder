import { ipcMain } from 'electron';

import appConfig from '@config/app.json';
import type { AppConfig, DbMode } from '@config/types';

/**
 * DB 모드(로컬/리모트) 조회 IPC 핸들러.
 * config/app.json의 db.mode 값을 반환합니다. 참고용 UI에서 사용합니다.
 */
export function ipcGetDbMode() {
  ipcMain.handle('ipc:get-db-mode', (): DbMode => {
    const config = appConfig as AppConfig;
    const mode = config.db?.mode ?? 'local';
    return mode === 'remote'
      ? 'remote'
      : 'local';
  });
}
