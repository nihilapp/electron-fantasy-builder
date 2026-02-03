import {
  ipcGetAbility,
  ipcGetHealth,
  ipcGetProject,
  ipcGetTrait
} from '../api';

import { ipcGetDbMode } from './ipcGetDbMode';
import { ipcGetHonoBaseUrl } from './ipcGetHonoBaseUrl';
import { ipcGetPing } from './ipcGetPing';
import { ipcWindowControl } from './ipcWindowControl';

/**
 * @description 모든 IPC 핸들러 등록. 각 IPC 통신은 별도 파일로 분리해 책임 소재를 명확히 함. 파일명·함수명 규칙: ipc<행위><대상> (예: ipcGetUser, ipcPostData). 함수명은 파일명과 동일.
 */
export function setupIpcHandlers() {
  ipcGetPing();
  ipcGetHonoBaseUrl();
  ipcGetDbMode();
  ipcWindowControl();
  ipcGetHealth();
  ipcGetProject();
  ipcGetTrait();
  ipcGetAbility();
}
