import { join } from 'path';

import { app, BrowserWindow } from 'electron';

import { getTray } from './tray';

let mainWindow: BrowserWindow | null = null;

/** 트레이로 숨길 때만 창 닫기를 막기 위한 플래그 (before-quit에서 true로 설정) */
let isQuitting = false;

export function setQuittingFlag(value: boolean): void {
  isQuitting = value;
}

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

  // 트레이 사용 시: X 버튼으로 닫으면 창만 숨기고 트레이에 유지
  mainWindow.on('close', (e) => {
    if (!isQuitting && getTray()) {
      e.preventDefault();
      mainWindow?.hide();
      return;
    }
    mainWindow = null;
  });

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
 * 트레이에서 "창 열기" 시 숨겨진 창을 다시 표시합니다.
 */
export function openMainWindow(): void {
  if (!mainWindow) {
    createMainWindow();
    return;
  }
  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }
  if (!mainWindow.isVisible()) {
    mainWindow.show();
  }
  mainWindow.focus();
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
 * 트레이가 있으면 앱을 종료하지 않고 트레이에만 남깁니다.
 */
export function handleWindowAllClosed(): void {
  if (getTray()) {
    return; // 트레이 모드: 앱 유지
  }
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
