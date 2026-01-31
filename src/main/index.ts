import { app } from 'electron';

import { setupIpcHandlers } from './ipc';
import { closeHonoServer, startHonoServer } from './server';
import { closeDb, initDbContext } from './server/db';
import {
  createMainWindow,
  handleAppActivate,
  handleWindowAllClosed
} from './window/mainWindow';

app.whenReady().then(() => {
  // DB context 초기화 (연결은 getDb() 호출 시 지연 생성)
  initDbContext();

  // IPC 핸들러 등록
  setupIpcHandlers();

  // 메인 프로세스 내 Hono HTTP 서버 시작
  startHonoServer();

  // 메인 윈도우 생성
  createMainWindow();

  // 앱 활성화 이벤트 핸들러
  app.on('activate', handleAppActivate);
});

// 모든 윈도우가 닫혔을 때의 이벤트 핸들러
app.on('window-all-closed', handleWindowAllClosed);

// 앱 종료 전 DB 연결·Hono 서버 정리 (비동기이므로 기본 종료를 막고 정리 후 exit)
let isQuitting = false;
app.on('before-quit', (event) => {
  if (isQuitting) return;
  event.preventDefault();
  isQuitting = true;
  closeDb();
  closeHonoServer().then(() => {
    app.exit(0);
  });
});
