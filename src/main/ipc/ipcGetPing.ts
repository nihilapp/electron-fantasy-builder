import { ipcMain } from 'electron';

/**
 * @description ping IPC 핸들러 등록. 렌더러에서 ping 시 pong 반환.
 */
export function ipcGetPing() {
  ipcMain.handle(
    'ipc:ping',
    async () => {
      return 'pong';
    }
  );
}
