import { ipcMain } from 'electron';

import { getMainWindow } from '../window/mainWindow';

/** @description 최소화 IPC 채널명 */
const CHANNEL_MINIMIZE = 'window:minimize';
/** @description 최대화/복원 IPC 채널명 */
const CHANNEL_MAXIMIZE_RESTORE = 'window:maximize-restore';
/** @description 닫기 IPC 채널명 */
const CHANNEL_CLOSE = 'window:close';

/**
 * @description 창 제어 IPC 핸들러 등록. 커스텀 타이틀바(AppTitlebar) 버튼에서 호출.
 */
export function ipcWindowControl() {
  ipcMain.handle(
    CHANNEL_MINIMIZE,
    () => {
      const win = getMainWindow();
      if (win && !win.isDestroyed()) {
        win.minimize();
      }
    }
  );

  ipcMain.handle(
    CHANNEL_MAXIMIZE_RESTORE,
    () => {
      const win = getMainWindow();
      if (!win || win.isDestroyed()) return;
      if (win.isMaximized()) {
        win.unmaximize();
      }
      else {
        win.maximize();
      }
    }
  );

  ipcMain.handle(
    CHANNEL_CLOSE,
    () => {
      const win = getMainWindow();
      if (win && !win.isDestroyed()) {
        win.close();
      }
    }
  );
}
