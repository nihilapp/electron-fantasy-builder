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
