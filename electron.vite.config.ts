import { resolve } from 'path';

import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'electron-vite';
import type { UserConfig } from 'electron-vite';

export default defineConfig({
  main: {
    resolve: {
      alias: {
        '~': resolve(__dirname, 'src/renderer'),
        '@main': resolve(__dirname, 'src/main'),
        '@preload': resolve(__dirname, 'src/preload'),
        '@config': resolve(__dirname, 'config'),
        '@': resolve(__dirname),
      },
    },
    build: {
      externalizeDeps: true,
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/main/index.ts'),
        },
        // DB 관련 네이티브 모듈은 external로 설정 (필요시)
        // external: ['better-sqlite3', 'sqlite3'],
      },
    },
  } as UserConfig['main'],
  preload: {
    resolve: {
      alias: {
        '~': resolve(__dirname, 'src/renderer'),
        '@main': resolve(__dirname, 'src/main'),
        '@preload': resolve(__dirname, 'src/preload'),
        '@config': resolve(__dirname, 'config'),
        '@': resolve(__dirname),
      },
    },
    build: {
      externalizeDeps: true,
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/preload/index.ts'),
        },
        // DB 관련 네이티브 모듈은 external로 설정 (필요시)
        // external: ['better-sqlite3', 'sqlite3'],
      },
    },
  } as UserConfig['preload'],
  renderer: {
    root: 'src/renderer',
    plugins: [ vue(), tailwindcss(), ],
    server: {
      port: 3000,
    },
    resolve: {
      alias: {
        '~': resolve(__dirname, 'src/renderer'),
        '@main': resolve(__dirname, 'src/main'),
        '@preload': resolve(__dirname, 'src/preload'),
        '@config': resolve(__dirname, 'config'),
        '@': resolve(__dirname),
      },
    },
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html'),
        },
      },
    },
  } as UserConfig['renderer'],
});
