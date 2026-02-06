import { join } from 'path';

import { app, Menu, nativeImage, Tray } from 'electron';

import { openMainWindow } from './mainWindow';

let tray: Tray | null = null;

/**
 * 트레이 아이콘용 이미지를 반환합니다.
 * resources/tray.png가 있으면 사용하고, 없으면 내장 base64 아이콘(16x16)을 씁니다.
 */
function getTrayIcon(): Electron.NativeImage {
  // 빌드 후 __dirname = out/main, 개발 시에도 out/main
  const iconPath = join(__dirname, '..', '..', 'resources', 'tray.png');
  const fromPath = nativeImage.createFromPath(iconPath);
  if (!fromPath.isEmpty()) {
    return fromPath;
  }
  // fallback: 16x16 단색 아이콘 (base64 PNG)
  return nativeImage.createFromDataURL(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHklEQVQ4T2NkYGD4z0ABYBw1gGE0DBhGwwCIBQwMAAAOngLp1mVnHgAAAABJRU5ErkJggg=='
  );
}

/**
 * 시스템 트레이를 생성합니다.
 * 메인 윈도우 생성 후 호출하세요.
 */
export function createTray(): Tray | null {
  if (tray) {
    return tray;
  }

  const icon = getTrayIcon();
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '창 열기',
      click: () => {
        openMainWindow();
      },
    },
    { type: 'separator', },
    {
      label: '종료',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('FANTASY BUILDER');

  // Windows: 클릭 시 창 표시 (맥은 컨텍스트 메뉴만)
  tray.on('click', () => {
    openMainWindow();
  });

  return tray;
}

/**
 * 트레이를 제거합니다. 앱 종료 전 호출할 수 있습니다.
 */
export function destroyTray(): void {
  if (tray) {
    tray.destroy();
    tray = null;
  }
}

/**
 * 트레이 인스턴스를 반환합니다.
 */
export function getTray(): Tray | null {
  return tray;
}
