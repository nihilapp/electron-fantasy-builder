import { execSync } from 'node:child_process';

/** Windows: 터미널 로그 한글 깨짐 방지. 콘솔 코드페이지를 UTF-8(65001)로 설정. .bashrc의 LANG만으로는 Windows 콘솔 코드페이지가 바뀌지 않음. */
if (process.platform === 'win32') {
  try {
    execSync('cmd /c "chcp 65001 >nul 2>&1"', { stdio: 'ignore', });
  }
  catch {
    // 실패해도 앱은 계속 동작
  }
}

import { app } from 'electron';

import { setupIpcHandlers } from './ipc';
import { closeHonoServer, startHonoServer } from './server';
import { closeDb, initDbContext } from './server/db';
import {
  createMainWindow,
  handleAppActivate,
  handleWindowAllClosed,
  setQuittingFlag
} from './window/mainWindow';
import { createTray } from './window/tray';

/** @description 앱 준비 완료 시: DB·IPC·서버·윈도우·트레이 초기화 및 activate 핸들러 등록 */
app.whenReady().then(() => {
  initDbContext();
  setupIpcHandlers();
  startHonoServer();
  createMainWindow();
  createTray();
  app.on('activate', handleAppActivate);
});

app.on('window-all-closed', handleWindowAllClosed);

/** @description 앱 종료 전 DB·Hono 서버 정리 후 exit (비동기 정리이므로 기본 종료를 막고 완료 후 exit) */
let isQuitting = false;
app.on('before-quit', async (event) => {
  if (isQuitting) return;

  event.preventDefault();

  isQuitting = true;

  setQuittingFlag(true);
  closeDb();

  await closeHonoServer();
  app.exit(0);
});
