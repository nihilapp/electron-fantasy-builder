import { ipcMain } from 'electron';

/**
 * ping IPC 핸들러를 등록합니다.
 * 렌더러에서 ping을 보내면 pong을 반환합니다.
 */
export function ipcGetPing() {
  ipcMain.handle('ipc:ping', async () => {
    return 'pong';
  });
}
