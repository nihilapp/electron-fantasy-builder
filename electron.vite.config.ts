import { resolve } from 'path';

import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'electron-vite';
import type { UserConfig } from 'electron-vite';
import AutoImport from 'unplugin-auto-import/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import Components from 'unplugin-vue-components/vite';

export default defineConfig({
  main: {
    resolve: {
      alias: {
        '~': resolve(__dirname, 'src/renderer'),
        '@main': resolve(__dirname, 'src/main'),
        '@preload': resolve(__dirname, 'src/preload'),
        '@config': resolve(__dirname, 'src/config'),
        '@app-types': resolve(__dirname, 'src/types'),
        '@drizzle': resolve(__dirname, 'src/drizzle'),
        '@data': resolve(__dirname, 'src/data'),
        '@constants': resolve(__dirname, 'src/constants'),
        '@zod-schema': resolve(__dirname, 'src/zod-schema'),
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
        '@config': resolve(__dirname, 'src/config'),
        '@app-types': resolve(__dirname, 'src/types'),
        '@drizzle': resolve(__dirname, 'src/drizzle'),
        '@data': resolve(__dirname, 'src/data'),
        '@constants': resolve(__dirname, 'src/constants'),
        '@zod-schema': resolve(__dirname, 'src/zod-schema'),
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
    plugins: [
      vue(),
      tailwindcss(),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          {
            from: 'pinia',
            imports: [ 'defineStore', 'storeToRefs', ],
          },
        ],
        dirs: [ 'composables', ],
        dts: 'auto-imports.d.ts',
        eslintrc: {
          enabled: true,
          filepath: '.eslintrc-auto-import.json',
          globalsPropValue: true,
        },
      }),
      Components({
        dirs: [ 'components', ],
        dts: 'components.d.ts',
        resolvers: [
          IconsResolver({
            prefix: 'icon',
            enabledCollections: [
              'mdi',
              'lucide',
              'ph',
              'tabler',
              'carbon',
              'heroicons',
              'bx',
              'ri',
              'game-icons',
              'fa6-solid',
            ],
          }),
        ],
      }),
      Icons({
        autoInstall: true,
        compiler: 'vue3',
      }),
    ],
    server: {
      host: '127.0.0.1', // IPv4 고정 — Windows에서 ::1:3000 EACCES 방지
      port: 3000,
    },
    resolve: {
      alias: {
        '~': resolve(__dirname, 'src/renderer'),
        '@main': resolve(__dirname, 'src/main'),
        '@preload': resolve(__dirname, 'src/preload'),
        '@config': resolve(__dirname, 'src/config'),
        '@app-types': resolve(__dirname, 'src/types'),
        '@drizzle': resolve(__dirname, 'src/drizzle'),
        '@data': resolve(__dirname, 'src/data'),
        '@constants': resolve(__dirname, 'src/constants'),
        '@zod-schema': resolve(__dirname, 'src/zod-schema'),
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
