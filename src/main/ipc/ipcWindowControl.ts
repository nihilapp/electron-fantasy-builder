import { ipcMain } from 'electron';

import { getMainWindow } from '../window/mainWindow';

const CHANNEL_MINIMIZE = 'window:minimize';
const CHANNEL_MAXIMIZE_RESTORE = 'window:maximize-restore';
const CHANNEL_CLOSE = 'window:close';

/**
 * 창 제어 IPC 핸들러를 등록합니다.
 * 커스텀 타이틀바(AppTitlebar) 버튼에서 호출합니다.
 */
export function ipcWindowControl() {
  ipcMain.handle(CHANNEL_MINIMIZE, () => {
    const win = getMainWindow();
    if (win && !win.isDestroyed()) {
      win.minimize();
    }
  });

  ipcMain.handle(CHANNEL_MAXIMIZE_RESTORE, () => {
    const win = getMainWindow();
    if (!win || win.isDestroyed()) return;
    if (win.isMaximized()) {
      win.unmaximize();
    }
    else {
      win.maximize();
    }
  });

  ipcMain.handle(CHANNEL_CLOSE, () => {
    const win = getMainWindow();
    if (win && !win.isDestroyed()) {
      win.close();
    }
  });
}
