import { join } from 'path';

import { app, BrowserWindow } from 'electron';

let mainWindow: BrowserWindow | null = null;

/**
 * 메인 윈도우를 생성합니다.
 */
export function createMainWindow(): BrowserWindow {
  if (mainWindow) {
    return mainWindow;
  }

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    // 메뉴바 비활성화 옵션 (템플릿 가이드)
    // 필요에 따라 아래 옵션 중 하나를 선택하여 주석을 해제하세요:
    //
    // 1. 메뉴바 자동 숨김 (Windows/Linux): Alt 키로 표시 가능
    // autoHideMenuBar: true,
    //
    // 2. 메뉴바 완전 제거: 아래 코드를 createMainWindow 함수 내부에 추가
    // import { Menu } from 'electron';
    // Menu.setApplicationMenu(null);
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  }
  else {
    mainWindow.loadFile(join(__dirname, '../../renderer/index.html'));
  }

  // 윈도우가 닫힐 때 참조 제거
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
}

/**
 * 메인 윈도우 인스턴스를 반환합니다.
 */
export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}

/**
 * 메인 윈도우를 엽니다.
 */
export function openMainWindow(): void {
  if (!mainWindow) {
    createMainWindow();
  }
  else if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }
  mainWindow?.focus();
}

/**
 * 메인 윈도우를 닫습니다.
 */
export function closeMainWindow(): void {
  if (mainWindow) {
    mainWindow.close();
    mainWindow = null;
  }
}

/**
 * 모든 윈도우가 닫혔을 때의 동작을 처리합니다.
 */
export function handleWindowAllClosed(): void {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}

/**
 * 앱이 활성화될 때 윈도우를 생성합니다.
 */
export function handleAppActivate(): void {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
}
