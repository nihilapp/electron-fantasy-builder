import { ipcGetExample, ipcGetHealth } from '../api';

import { ipcGetDbMode } from './ipcGetDbMode';
import { ipcGetHonoBaseUrl } from './ipcGetHonoBaseUrl';
import { ipcGetPing } from './ipcGetPing';

/**
 * 모든 IPC 핸들러를 등록합니다.
 * 각 IPC 통신은 별도 파일로 분리되어 책임 소재를 명확하게 합니다.
 *
 * 파일명 및 함수명 규칙: ipc<행위><대상>
 * 예: ipcGetUser, ipcPostData, ipcDeleteFile, ipcUpdateConfig
 * 함수명은 파일명과 동일합니다.
 */
export function setupIpcHandlers() {
  ipcGetPing();
  ipcGetHonoBaseUrl();
  ipcGetDbMode();
  ipcGetHealth();
  ipcGetExample();
}
