import type { ServerType } from '@hono/node-server';
import { serve } from '@hono/node-server';

import type { AppConfig } from '@app-types/config.types';
import appConfig from '@config/app.json';
import { createTaggedLogger } from '@main/logger';

import { honoApp } from './honoApp';

const log = createTaggedLogger('Hono');

let serverInstance: ServerType | null = null;

/**
 * config/app.json의 server.port, server.hostname으로 Hono HTTP 서버를 시작합니다.
 * 앱 종료 시 closeHonoServer()로 정리해야 합니다.
 */
export function startHonoServer(): ServerType {
  const config = appConfig as AppConfig;
  const port = config.server?.port ?? 3456;
  const hostname = config.server?.hostname ?? 'localhost';

  serverInstance = serve(
    {
      fetch: honoApp.fetch,
      port,
      hostname,
    },
    (info) => {
      log.log(`Listening on http://${info.address}:${info.port}`);
    }
  );

  return serverInstance;
}

/**
 * Hono 서버를 종료합니다. Electron 앱 종료 시 호출합니다.
 */
export function closeHonoServer(): Promise<void> {
  return new Promise((resolve) => {
    if (!serverInstance) {
      resolve();
      return;
    }
    serverInstance.close(() => {
      serverInstance = null;
      log.log('Server closed');
      resolve();
    });
  });
}
